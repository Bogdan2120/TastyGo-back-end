const express = require("express");
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");

const { HOST_DB, PORT = 3005 } = process.env;

const authRouter = require("./routes/auth");
const foodRouter = require("./routes/foods");
const categoryRouter = require("./routes/category");

const app = express();

//Midelwares
app.use(cors());
app.use(express.json());

//Routes
app.use("/api/auth", authRouter);
app.use("/api/food", foodRouter);
app.use("/api/category", categoryRouter);

mongoose
  .connect(HOST_DB)
  .then((res) => {
    console.log(`Server work on ${PORT} port`);
    app.listen(PORT);
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });

app.use((__, res) => {
  res.status(404).json({
    message: "Not found",
  });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});
