const express = require("express");
const router = express.Router();
const { createCheckin } = require("./checkinController");

router.post("/", createCheckin);

module.exports = router;