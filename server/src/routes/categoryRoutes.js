const express = require("express");
const { getCategories, getTags } = require("../controllers/categoryController");

const router = express.Router();

router.get("/", getCategories);
router.get("/tags", getTags);

module.exports = router;
