import propertyRepository from '../../modules/property/property.repository.js';
import storageService from '../../services/storage.service.js';

const propertyService = {
  /**
   * List properties with server-side filtering and pagination.
   */
  listProperties: async (params) => {
    const  result = await propertyRepository.findAll(params);
    const properties = result.data;
    const formatted = properties.map((p) => {
      const photos = p.photos || [];
      const video  = p.video ? [p.video] : [];
      const formattedPhotos = photos.map((url) => {
        return `${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET}${url}`;
      });
      const formattedVideo = video.map((url) => {
        return `${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET}${url}`;
      });
        
      return {
        ...p,
        photos: formattedPhotos,
        video: formattedVideo.length > 0 ? formattedVideo[0] : null,
      }
    });

    return{
      ...result,
      data: formatted,
    } 
  },

  /**
   * Get admin-facing stats
   */
  getStats: async () => {
    return propertyRepository.getStats();
  },

  /**
   * Get a single property by ID
   */
  getProperty: async (id) => {
    const property = await propertyRepository.findById(id);
    if (!property) throw { status: 404, message: 'Property not found' };
    const photos = property.photos || [];
    const video  = property.video ? [property.video] : [];
    const formattedPhotos = photos.map((url) => {
      return `${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET}${url}`;
    }
    );
    const formattedVideo = video.map((url) => {
      return `${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET}${url}`;
    }
    );
    property.photos = formattedPhotos;
    property.video = formattedVideo.length > 0 ? formattedVideo[0] : null;
    return property;
  },

  /**
   * Create a new property (admin creates on behalf of broker)
   * Handles up to 15 photo uploads + 1 video upload via S3.
   */
  createProperty: async (payload, photoFiles = [], videoFile = null) => {
    // Upload photos
    if (photoFiles.length > 15) {
      throw { status: 400, message: 'Maximum 15 photos allowed' };
    }

    let photos = [];
    if (photoFiles.length > 0) {
      const uploads = await Promise.all(
        photoFiles.map((f) => storageService.upload(f, 'properties'))
      );
      photos = uploads.map((u) => u.url);
    }

    // Upload video
    let video = null;
    if (videoFile) {
      const uploaded = await storageService.upload(videoFile, 'properties/videos');
      video = uploaded.url;
    }

    const property = await propertyRepository.create({
      ...payload,
      photos,
      video,
    });

    return property;
  },

  /**
   * Update a property
   */
  updateProperty: async (id, payload, photoFiles = [], videoFile = null) => {
    const existing = await propertyRepository.findByIdRaw(id);
    if (!existing) throw { status: 404, message: 'Property not found' };

    // Handle new photo uploads (append to existing)
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

    // Handle video upload
    let video = existing.video;
    if (videoFile) {
      const uploaded = await storageService.upload(videoFile, 'properties/videos');
      video = uploaded.url;
    }

    const updated = await propertyRepository.updateById(id, {
      ...payload,
      photos,
      video,
    });

    return updated;
  },

  /**
   * Delete property and clean up S3 assets
   */
  deleteProperty: async (id) => {
    const property = await propertyRepository.findByIdRaw(id);
    if (!property) throw { status: 404, message: 'Property not found' };

    // Delete photos from S3 (best effort)
    if (property.photos?.length > 0) {
      await Promise.allSettled(
        property.photos.map((url) => {
          // Extract S3 key from URL
          try {
            const key =  url.startsWith('/') ? url.slice(1) : url;
            return storageService.delete(key);
          } catch {
            return Promise.resolve();
          }
        })
      );
    }

    await propertyRepository.deleteById(id);
  },

  /**
   * Change property status (approve / reject / activate / deactivate / mark sold etc.)
   */
  updateStatus: async (id, status, options = {}) => {
    const property = await propertyRepository.findByIdRaw(id);
    if (!property) throw { status: 404, message: 'Property not found' };

    const update = { status };
    if (options.adminNotes)    update.adminNotes    = options.adminNotes;
    if (options.rejectedReason) update.rejectedReason = options.rejectedReason;

    return propertyRepository.updateById(id, update);
  },

  /**
   * Toggle featured flag
   */
  toggleFeatured: async (id) => {
    const property = await propertyRepository.findByIdRaw(id);
    if (!property) throw { status: 404, message: 'Property not found' };

    return propertyRepository.updateById(id, { featured: !property.featured });
  },

  /**
   * Set featured flag explicitly
   */
  setFeatured: async (id, featured) => {
    const property = await propertyRepository.findByIdRaw(id);
    if (!property) throw { status: 404, message: 'Property not found' };

    return propertyRepository.updateById(id, { featured: !!featured });
  },

  /**
   * Remove specific photos by index or URL
   */
  removePhotos: async (id, photoUrls) => {
    const property = await propertyRepository.findByIdRaw(id);
    if (!property) throw { status: 404, message: 'Property not found' };

    const remaining = property.photos.filter((url) => !photoUrls.includes(url));
    if (remaining.length === 0) {
      throw { status: 400, message: 'Property must have at least one photo' };
    }

    // Delete removed photos from S3
    await Promise.allSettled(
      photoUrls.map((url) => {
        try {
          const key = url.startsWith('/') ? url.slice(1) : url;
          return storageService.delete(key);
        } catch {
          return Promise.resolve();
        }
      })
    );

    return propertyRepository.updateById(id, { photos: remaining });
  },
};

export default propertyService;