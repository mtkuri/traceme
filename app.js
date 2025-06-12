const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.use(express.json());

const authRoutes = require("./auth/auth.js");
const locationRoutes = require("./location/location.js");
const matchRoutes = require("./match/match.js");
const checkinRoutes = require("./checkin/checkin.js");
const chatRoutes = require("./chat/chat.js");
const storyRoutes = require("./story/story.js");

app.use("/api", authRoutes);
app.use("/api/location", locationRoutes);
app.use("/api/match", matchRoutes);
app.use("/api/checkin", checkinRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/story", storyRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
