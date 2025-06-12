const express = require("express");
const router = express.Router();
const { postStory, getNearbyStories } = require("./storyController");

router.post("/", postStory);
router.get("/nearby", getNearbyStories);

module.exports = router;
