const { pool } = require("../db");

exports.registerUser = async (req, res) => {
  const { sns_id, name } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO users (sns_id, name, created_at) VALUES ($1, $2, NOW()) RETURNING *",
      [sns_id, name]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "サーバーエラー" });
  }
};