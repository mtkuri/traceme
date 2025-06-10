const { pool } = require("../db");

exports.postStory = async (req, res) => {
  const { user_id, media_url, caption, lat, lng } = req.body;
  if (!user_id || !media_url || !caption || !lat || !lng) {
    return res.status(400).json({ error: "必要な情報が不足しています" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO stories (user_id, media_url, caption, lat, lng, timestamp, expire_at) VALUES ($1, $2, $3, $4, $5, NOW(), NOW() + interval '24 hour') RETURNING *",
      [user_id, media_url, caption, lat, lng]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "サーバーエラー" });
  }
};

exports.getNearbyStories = async (req, res) => {
  const { lat, lng, radius = 500 } = req.query;
  if (!lat || !lng) {
    return res.status(400).json({ error: "位置情報が必要です" });
  }

  try {
    const result = await pool.query(
      `SELECT *,
        (6371000 * acos(cos(radians($1)) * cos(radians(lat)) * cos(radians(lng) - radians($2)) + sin(radians($1)) * sin(radians(lat)))) AS distance
        FROM stories
        WHERE expire_at > NOW()
        HAVING distance < $3
        ORDER BY timestamp DESC`,
      [lat, lng, radius]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "サーバーエラー" });
  }
};