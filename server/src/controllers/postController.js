const mongoose = require('mongoose');
const slugify = require('slugify');
const crypto = require('crypto');
const Post = require('../models/Post');
const cloudinary = require('../config/cloudinary');
const escapeRegex = require('../utils/escapeRegex');

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 6;
const MAX_LIMIT = 20;
const MAX_TITLE_LENGTH = 200;
const MAX_TAGS_COUNT = 10;

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Express may parse bracket-notation query params (e.g. ?category[$gt]=) into
// objects. Coerce a query value to a trimmed string, ignoring non-string input
// to prevent unexpected types reaching the database query.
const toQueryString = (value) =>
  typeof value === 'string' ? value.trim() : '';

// Normalize and bound the tags payload coming from the request body.
const sanitizeTags = (tags) =>
  Array.isArray(tags)
    ? tags
        .filter((tag) => typeof tag === 'string')
        .map((tag) => tag.trim())
        .filter(Boolean)
        .slice(0, MAX_TAGS_COUNT)
    : [];

// GET /api/posts
const getAllPosts = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || DEFAULT_PAGE, 1);
    const limit = Math.min(
      parseInt(req.query.limit, 10) || DEFAULT_LIMIT,
      MAX_LIMIT,
    );

    const category = toQueryString(req.query.category);
    const tag = toQueryString(req.query.tag);
    const search = toQueryString(req.query.search);

    const filter = {};

    if (category) {
      filter.category = category;
    }

    if (tag) {
      filter.tags = tag;
    }

    if (search) {
      filter.title = { $regex: escapeRegex(search), $options: 'i' };
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
    next(error);
  }
};

// GET /api/posts/:slug
const getPostBySlug = async (req, res, next) => {
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
    next(error);
  }
};

// GET /api/posts/id/:id (admin — fetch single post by ObjectId)
const getPostById = async (req, res, next) => {
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
    next(error);
  }
};

// POST /api/posts (admin only)
const createPost = async (req, res, next) => {
  try {
    const { title, content, image, category, tags } = req.body;

    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({ message: 'Title is required.' });
    }

    if (title.trim().length > MAX_TITLE_LENGTH) {
      return res
        .status(400)
        .json({ message: `Title must be at most ${MAX_TITLE_LENGTH} characters.` });
    }

    if (!content || typeof content !== 'string' || !content.trim()) {
      return res.status(400).json({ message: 'Content is required.' });
    }

    if (!category || typeof category !== 'string' || !category.trim()) {
      return res.status(400).json({ message: 'Category is required.' });
    }

    const postData = {
      title: title.trim(),
      content: content.trim(),
      image: typeof image === 'string' ? image.trim() : '',
      category: category.trim(),
      tags: sanitizeTags(tags),
      author: req.user.id,
    };

    let post;
    try {
      post = await Post.create(postData);
    } catch (err) {
      if (err.code === 11000 && err.keyPattern?.slug) {
        const suffix = crypto.randomBytes(3).toString('hex');
        const retryDoc = new Post(postData);
        retryDoc.slug =
          slugify(postData.title, { lower: true, strict: true }) + '-' + suffix;
        retryDoc._skipSlugGeneration = true;
        post = await retryDoc.save();
      } else {
        throw err;
      }
    }

    const populated = await post.populate('author', 'username');

    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
};

// PUT /api/posts/:id (admin only)
const updatePost = async (req, res, next) => {
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
      if (typeof title !== 'string') {
        return res.status(400).json({ message: 'Title must be a string.' });
      }
      post.title = title.trim();
    }

    if (content !== undefined) {
      if (typeof content !== 'string') {
        return res.status(400).json({ message: 'Content must be a string.' });
      }
      post.content = content.trim();
    }

    if (image !== undefined) {
      if (typeof image !== 'string') {
        return res.status(400).json({ message: 'Image must be a string.' });
      }
      post.image = image.trim();
    }

    if (category !== undefined) {
      if (typeof category !== 'string') {
        return res.status(400).json({ message: 'Category must be a string.' });
      }
      post.category = category.trim();
    }

    if (tags !== undefined) {
      post.tags = sanitizeTags(tags);
    }

    const updatedPost = await post.save();
    const populated = await updatedPost.populate('author', 'username');

    res.json(populated);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/posts/:id (admin only)
const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid post ID format.' });
    }

    const post = await Post.findByIdAndDelete(id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    if (post.image && post.image.includes('cloudinary')) {
      const publicId = post.image.split('/').slice(-2).join('/').split('.')[0];
      cloudinary.uploader.destroy(publicId).catch(() => {});
    }

    res.json({ message: 'Post deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

// GET /api/posts/filters — distinct categories & tags for filter UI
const getFilterOptions = async (_req, res, next) => {
  try {
    const [categories, tags] = await Promise.all([
      Post.distinct('category'),
      Post.distinct('tags'),
    ]);

    res.json({
      categories: categories.filter(Boolean).sort(),
      tags: tags.filter(Boolean).sort(),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllPosts,
  getPostBySlug,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  getFilterOptions,
};
