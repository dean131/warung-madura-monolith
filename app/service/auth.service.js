const bcrypt = require("bcryptjs");
const jsonwebtoken = require("jsonwebtoken");
const crypto = require("crypto");
const userRepository = require("../repository/user.repository");
const ApiError = require("../../library/ApiError");
const config = require("../../config");

const generateToken = (payload, secret, expiresIn) => {
  return jsonwebtoken.sign(payload, secret, { expiresIn });
};

const calculateExpiryDate = (durationString) => {
  const now = new Date();
  const unit = durationString.slice(-1);
  const value = parseInt(durationString.slice(0, -1), 10);
  let multiplier = 1000; // ms
  if (unit === "m") multiplier *= 60;
  if (unit === "h") multiplier *= 60 * 60;
  if (unit === "d") multiplier *= 60 * 60 * 24;
  if (!value || isNaN(value) || !multiplier) {
    multiplier = 1000 * 60 * 60 * 24 * 7;
  } else {
    multiplier = value * multiplier;
  }

  now.setTime(now.getTime() + multiplier);
  return now;
};

const register = async (username, email, password) => {
  const existingUserByUsername =
    await userRepository.findUserByUsernameWithPassword(username);
  if (existingUserByUsername) {
    throw new ApiError(409, "Username is already in use.");
  }
  const existingUserByEmail = await userRepository.findUserByEmailWithPassword(
    email
  );
  if (existingUserByEmail) {
    throw new ApiError(409, "Email is already in use.");
  }

  const password_hash = await bcrypt.hash(password, 10);
  const newUser = await userRepository.createUser({
    username,
    email,
    password_hash,
  });
  return newUser;
};

const login = async (loginIdentifier, password) => {
  const user = await userRepository.findUserByUsernameOrEmailWithPassword(
    loginIdentifier
  );

  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    throw new ApiError(400, "Invalid Credentials!");
  }

  const userPayload = {
    id: user.id,
    username: user.username,
    email: user.email,
  };
  const accessToken = generateToken(
    userPayload,
    config.appKey,
    config.accessTokenExpiry
  );

  const refreshTokenString = crypto.randomBytes(40).toString("hex");
  const refreshTokenExpiry = calculateExpiryDate(config.refreshTokenExpiry);

  await userRepository.saveRefreshToken(
    refreshTokenString,
    user.id,
    refreshTokenExpiry
  );

  return {
    ...userPayload,
    accessToken: accessToken,
    refreshToken: refreshTokenString,
  };
};

const refresh = async (refreshToken) => {
  const storedToken = await userRepository.findRefreshToken(refreshToken);

  if (!storedToken || new Date(storedToken.expires_at) < new Date()) {
    if (storedToken) {
      await userRepository.deleteRefreshToken(refreshToken);
    }
    throw new ApiError(401, "Invalid or expired refresh token.");
  }

  const user = await userRepository.findUserById(storedToken.user_id);
  if (!user) {
    await userRepository.deleteRefreshToken(refreshToken);
    throw new ApiError(401, "User not found for this token.");
  }

  const userPayload = {
    id: user.id,
    username: user.username,
    email: user.email,
  };
  const newAccessToken = generateToken(
    userPayload,
    config.appKey,
    config.accessTokenExpiry
  );

  return {
    accessToken: newAccessToken,
  };
};

const logout = async (refreshToken) => {
  await userRepository.deleteRefreshToken(refreshToken);
};

module.exports = {
  register,
  login,
  refresh,
  logout,
};
