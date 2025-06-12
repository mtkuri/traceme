const { pool } = require("../db");

exports.saveLocation = async (req, res) => {
  const { user_id, lat, lng } = req.body;
  if (!user_id || !lat || !lng) {
    return res.status(400).json({ error: "必要な情報が不足しています" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO locations (user_id, lat, lng, timestamp) VALUES ($1, $2, $3, NOW()) RETURNING *",
      [user_id, lat, lng]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "サーバーエラー" });
  }
};
