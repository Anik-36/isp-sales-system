const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

function sendUserSession(res, user) {
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  res.json({
    _id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    token,
  });
}

const login = (allowedRoles) =>
  asyncHandler(async (req, res) => {
    const email = String(req.body.email || "")
      .trim()
      .toLowerCase();
    const password = String(req.body.password || "");
    if (!email || !password)
      return res
        .status(400)
        .json({ message: "Email and password are required" });

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    if (!allowedRoles.includes(user.role)) {
      return res
        .status(403)
        .json({ message: "Use the sign-in page for your account type" });
    }
    if (user.accountStatus === "pending") {
      return res
        .status(403)
        .json({
          message: "Your sales agent account is awaiting admin approval",
        });
    }
    sendUserSession(res, user);
  });

const registerSalesAgent = asyncHandler(async (req, res) => {
  const name = String(req.body.name || "").trim();
  const email = String(req.body.email || "")
    .trim()
    .toLowerCase();
  const password = String(req.body.password || "");
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "Name, email, and password are required" });
  }
  if (name.length > 100 || password.length < 8) {
    return res
      .status(400)
      .json({
        message:
          "Check the field lengths and use a password of at least 8 characters",
      });
  }
  await User.create({
    name,
    email,
    password,
    role: "sales_agent",
    accountStatus: "pending",
  });
  res
    .status(202)
    .json({
      message:
        "Registration received. An admin must approve your account before you can sign in.",
    });
});

const registerInitialAdmin = asyncHandler(async (req, res) => {
  const configuredKey = process.env.ADMIN_SIGNUP_KEY;
  const suppliedKey = String(req.body.setupKey || "");
  if (!configuredKey) {
    return res
      .status(403)
      .json({
        message:
          "Admin signup is disabled. Configure ADMIN_SIGNUP_KEY for initial setup.",
      });
  }
  if (suppliedKey !== configuredKey) {
    return res.status(403).json({ message: "Invalid admin setup key" });
  }
  const name = String(req.body.name || "").trim();
  const email = String(req.body.email || "")
    .trim()
    .toLowerCase();
  const password = String(req.body.password || "");
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "Name, email, and password are required" });
  }
  if (name.length > 100 || password.length < 8) {
    return res
      .status(400)
      .json({
        message:
          "Check the field lengths and use a password of at least 8 characters",
      });
  }
  const admin = await User.create({ name, email, password, role: "admin" });
  sendUserSession(res, admin);
});

module.exports = { login, registerSalesAgent, registerInitialAdmin };
