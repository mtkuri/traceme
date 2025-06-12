const bcrypt = require("bcrypt");
const { pool } = require("../db");
//ユーザー登録用
exports.registerUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ error: "ユーザー名とパスワードは必須です" });

  try {
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);

    const result = await pool.query(
      "INSERT INTO users (username, password_hash, created_at) VALUES ($1, $2, NOW()) RETURNING id, username, created_at",
      [username, hash]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === "23505") {
      // 重複はじく
      res.status(409).json({ error: "ユーザー名は既に使われています" });
    } else {
      console.error(err);
      res.status(500).json({ error: "サーバーエラー" });
    }
  }
};
//login用のAPI
exports.loginUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ error: "ユーザー名とパスワードは必須です" });

  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "ユーザーが存在しません" });
    }

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password_hash);

    if (!match) {
      return res.status(401).json({ error: "パスワードが正しくありません" });
    }

    res.status(200).json({ id: user.id, username: user.username });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "サーバーエラー" });
  }
};
