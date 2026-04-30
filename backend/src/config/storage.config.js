import multer from 'multer';

// Use memory storage — files go directly to S3, not disk
const storage = multer.memoryStorage();

// File filter (security)
const fileFilter = (_req, file, cb) => {
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'video/mp4', //videos
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'), false);
  }
};

const limits = {
  fileSize:  50 * 1024 * 1024 // 50MB
};

const upload = multer({ storage, fileFilter, limits });

export default upload;