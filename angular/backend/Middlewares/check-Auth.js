const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');
dotenv.config();

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token,"this_is_my_secret_key_for_password"
      // process.env.JWT_KEY
       );
    req.userData = { email: decodedToken.email, userId: decodedToken.userId };
    next();
  } catch ( error ) {
    res.status(401).json({
      message: "Auth failed"
    })
  }
}
