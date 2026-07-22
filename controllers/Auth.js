const User = require("../models/User");
const validater = require("validator");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const OTP = require("../models/OTP");
const { sendMail } = require("../utils/emailSender");
const otpTamplet = require("../mails/otpTemplet");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET ;

exports.registerUser = async (req, res) => {
  try {
    const { name, password, email } = req.body;

    if (!name || !password || !email) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (name.trim().length <= 2) {
      return res.status(422).json({
        success: false,
        message: "Name must be greater than 2 characters",
      });
    }

    if (!validater.isEmail(email)) {
      return res.status(422).json({
        success: false,
        message: "Please enter a valid email address",
      });
    }

    const userExist = await User.findOne({ email });

    // Handle existing user
    if (userExist) {
      if (userExist.userVerified === true) {
        return res.status(401).json({
          success: false,
          message: "User is Registerd already",
        });
      }

      // If user exists but is not verified -> delete old record & re-register
      await User.deleteOne({ email: userExist.email });
      await OTP.deleteMany({ email });
    }

    // Create new unverified user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: name.trim(),
      password: hashedPassword,
      email: email.trim().toLowerCase(),
      userVerified: false,
    });

    // Generate & send OTP
    const otp = crypto.randomInt(100000, 999999);
    await OTP.deleteMany({ email: user.email });
    await OTP.create({
      email: user.email,
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000,
    });

    const otpMail = otpTamplet(user.name, otp);
    const response = await sendMail(user.email, "OTP Verification", "text", otpMail);

    if (!response) {
      return res.status(500).json({
        success: false,
        message: "Verification OTP could not be sent due to email service issue",
      });
    }

    return res.status(200).json({
      success: true,
      message: "OTP is sended Sussefull on email :-" + user.email,
    });

  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error while SignUp",
      error: error.message,
    });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const otpRecord = await OTP.findOne({ email: normalizedEmail });

    if (!otpRecord) {
      return res.status(404).json({
        success: false,
        message: "OTP not found or expired",
      });
    }

    if (otpRecord.expiresAt < Date.now()) {
      await OTP.deleteMany({ email: normalizedEmail });
      return res.status(410).json({
        success: false,
        message: "OTP expired",
      });
    }

    const isMatch = await bcrypt.compare(String(otp), String(otpRecord.otp));

    if (!isMatch) {
      otpRecord.attempts += 1;
      await otpRecord.save();

      return res.status(401).json({
        success: false,
        message: "Invalid OTP",
        warning: `${3 - otpRecord.attempts} Attempts are Left`,
      });
    }

    await User.findOneAndUpdate(
      { email: normalizedEmail },
      { userVerified: true }
    );

    await OTP.deleteMany({ email: normalizedEmail });

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });

  } catch (error) {
    console.error("Verify OTP Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error during OTP verification",
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (!validater.isEmail(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Fill Proper Email ID",
      });
    }

    const isUser = await User.findOne({ email: normalizedEmail });

    if (!isUser) {
      return res.status(404).json({
        success: false,
        message: "User not Found",
      });
    }

    if (!isUser.userVerified) {
      return res.status(401).json({
        success: false,
        message: "User is Exist but Not Verifyed Go to Resister page ",
      });
    }

    const isPass = await bcrypt.compare(password, isUser.password);

    if (!isPass) {
      return res.status(400).json({
        success: false,
        message: "Wrong Password",
      });
    }

    const token = jwt.sign(
      { id: isUser._id, email: isUser.email, name: isUser.name },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Hide password from response
    isUser.password = undefined;

    return res.status(200).json({
      success: true,
      message: "User is Loged In",
      token: token,
      user: isUser,
    });

  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error during Login",
      error: error.message,
    });
  }
};
