const express = require("express");
const router = express.Router();

const ProductController = require("../app/controller/product.controller");
const ProductValidator = require("../app/validator/product.validator");
const AuthMiddleware = require("../middleware/auth.middleware");

router.get(
  "/products",
  AuthMiddleware,
  ProductValidator.list,
  ProductController.index
);

router.post(
  "/products",
  AuthMiddleware,
  ProductValidator.create,
  ProductController.create
);

router.get("/products/:id", AuthMiddleware, ProductController.show);

router.put(
  "/products/:id",
  AuthMiddleware,
  ProductValidator.update,
  ProductController.update
);

router.delete("/products/:id", AuthMiddleware, ProductController.destroy);

module.exports = router;
