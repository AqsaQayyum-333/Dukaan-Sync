const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {

  console.log("AUTH MIDDLEWARE RUNNING");

  const authHeader =
    req.headers.authorization;

  console.log("TOKEN HEADER:");
  console.log(authHeader);

  if (!authHeader) {
    return res.status(401).json({
      message: "No Token"
    });
  }

  try {

    const token =
      authHeader.replace(
        "Bearer ",
        ""
      );

    const decoded =
      jwt.verify(
        token,
        process.env.JWT_SECRET
      );

    console.log("DECODED USER:");
    console.log(decoded);

    req.user = decoded;

    next();

  } catch (error) {

    console.log(error);

    return res.status(401).json({
      message: "Invalid Token"
    });

  }

};

module.exports = auth;