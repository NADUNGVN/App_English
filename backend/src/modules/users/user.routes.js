const express = require("express");
const { requireAuth } = require("../../middlewares/auth.middleware");
const userController = require("./user.controller");

const router = express.Router();

router.patch("/me", requireAuth, userController.updateProfile);

module.exports = router;
