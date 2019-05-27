const User = require("../schema/userSchema");
const jwt = require("jwt-simple");
const jwtConfig = require("../config/jwt-config");

const decode = (token) => {
  return new Promise((resolve, reject) => {
      try {
          let decoded = jwt.decode(token, jwtConfig.secret);
          resolve(decoded);
      } catch (err){
          reject(false);
      }
  });
};

const getUserAdminPermission = (token) => {
    return decode(token)
        .then(decoded => decoded.role === "admin")
        .catch(err => false);
};

const getApiPermission = (token) => {
   return decode(token)
       .then(decoded => decoded.role === "player" || decoded.role === "admin")
       .catch(err => false);
};

const getUserInfo = (token) => {
  return decode(token)
      .then(decoded => {
          return {
              id: decoded._id,
              pseudo: decoded.pseudo,
              avatar: decoded.avatar
          }
      })
      .catch(err => false)
};

const getUserPseudo = (userId) => {
    return User.findById(userId, "pseudo").exec();
};

exports.getAdminPermission = getUserAdminPermission;
exports.getApiPermission = getApiPermission;
exports.getUserInfo = getUserInfo;
exports.getUserPseudo = getUserPseudo;