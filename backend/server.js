require("dotenv").config();

const express = require("express");
const cors = require("cors");
const session = require("express-session");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const connectDB = require("./config/db");
const logger = require("./utils/logger");
const {
  notFound,
  errorHandler,
} = require("./middleware/errorHandler");
const { globalLimiter } = require("./middleware/rateLimit");

const searchRoutes = require("./routes/search");
const contentRoutes = require("./routes/content");
const navigationRoutes = require("./routes/navigation");
const authRoutes = require("./routes/auth");
const aiRoutes = require("./routes/ai");

const app = express();

app.set("trust proxy", 1);

const allowedOrigins = (process.env.CORS_ORIGINS || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      if (origin.endsWith(".trycloudflare.com")) {
        return callback(null, true);
      }

      return callback(null, true);
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(globalLimiter);

app.use(
  morgan("combined", {
    stream: { write: (message) => logger.http(message.trim()) },
  })
);

app.use(
  session({
    name: "connect.sid",
    secret: process.env.SESSION_SECRET || "dev_session_secret_change_me",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  })
);

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
app.use("/api/ai", aiRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  logger.info(`Backend running at http://localhost:${PORT}`);
});

connectDB()
  .then(() => logger.info("Database connected successfully"))
  .catch((err) =>
    logger.error("Error connecting to database", {
      message: err.message,
      stack: err.stack,
    })
  );
