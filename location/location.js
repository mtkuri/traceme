const express = require("express");
const router = express.Router();
const { saveLocation } = require("./locationController");

router.post("/", saveLocation);

module.exports = router;