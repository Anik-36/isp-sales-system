const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function protect(req, res, next) {
  const authorization = req.headers.authorization;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const token = authorization.slice(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("_id name email role");
    if (!user)
      return res.status(401).json({ message: "Account no longer exists" });
    req.user = user;
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Permission denied" });
    }
    return next();
  };
}

module.exports = { protect, authorize };
