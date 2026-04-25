const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.header("Authorization");

  console.log("Auth Header:", authHeader);         // 👈 what is being received
  console.log("JWT Secret:", process.env.JWT_SECRET ? "EXISTS" : "MISSING"); // 👈 is secret loaded

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "No token, header missing or malformed" });
  }

  const token = authHeader.split(" ")[1];
  console.log("Token:", token);                    // 👈 what token is extracted

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded:", decoded);              // 👈 decoded payload
    req.user = decoded.id;
    next();
  } catch (err) {
    console.error("JWT Error:", err.message);      // 👈 exact error reason
    res.status(401).json({ msg: "Invalid token", error: err.message });
  }
};