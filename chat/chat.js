const express = require("express");
const router = express.Router();
const { getChat, postChat } = require("./chatController");

router.get("/:encounter_id", getChat);
router.post("/:encounter_id", postChat);

module.exports = router;
