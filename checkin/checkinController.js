const { pool } = require("../db");

exports.createCheckin = async (req, res) => {
  const { user_id, place_name, lat, lng } = req.body;
  if (!user_id || !place_name || !lat || !lng) {
    return res.status(400).json({ error: "必要な情報が不足しています" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO checkins (user_id, place_name, lat, lng, timestamp) VALUES ($1, $2, $3, $4, NOW()) RETURNING *",
      [user_id, place_name, lat, lng]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "サーバーエラー" });
  }
};
