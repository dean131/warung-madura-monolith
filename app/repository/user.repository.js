const User = require("../model/user.model");
const db = require("../../config/database");

const REFRESH_TOKEN_TABLE = "refresh_tokens";

const findUserByEmailWithPassword = async (email) => {
  return User.query().findOne({ email }).select("*");
};

const findUserByUsernameWithPassword = async (username) => {
  return User.query().findOne({ username }).select("*");
};

const findUserByUsernameOrEmailWithPassword = async (loginIdentifier) => {
  return User.query()
    .findOne((builder) => {
      builder
        .where("username", loginIdentifier)
        .orWhere("email", loginIdentifier);
    })
    .select("*");
};

const findUserById = async (id) => {
  return User.query().findById(id);
};

const createUser = async ({ username, email, password_hash }) => {
  return User.query().insert({ username, email, password_hash });
};

const saveRefreshToken = async (token, userId, expiresAt) => {
  const [savedToken] = await db(REFRESH_TOKEN_TABLE)
    .insert({ token: token, user_id: userId, expires_at: expiresAt })
    .returning("*");
  return savedToken;
};

const findRefreshToken = async (token) => {
  return db(REFRESH_TOKEN_TABLE).where({ token }).first();
};

const deleteRefreshToken = async (token) => {
  return db(REFRESH_TOKEN_TABLE).where({ token }).del();
};

module.exports = {
  findUserByEmailWithPassword,
  findUserByUsernameWithPassword,
  findUserByUsernameOrEmailWithPassword,
  findUserById,
  createUser,
  saveRefreshToken,
  findRefreshToken,
  deleteRefreshToken,
};
