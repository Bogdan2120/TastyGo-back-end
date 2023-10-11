const { HttpError } = require("../hellpers");
const jwt = require("jsonwebtoken");
const { UserModal } = require("../models/User");
const { SECRET_KEY } = process.env;

const checkAuth = async (req, res, next) => {
  //   try {
  //     const authHeader = req.headers.authorization || "";
  //     if (!authHeader) {
  //       throw HttpError(401, "Not authorized");
  //     }
  //     const [bearer, token] = authHeader.split(" ", 2);
  //     if (bearer !== "Bearer") {
  //       throw HttpError(401, "Not authorized");
  //     }
  //     await jwt.verify(token, SECRET_KEY, (err, decoded) => {
  //       if (err) {
  //         throw HttpError(401, "Not authorized");
  //       }
  //       req.userId = decoded;
  //       next();
  //     });
  //   } catch (error) {
  //     next(error);
  //   }
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer") {
    next(HttpError(401));
  }

  try {
    const { id } = jwt.verify(token, SECRET_KEY);
    const user = await UserModal.findById(id);

    if (!user || !user.token) {
      next(HttpError(401));
    }
    req.user = user;
    next();
  } catch {
    next(HttpError(401));
  }
};

module.exports = checkAuth;
