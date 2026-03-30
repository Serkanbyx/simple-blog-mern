const express = require('express');
const multer = require('multer');
const verifyToken = require('../middlewares/verifyToken');
const requireAdmin = require('../middlewares/requireAdmin');
const upload = require('../config/multer');
const cloudinary = require('../config/cloudinary');

const router = express.Router();

router.post('/', verifyToken, requireAdmin, (req, res) => {
  upload.single('image')(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'File too large. Maximum size is 5 MB.' });
      }
      return res.status(400).json({ message: err.message });
    }

    if (err) {
      return res.status(400).json({ message: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided.' });
    }

    try {
      const b64 = Buffer.from(req.file.buffer).toString('base64');
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;

      const result = await cloudinary.uploader.upload(dataURI, {
        folder: 'simple-blog',
        resource_type: 'image',
      });

      res.status(200).json({ url: result.secure_url });
    } catch (uploadError) {
      console.error('[CLOUDINARY ERROR]', uploadError.message);
      res.status(500).json({ message: 'Image upload failed.' });
    }
  });
});

module.exports = router;
