const express = require('express');
const {
  getAllPosts,
  getPostBySlug,
  getPostById,
  createPost,
  updatePost,
  deletePost,
} = require('../controllers/postController');
const verifyToken = require('../middlewares/verifyToken');
const requireAdmin = require('../middlewares/requireAdmin');

const router = express.Router();

router.get('/', getAllPosts);
router.get('/id/:id', verifyToken, requireAdmin, getPostById);
router.get('/:slug', getPostBySlug);
router.post('/', verifyToken, requireAdmin, createPost);
router.put('/:id', verifyToken, requireAdmin, updatePost);
router.delete('/:id', verifyToken, requireAdmin, deletePost);

module.exports = router;
