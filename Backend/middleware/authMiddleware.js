const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    /*
    Authorization should look like:

    Authorization: Bearer TOKEN
    */

    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication token missing",
      });
    }

    /*
    ------------------------------------------------
    VERIFY TOKEN
    ------------------------------------------------
    */

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    /*
    ------------------------------------------------
    SAVE ADMIN INFORMATION TO REQUEST
    ------------------------------------------------
    */

    req.admin = decoded;

    next();
  } catch (error) {
    console.error("AUTH ERROR:", error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired authentication token",
    });
  }
};

module.exports = protect;