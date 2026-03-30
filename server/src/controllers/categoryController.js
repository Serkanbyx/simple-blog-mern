const Post = require("../models/Post");

/**
 * @desc   Get distinct categories with post count
 * @route  GET /api/categories
 * @access Public
 */
const getCategories = async (req, res, next) => {
  try {
    const categories = await Post.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $project: { _id: 0, name: "$_id", count: 1 } },
    ]);

    res.json(categories);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Get distinct tags with post count
 * @route  GET /api/tags
 * @access Public
 */
const getTags = async (req, res, next) => {
  try {
    const tags = await Post.aggregate([
      { $unwind: "$tags" },
      { $group: { _id: "$tags", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $project: { _id: 0, name: "$_id", count: 1 } },
    ]);

    res.json(tags);
  } catch (error) {
    next(error);
  }
};

module.exports = { getCategories, getTags };
