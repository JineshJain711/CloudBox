const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const { dbConnect } = require("./config/db");

const authRouter = require("./routes/auth");
const fileRouter = require("./routes/file");

// ================= MIDDLEWARE =================
app.use(cors()); 
app.use(express.json());

// ================= ROUTES =================
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/file", fileRouter);

app.get("/", (req, res) => {
  res.send("Server is Running");
});

dbConnect();

// ================= SERVER =================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`App is Listening on Port ${PORT}`);
});
