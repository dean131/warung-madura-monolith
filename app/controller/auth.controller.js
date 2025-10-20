const authService = require("../service/auth.service");
const { successResponse } = require("../../library/responseHelper");
const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const newUser = await authService.register(username, email, password);
    return successResponse(res, "User registered successfully!", newUser, 200);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { loginIdentifier, password } = req.body;
    const loginResult = await authService.login(loginIdentifier, password);
    return successResponse(res, "Login success!", loginResult);
  } catch (error) {
    next(error);
  }
};

const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const result = await authService.refresh(refreshToken);
    return successResponse(res, "Token refreshed successfully!", result);
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    await authService.logout(refreshToken);
    return successResponse(res, "Logout successful!");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  refresh,
  logout,
};
