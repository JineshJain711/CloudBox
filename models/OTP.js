const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      default: () => Date.now() + 2 * 60 * 1000, // 2 min
    },
    attempts: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// 🔐 hash OTP before saving (CORRECT)
otpSchema.pre("save", async function () {
  if (!this.isModified("otp")) return;
  this.otp = await bcrypt.hash(this.otp, 10);
});

module.exports = mongoose.model("Otp", otpSchema);
