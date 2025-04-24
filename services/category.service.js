const Category = require("../models/category");

async function getCategoryById(id) {
  return await Category.findById(id);
}

async function getAllCategory() {
  return await Category.find();
}

async function createCategory(data) {
  return await Category.create(data);
}

async function updateCategory(id, data) {
  return await Category.findByIdAndUpdate(id, data, { new: true });
}

async function deleteCategory(id) {
  return await Category.findByIdAndDelete(id);
}

async function getCategoryByName(name) {
  const cate = await Category.findOne({ name });
  return cate;
}
module.exports = {
  getCategoryById,
  getAllCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryByName
};
