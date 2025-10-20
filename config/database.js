require("dotenv").config();
const { Model } = require("objection");
const knex = require("knex");
const knexfile = require("../knexfile");
const { attachPaginate } = require("knex-paginate");

const dbConfig = knexfile.development;

const db = knex(dbConfig);

Model.knex(db);

attachPaginate();

module.exports = db;
