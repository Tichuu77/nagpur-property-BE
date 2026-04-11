import multer from 'multer';

// Use memory storage — files go directly to S3, not disk
const storage = multer.memoryStorage();

// File filter (security)
const fileFilter = (_req, file, cb) => {
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/pdf',
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'), false);
  }
};

const limits = {
  fileSize: 10 * 1024 * 1024, // 10MB
};

const upload = multer({ storage, fileFilter, limits });

export default upload;