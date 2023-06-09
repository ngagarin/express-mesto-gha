const router = require('express').Router();
const { celebrate, Joi, errors } = require('celebrate');
const userRouter = require('./users');
const cardRouter = require('./cards');
const userController = require('../controllers/users');
const { validateToken } = require('../middlewares/auth');
const { URL_PATTERN } = require('../utils/constants');
const { NotFoundError } = require('../utils/errors/index');

router.post('/sign-in', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), userController.login);
router.post('/sign-up', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    name: Joi.string().default('Николай Гагарин').min(2).max(30),
    about: Joi.string().default('Студент Яндекс.Практикум').min(2).max(30),
    avatar: Joi.string().regex(URL_PATTERN)
      .default('https://i.pinimg.com/474x/d5/e7/14/d5e71496e78fbb05820c74f21376def8.jpg'),
  }),
}), userController.createUser);
router.use('/users', validateToken, userRouter);
router.use('/cards', validateToken, cardRouter);
router.use('*', (req, res, next) => {
  const err = new NotFoundError('По указанному пути ничего не найдено');
  next(err);
});
router.use(errors());

module.exports = router;
