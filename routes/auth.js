const express = require("express");
const router = express.Router();

const {
  registerUser,
  verifyOtp,
  login,
  // optional future handlers
  // resendOtp,
  // getProfile,
} = require("../controllers/Auth");

const { protectedRoute } = require("../middleware/auth");

// ================= AUTH ROUTES =================

// Register user (send OTP)
router.post("/signUp", registerUser);

// Verify OTP
router.post("/verifyOtp", verifyOtp);

// Login
router.post("/login", login);

// Get logged-in user (optional but recommended)
router.get("/me", protectedRoute, (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});


module.exports = router;
