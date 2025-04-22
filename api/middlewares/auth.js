const jwt = require("jsonwebtoken");
const config = require("../../config/server");
const UserService = require("../../services/user.service");

async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Authorization token required" });
    }

    const [bearer, token] = authHeader.split(" ");
    if (bearer !== "Bearer" || !token) {
      return res.status(401).json({ message: "Invalid authorization format" });
    }

    const decoded = jwt.verify(token, config.jwt.secret);
    const user = await UserService.getUserById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "User does not exist" });
    }

    req.user = user;
    next();
  } catch (error) {
    if (["JsonWebTokenError", "TokenExpiredError"].includes(error.name)) {
      return res.status(401).json({ message: error.message });
    }
    next(error);
  }
}

function authorizeRole(...allowedRoles) {
  console.log(allowedRoles)
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      console.log(req.user.role)
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
}

module.exports = { authenticate, authorizeRole };
