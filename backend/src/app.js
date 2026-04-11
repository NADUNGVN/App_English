const express = require("express");
const cors = require("cors");
const env = require("./config/env");
const { errorHandler } = require("./middlewares/error.middleware");
const { notFoundHandler } = require("./middlewares/notFound.middleware");
const authRoutes = require("./modules/auth/auth.routes");
const healthRoutes = require("./modules/health/health.routes");
const userRoutes = require("./modules/users/user.routes");

const app = express();

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || origin === env.CLIENT_URL) {
        callback(null, true);
        return;
      }

      callback(new Error("Origin not allowed by CORS"));
    },
  }),
);
app.use(express.json());

app.get("/", (request, response) => {
  response.json({
    name: "QuackUp API",
    version: "1.0.0",
  });
});

app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
