const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");

module.exports.checkUser = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(
      token,
      process.env.JWT_SECRET,
      async (err, decodedToken) => {
        if (err) {
          res.locals.user = null;
          res.cookie("jwt", "", { maxAge: 1 });
          next();
        } else {
          const user = await UserModel.findById(decodedToken.id);
          res.locals.user = user;
          next();
        }
      }
    );
  } else {
    res.locals.user = null;
    next();
  }
};

module.exports.requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(
      token,
      process.env.JWT_SECRET,
      async (err, decodedToken) => {
        if (err) {
          console.log(err);
          return res.status(401).json({
            message: "Unauthorized",
          });
        }

        const user = await UserModel.findById(decodedToken.id);

        if (!user) {
          return res.status(401).json({
            message: "Utilisateur non trouvé",
          });
        }

        req.user = user;
        next();
      }
    );
  } else {
    res.status(401).json({
      message: "Unauthorized",
    });
  }
};