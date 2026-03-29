const express = require('express');
const multer = require('multer');
const verifyToken = require('../middlewares/verifyToken');
const requireAdmin = require('../middlewares/requireAdmin');
const upload = require('../config/multer');

const router = express.Router();

router.post('/', verifyToken, requireAdmin, (req, res) => {
  upload.single('image')(req, res, (err) => {
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

    res.status(200).json({ url: `/uploads/${req.file.filename}` });
  });
});

module.exports = router;
