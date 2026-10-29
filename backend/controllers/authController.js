const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const login = asyncHandler(async (req, res) => {
  const email = String(req.body.email || "")
    .trim()
    .toLowerCase();
  const password = String(req.body.password || "");
  if (!email || !password)
    return res.status(400).json({ message: "Email and password are required" });

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  res.json({
    _id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    token,
  });
});

module.exports = { login };
