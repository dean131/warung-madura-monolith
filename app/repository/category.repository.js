const Category = require('../model/category.model');

const create = async ({ name }) => {
  return Category.query().insert({ name });
};

const findAll = async () => {
  return Category.query();
};

const findById = async (id) => {
  return Category.query().findById(id);
};

const findByName = async (name) => {
  return Category.query().findOne({ name }); 
  // For case-insensitive: .whereRaw('LOWER(name) = ?', [name.toLowerCase()]).first();
};


const update = async (id, { name }) => {
  return Category.query().findById(id).patch({ name });
};


const softDelete = async (id) => {
  return Category.softDeleteById(id);
};

/*
const findAllWithTrashed = async () => {
  return Category.queryWithTrashed();
};

const findByIdIncludingTrashed = async (id) => {
  return Category.queryWithTrashed().findById(id);
};

const restore = async (id) => {
  return Category.restoreById(id);
};
*/

module.exports = {
  create,
  findAll,
  findById,
  findByName,
  update,
  softDelete,
};