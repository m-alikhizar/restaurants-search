const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { roleRights } = require('../config/roles');
const { users } = require('../config/users'); // assumed to be from the user model.
const pick = require('../utils/pick');

const verifyCallback = (req, resolve, reject, requiredRights) => {

  const params = pick(req.headers, ['user_id']);

  if (!params || !params.user_id) {
    return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please provide user_id!'));
  }

  const user = users.find(user => user.user_id == params.user_id);

  if(!user) {
    return reject(new ApiError(httpStatus.FORBIDDEN, 'Invalid user_id!'));
  }

  let hasRequiredRights = false;
  if(requiredRights.includes('read') && requiredRights.includes('write')) {
    hasRequiredRights = true;
  } else {
    hasRequiredRights = requiredRights.every(right => user.role.includes(right));
  }

  if (!hasRequiredRights) {
    return reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden. user has no rights.'));
  }
  
  req.user = user;

  resolve();
};

const DAC = (...requiredRights) => async (req, res, next) => {
  return new Promise((resolve, reject) => verifyCallback(req, resolve, reject, requiredRights))
    .then(() => next())
    .catch((err) => {
      res.status(err.statusCode).json({ error: err.message });
    });
};

module.exports = DAC; // data access control
