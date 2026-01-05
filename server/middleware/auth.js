const jwt = require("jsonwebtoken");

const protectRoute = async (req, res, next) => {
  try {
    //  get token from Cookies or Authorization Header as a backup
    const token = req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token Not Found",
      });
    }

    // Verify Token
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    //  Store the whole payload so controllers can access req.user.id AND req.user.email
    req.user = payload;

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized Access",
    });
  }
};

const authorizeRoles = (roles) => {
  return (req, res, next) => {
    //  req.user now contains 'role' from the JWT payload directly
    // This saves a Database extra  Query, making it faster.
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Access Denied",
      });
    }
    next();
  };
};

module.exports = { protectRoute, authorizeRoles };