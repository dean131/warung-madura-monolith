const express = require("express");
const router = express.Router();

const AuthController = require("../app/controller/auth.controller");
const AuthValidator = require("../app/validator/auth.validator");

router.post("/register", AuthValidator.register, AuthController.register);
router.post("/login", AuthValidator.login, AuthController.login);
router.post("/refresh", AuthValidator.refresh, AuthController.refresh);
router.post("/logout", AuthValidator.logout, AuthController.logout);

module.exports = router;
