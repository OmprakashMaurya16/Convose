require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./src/routes/auth.route.js");
const userRoutes = require("./src/routes/user.route.js");
const chatRoutes = require("./src/routes/chat.route.js");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

const main = async () => {
  await mongoose.connect(MONGO_URL);
};

main()
  .then(() => console.log("DB Connected Successfully"))
  .catch((err) => console.log(`Database Connection Error: ${err}`));

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/chats", chatRoutes);

app.get("/", (req, res) => {
  res.send(`Server is running`);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
