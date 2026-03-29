const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const slugify = require('slugify');
const crypto = require('crypto');
const Post = require('../models/Post');

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 6;
const MAX_LIMIT = 20;
const MAX_TITLE_LENGTH = 200;
const MAX_TAGS_COUNT = 10;

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// GET /api/posts
const getAllPosts = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || DEFAULT_PAGE, 1);
    const limit = Math.min(parseInt(req.query.limit) || DEFAULT_LIMIT, MAX_LIMIT);
    const { category, tag, search } = req.query;

    const filter = {};

    if (category) {
      filter.category = category.trim();
    }

    if (tag) {
      filter.tags = tag.trim();
    }

    if (search) {
      filter.title = { $regex: search.trim(), $options: 'i' };
    }

    const skip = (page - 1) * limit;

    const [posts, totalPosts] = await Promise.all([
      Post.find(filter)
        .select('-content')
        .populate('author', 'username')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Post.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalPosts / limit) || 1;

    res.json({ posts, currentPage: page, totalPages, totalPosts });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// GET /api/posts/:slug
const getPostBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    if (!SLUG_REGEX.test(slug)) {
      return res.status(400).json({ message: 'Invalid slug format.' });
    }

    const post = await Post.findOne({ slug }).populate('author', 'username');

    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// GET /api/posts/id/:id (admin — fetch single post by ObjectId)
const getPostById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid post ID format.' });
    }

    const post = await Post.findById(id).populate('author', 'username');

    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// POST /api/posts (admin only)
const createPost = async (req, res) => {
  try {
    const { title, content, image, category, tags } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Title is required.' });
    }

    if (title.trim().length > MAX_TITLE_LENGTH) {
      return res.status(400).json({ message: `Title must be at most ${MAX_TITLE_LENGTH} characters.` });
    }

    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'Content is required.' });
    }

    if (!category || !category.trim()) {
      return res.status(400).json({ message: 'Category is required.' });
    }

    const sanitizedTags = Array.isArray(tags)
      ? tags.map((t) => t.trim()).filter(Boolean).slice(0, MAX_TAGS_COUNT)
      : [];

    const postData = {
      title: title.trim(),
      content: content.trim(),
      image: image ? image.trim() : '',
      category: category.trim(),
      tags: sanitizedTags,
      author: req.user.id,
    };

    let post;
    try {
      post = await Post.create(postData);
    } catch (err) {
      if (err.code === 11000 && err.keyPattern?.slug) {
        const suffix = crypto.randomBytes(3).toString('hex');
        postData.slug = slugify(postData.title, { lower: true, strict: true }) + '-' + suffix;
        post = await Post.create(postData);
      } else {
        throw err;
      }
    }

    const populated = await post.populate('author', 'username');

    res.status(201).json(populated);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const firstMessage = Object.values(error.errors)[0]?.message;
      return res.status(400).json({ message: firstMessage || 'Validation error.' });
    }
    res.status(500).json({ message: 'Server error.' });
  }
};

// PUT /api/posts/:id (admin only)
const updatePost = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid post ID format.' });
    }

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    const { title, content, image, category, tags } = req.body;

    if (title !== undefined) {
      post.title = title.trim();
    }

    if (content !== undefined) {
      post.content = content.trim();
    }

    if (image !== undefined) {
      post.image = image.trim();
    }

    if (category !== undefined) {
      post.category = category.trim();
    }

    if (tags !== undefined) {
      post.tags = Array.isArray(tags)
        ? tags.map((t) => t.trim()).filter(Boolean).slice(0, MAX_TAGS_COUNT)
        : [];
    }

    const updatedPost = await post.save();
    const populated = await updatedPost.populate('author', 'username');

    res.json(populated);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const firstMessage = Object.values(error.errors)[0]?.message;
      return res.status(400).json({ message: firstMessage || 'Validation error.' });
    }
    if (error.code === 11000 && error.keyPattern?.slug) {
      return res.status(409).json({ message: 'A post with this title already exists.' });
    }
    res.status(500).json({ message: 'Server error.' });
  }
};

// DELETE /api/posts/:id (admin only)
const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid post ID format.' });
    }

    const post = await Post.findByIdAndDelete(id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    if (post.image) {
      const imagePath = path.join(__dirname, '..', '..', 'uploads', path.basename(post.image));
      fs.unlink(imagePath, () => {});
    }

    res.json({ message: 'Post deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = { getAllPosts, getPostBySlug, getPostById, createPost, updatePost, deletePost };
