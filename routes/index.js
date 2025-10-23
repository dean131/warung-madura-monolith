const AuthRouter = require('./auth');
const CategoryRouter = require('./category');
const ProductRouter = require('./product');
const OrderRouter = require('./order');
const CartRouter = require('./cart');

const routes = (app, prefix) => {
  app.use(prefix, AuthRouter);
  app.use(prefix, CategoryRouter);
  app.use(prefix, ProductRouter);
  app.use(prefix, OrderRouter);
  app.use(prefix, CartRouter);
};

module.exports = routes;