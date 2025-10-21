const express = require("express");
const router = express.Router();

const OrderController = require("../app/controller/order.controller");
const OrderValidator = require("../app/validator/order.validator");
const AuthMiddleware = require("../middleware/auth.middleware");

router.get(
  "/orders",
  AuthMiddleware,
  OrderValidator.list,
  OrderController.index
);

router.post(
  "/orders",
  AuthMiddleware,
  OrderValidator.create,
  OrderController.create
);

router.get("/orders/:id", AuthMiddleware, OrderController.show);

module.exports = router;
