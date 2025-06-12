const express = require("express");
const router = express.Router();
const { findMatches } = require("./matchController");

router.get("/", findMatches);

module.exports = router;
