const { pool } = require("../db");

exports.findMatches = async (req, res) => {
  const { user_id, radius = 100 } = req.query; // 半径はメートル単位、デフォルト100m
  if (!user_id) {
    return res.status(400).json({ error: "user_idが必要です" });
  }

  try {
    const userLocationRes = await pool.query(
      "SELECT lat, lng FROM locations WHERE user_id = $1 ORDER BY timestamp DESC LIMIT 1",
      [user_id]
    );
    if (userLocationRes.rows.length === 0) {
      return res.status(404).json({ error: "位置情報が見つかりません" });
    }

    const { lat, lng } = userLocationRes.rows[0];

    const nearbyUsers = await pool.query(
      `SELECT users.id, users.name, l.lat, l.lng,
        (6371000 * acos(cos(radians($1)) * cos(radians(l.lat)) * cos(radians(l.lng) - radians($2)) + sin(radians($1)) * sin(radians(l.lat)))) AS distance
        FROM users
        INNER JOIN locations l ON users.id = l.user_id
        WHERE users.id != $3
        AND l.timestamp > NOW() - interval '5 minutes'
        HAVING distance < $4
        ORDER BY distance ASC`,
      [lat, lng, user_id, radius]
    );

    res.status(200).json(nearbyUsers.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "サーバーエラー" });
  }
};