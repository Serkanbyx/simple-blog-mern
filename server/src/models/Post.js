const mongoose = require("mongoose");
const slugify = require("slugify");

const { Schema } = mongoose;

const EXCERPT_LENGTH = 160;

// Strip markdown syntax to produce plain text for excerpts
const stripMarkdown = (text) =>
  text
    .replace(/#{1,6}\s?/g, "")
    .replace(/[*_~`>]/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
    .replace(/\n{2,}/g, " ")
    .trim();

const postSchema = new Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
    maxlength: [200, "Title must be at most 200 characters"],
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  content: {
    type: String,
    required: [true, "Content is required"],
  },
  excerpt: {
    type: String,
    maxlength: [300, "Excerpt must be at most 300 characters"],
  },
  image: {
    type: String,
    default: "",
  },
  category: {
    type: String,
    required: [true, "Category is required"],
    trim: true,
    maxlength: [50, "Category must be at most 50 characters"],
  },
  tags: [
    {
      type: String,
      trim: true,
      maxlength: [30, "Tag must be at most 30 characters"],
    },
  ],
  readingTime: {
    type: Number,
    default: 1,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Author is required"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Generate slug & excerpt before saving
postSchema.pre("validate", function () {
  if (this.isModified("title")) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }

  if (this.isModified("content")) {
    const plain = stripMarkdown(this.content);
    this.excerpt = plain.length > EXCERPT_LENGTH
      ? plain.substring(0, EXCERPT_LENGTH) + "..."
      : plain;

    const wordCount = this.content.trim().split(/\s+/).length;
    this.readingTime = Math.max(1, Math.ceil(wordCount / 238));
  }

  if (!this.isNew) {
    this.updatedAt = Date.now();
  }
});

// Compound indexes for query performance
postSchema.index({ createdAt: -1 });
postSchema.index({ category: 1 });

module.exports = mongoose.model("Post", postSchema);
