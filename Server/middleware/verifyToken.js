const jwt = require("jsonwebtoken");
const config = require("../config/config");
const userSchema = require("../models/user_model");
const jsend = require("../constant/jsend");

const verifyToken = async (req, res, next) => {
  let token = req.headers.authorization;
  if (!token) {
    return res.status(403).send({ message: 'No token provided!' });
  } else {
    jwt.verify(token, config.jwt.secretKey, async (err, decoded) => {
      if (err) {
        return res.status(401).send({ message: err.message });
      } else {
        const userId = decoded.user_id;
        try {
          let findUser = await userSchema.findOne({ _id: userId });
       //   console.log("userIdObject findUser", findUser);

          if (findUser) {
            next();
          } else {
            return res.status(401).send({ message: 'Unauthorized Access' });
          }
        } catch (error) {
          console.error("Error finding user:", error);
          return res.status(500).send({ message: 'Internal Server Error' });
        }
      }
    });
  }
};

module.exports = verifyToken;