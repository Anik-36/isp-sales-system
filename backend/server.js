require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();
const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim());

app.use(cors({ origin: allowedOrigins }));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

app.get("/api/health", (req, res) => res.json({ status: "ok" }));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/packages", require("./routes/packageRoutes"));
app.use("/api/coverage", require("./routes/coverageRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api", require("./routes/leadRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

app.get("/", (req, res) => {
  res.send("Isp server is running");
});

app.use((req, res) => res.status(404).json({ message: "Route not found" }));
app.use((error, req, res, next) => {
  if (res.headersSent) return next(error);
  const status =
    error.name === "ValidationError" || error.name === "CastError"
      ? 400
      : error.code === 11000
        ? 409
        : error.statusCode || 500;
  res.status(status).json({
    message: status === 500 ? "Internal server error" : error.message,
  });
});

const port = Number(process.env.PORT) || 5000;
if (require.main === module) {
  connectDB()
    .then(() =>
      app.listen(port, () => {
        console.log("cors origin", allowedOrigins);
        console.log(`API listening on port ${port}`);
      }),
    )
    .catch((error) => {
      console.error("Unable to start API:", error.message);
      process.exit(1);
    });
}

module.exports = app;
