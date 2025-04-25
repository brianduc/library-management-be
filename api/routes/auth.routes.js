const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { authenticate } = require("../middlewares/auth");

// Auth routes
router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/me", authenticate, authController.getCurrentUser);
router.post("/change-password-first-time", authController.changePasswordFirstTime);

module.exports = router;
