const express = require("express");
const { requireAuth } = require("../../middlewares/auth.middleware");
const authController = require("./auth.controller");

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.get("/google/start", authController.googleStart);
router.get("/google/callback", authController.googleCallback);
router.get("/me", requireAuth, authController.me);

module.exports = router;
