const { pool } = require("../db");

exports.getChat = async (req, res) => {
  const { encounter_id } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM chats WHERE encounter_id = $1 ORDER BY timestamp ASC",
      [encounter_id]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "サーバーエラー" });
  }
};

exports.postChat = async (req, res) => {
  const { encounter_id } = req.params;
  const { sender_id, message } = req.body;
  if (!sender_id || !message) {
    return res.status(400).json({ error: "必要な情報が不足しています" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO chats (encounter_id, sender_id, message, timestamp) VALUES ($1, $2, $3, NOW()) RETURNING *",
      [encounter_id, sender_id, message]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "サーバーエラー" });
  }
};