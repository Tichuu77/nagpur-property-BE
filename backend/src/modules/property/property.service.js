import propertyRepository from '../../modules/property/property.repository.js';
import storageService from '../../services/storage.service.js';

 

const propertyService = {
  /**
   * List properties with server-side filtering and pagination.
   */
  listProperties: async (params) => {
    const result = await propertyRepository.findAll(params);
    return result 
  },

  /**
   * Get admin-facing stats
   */
  getStats: async () => {
    return propertyRepository.getStats();
  },

  /**
   * Get a single property by ID
   * FIX: findById now uses .lean() so we get a plain object — safe to mutate/spread
   */
  getProperty: async (id) => {
    const property = await propertyRepository.findById(id);
    if (!property) throw { status: 404, message: 'Property not found' };
    return property;
  },

  /**
   * Create a new property
   */
  createProperty: async (payload, photoFiles = [], videoFile = null) => {
    if (photoFiles.length > 15) {
      throw { status: 400, message: 'Maximum 15 photos allowed' };
    }

    const [photoUploads, videoUpload] = await Promise.all([
      photoFiles.length > 0
        ? Promise.all(photoFiles.map((f) => storageService.upload(f, 'properties')))
        : Promise.resolve([]),
      videoFile
        ? storageService.upload(videoFile, 'properties/videos')
        : Promise.resolve(null),
    ]);

    const property = await propertyRepository.create({
      ...payload,
      photos: photoUploads.map((u) => u.url),
      video:  videoUpload ? videoUpload.url : null,
    });

    // create returns a mongoose doc — convert to plain object for media formatting
    return  property
  },

  /**
   * Update a property
   */
  updateProperty: async (id, payload, photoFiles = [], videoFile = null) => {
    const existing = await propertyRepository.findByIdRaw(id);
    if (!existing) throw { status: 404, message: 'Property not found' };

    let photos = existing.photos || [];
    if (photoFiles.length > 0) {
      if (photos.length + photoFiles.length > 15) {
        throw { status: 400, message: 'Maximum 15 photos allowed in total' };
      }
      const uploads = await Promise.all(
        photoFiles.map((f) => storageService.upload(f, 'properties'))
      );
      photos = [...photos, ...uploads.map((u) => u.url)];
    }

    let video = existing.video;
    if (payload.removeVideo) {
      // FIX: support explicit video removal flag from frontend
      if (video) {
        try {
          await storageService.delete(video);
        } catch { /* best effort */ }
      }
      video = null;
      delete payload.removeVideo;
    } else if (videoFile) {
      const uploaded = await storageService.upload(videoFile, 'properties/videos');
      video = uploaded.url;
    }

    const updated = await propertyRepository.updateById(id, {
      ...payload,
      photos,
      video,
    });

    return  updated
  },

  /**
   * Delete property and clean up S3 assets
   */
  deleteProperty: async (id) => {
    const property = await propertyRepository.findByIdRaw(id);
    if (!property) throw { status: 404, message: 'Property not found' };

    const filesToDelete = [
      ...(property.photos || []),
      ...(property.video ? [property.video] : []),
    ];

    if (filesToDelete.length > 0) {
      await Promise.allSettled(
        filesToDelete.map((url) => {
          try {
            return storageService.delete(url);
          } catch {
            return Promise.resolve();
          }
        })
      );
    }

    await propertyRepository.deleteById(id);
  },

  /**
   * Change property status
   */
  updateStatus: async (id, status, options = {}) => {
    const property = await propertyRepository.findByIdRaw(id);
    if (!property) throw { status: 404, message: 'Property not found' };

    const update = { status };
    if (options.adminNotes)     update.adminNotes     = options.adminNotes;
    if (options.rejectedReason) update.rejectedReason = options.rejectedReason;

    const updated = await propertyRepository.updateById(id, update);
    return  updated
  },

  /**
   * Toggle featured flag
   */
  toggleFeatured: async (id) => {
    const property = await propertyRepository.findByIdRaw(id);
    if (!property) throw { status: 404, message: 'Property not found' };

    const updated = await propertyRepository.updateById(id, { featured: !property.featured });
    return  updated
  },

  /**
   * Set featured flag explicitly
   */
  setFeatured: async (id, featured) => {
    const property = await propertyRepository.findByIdRaw(id);
    if (!property) throw { status: 404, message: 'Property not found' };

    const updated = await propertyRepository.updateById(id, { featured: !!featured });
    return  updated
  },

  /**
   * Remove specific photos by URL
   */
  removePhotos: async (id, photoUrls) => {
    const property = await propertyRepository.findByIdRaw(id);
    if (!property) throw { status: 404, message: 'Property not found' };

    const remaining = property.photos.filter((url) => !photoUrls.includes(url));
    if (remaining.length === 0) {
      throw { status: 400, message: 'Property must have at least one photo' };
    }

    await Promise.allSettled(
      photoUrls.map((url) => {
        try {
          return storageService.delete(url);
        } catch {
          return Promise.resolve();
        }
      })
    );

    const updated = await propertyRepository.updateById(id, { photos: remaining });
    return  updated
  },
};

export default propertyService;