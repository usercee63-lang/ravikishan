



require("dotenv").config();
const connectDB = require("./config/db");
const express = require("express");
const cors = require("cors");

const searchRoutes = require("./routes/search");
const contentRoutes = require("./routes/content");
const navigationRoutes = require("./routes/navigation");
const authRoutes = require("./routes/auth");

 //connectDB(); 

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "Ravikishan Backend Running 🚀",
  });
});

app.use("/api/navigation", navigationRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/auth", authRoutes);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});




