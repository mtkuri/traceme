const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.use(express.json());

const authRoutes = require("./routes/auth");
const locationRoutes = require("./routes/location");
const matchRoutes = require("./routes/match");
const checkinRoutes = require("./routes/checkin");
const chatRoutes = require("./routes/chat");
const storyRoutes = require("./routes/story");

app.use("/api", authRoutes);
app.use("/api/location", locationRoutes);
app.use("/api/match", matchRoutes);
app.use("/api/checkin", checkinRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/story", storyRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});