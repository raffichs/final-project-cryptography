const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No Token" });
  }

  jwt.verify(token, "piggyback", {}, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }

    req.user = user;
    next();
  });
};

module.exports = authMiddleware;
