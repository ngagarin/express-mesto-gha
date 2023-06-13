const router = require('express').Router();
const { celebrate, Joi, errors } = require('celebrate');
const userRouter = require('./users');
const cardRouter = require('./cards');
const userController = require('../controllers/users');
const { validateToken } = require('../middlewares/auth');
const { URL_PATTERN } = require('../utils/constants');
const { NotFoundError } = require('../utils/errors/index');

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), userController.login);

router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    name: Joi.string().default('Жак-Ив Кусто').min(2).max(30),
    about: Joi.string().default('Исследователь').min(2).max(30),
    avatar: Joi.string().regex(URL_PATTERN)
      .default('https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png'),
  }),
}), userController.createUser);

router.use(validateToken);
router.use('/users', userRouter);
router.use('/cards', cardRouter);
router.use('*', (req, res, next) => next(new NotFoundError('По указанному пути ничего не найдено')));
router.use(errors());

module.exports = router;
