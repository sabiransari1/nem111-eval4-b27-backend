const jwt = require("jsonwebtoken");
require("dotenv").config();

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1] || null;

    if (!token) {
      return res.status(400).send({ msg: "Invaild token" });
    }

    const verfiy = jwt.verify(token, process.env.SECRET_KEY);
    req.body.userID = verfiy.userID;

    return next();
  } catch (error) {
    return res.status(400).send({ error: error.message });
  }
};

module.exports = authMiddleware;
