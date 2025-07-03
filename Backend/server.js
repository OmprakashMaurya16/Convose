require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth.route.js");

const app = express();

const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;

app.use(express.json);
app.use(express.urlencoded({ extended: true }));

const main = async () => {
  await mongoose.connect(MONGO_URL);
};

main()
  .then(() => console.log("DB Connected Successfully"))
  .catch((err) => console.log(`Database Connection Error: ${err}`));

app.use("/auth", authRoute);

app.get("/", (req, res) => {
  res.send(`Server is running`);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
