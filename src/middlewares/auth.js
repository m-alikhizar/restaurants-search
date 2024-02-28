const httpStatus = require('http-status');

const auth = () => async (req, res, next) => {
  // authenticate user using jwt or something.
  // will need to check session stuff.

  // What you see in following is the basic auth implemented depends on pass key in headder.
  
  if(req.headers['x-hashed-passkey']) {
    req.authenticated = true;
    next();
  } else {
    res.status(httpStatus.UNAUTHORIZED).json({ error: 'Please authenticate.' });
  }
};

module.exports = auth;
