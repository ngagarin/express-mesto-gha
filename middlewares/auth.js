const jwt = require('jsonwebtoken');
const UnathorizedError = require('../utils/errors/unathorized-error');

const SECRETKEY = 'dcdcsdscwdf5f5rswDR4Exdv8sdcs';

const validateToken = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    const err = new UnathorizedError('Необходима авторизация');
    next(err);
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, this.SECRETKEY);
  } catch (e) {
    const err = new UnathorizedError('Необходима авторизация');
    next(err);
  }

  req.user = payload;

  return next();
};

module.exports = {
  SECRETKEY,
  validateToken,
};
