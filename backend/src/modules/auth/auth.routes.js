const express = require("express");
const { requireAuth } = require("../../middlewares/auth.middleware");
const authController = require("./auth.controller");

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/me", requireAuth, authController.me);

module.exports = router;
