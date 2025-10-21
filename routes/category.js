const express = require("express");
const router = express.Router();

const CategoryController = require("../app/controller/category.controller");
const CategoryValidator = require("../app/validator/category.validator");
const AuthMiddleware = require("../middleware/auth.middleware");

router.get("/categories", AuthMiddleware, CategoryController.index);

router.post(
  "/categories",
  AuthMiddleware,
  CategoryValidator.create,
  CategoryController.create
);

router.get("/categories/:id", AuthMiddleware, CategoryController.show);

router.put(
  "/categories/:id",
  AuthMiddleware,
  CategoryValidator.update,
  CategoryController.update
);

router.delete("/categories/:id", AuthMiddleware, CategoryController.destroy);

module.exports = router;
