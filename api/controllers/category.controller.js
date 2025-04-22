const categoryService = require("../../services/category.service");
const ResponseHandler = require("../../utils/response-handlers");
const {
    createCategorySchema,
    updateCategorySchema,
} = require("../validators/category.validator");

async function getAllCategory(req, res, next) {
  try {
    const cate = await categoryService.getAllCategory();
    return ResponseHandler.success(res, {
      message: "List of category fetched successfully",
      data: cate,
    });
  } catch (err) {
    next(err);
  }
}

async function createCategory(req, res, next) {
  try {
    const {name} = req.body;
    const validated = createCategorySchema.parse(req.body);
    const find = await categoryService.getCategoryByName(name);
    if(find){
        return res.status(400).json({
            success: "false",
            message: "Validation failed",
            errors: [{
                "field": "Name",
                "message": "Name already exists"
            }]
        });
    }; 
    const newCate = await categoryService.createCategory(validated);
    return ResponseHandler.success(res, {
      statusCode: 201,
      message: "Category created successfully",
      data: newCate,
    });
  } catch (err) {
    if (err.name === "ZodError") {
      const errors = err.errors.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      }));
      return ResponseHandler.badRequest(res, "Validation failed", errors);
    }
    next(err);
  }
}

async function updateCategory(req, res, next) {
  try {
    const {name} = req.body;
    const validated = updateCategorySchema.parse(req.body);
    const find = await categoryService.getCategoryByName(name);
    if(find){
        return res.status(400).json({
            success: "false",
            message: "Validation failed",
            errors: [{
                "field": "Name",
                "message": "Name is exit"
            }]
        });
    }; 
    const updateCate = await categoryService.updateCategory(req.params.id, validated);
    if (!updateCate) return ResponseHandler.notFound(res, "Category not found");
    return ResponseHandler.success(res, {
      message: "Category updated successfully",
      data: updateCate,
    });
  } catch (err) {
    if (err.name === "ZodError") {
      const errors = err.errors.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      }));
      return ResponseHandler.badRequest(res, "Validation failed", errors);
    }
    next(err);
  }
}

async function deleteCategory(req, res, next) {
  try {
    const deleted = await categoryService.deleteCategory(req.params.id);
    if (!deleted) return ResponseHandler.notFound(res, "Category not found");
    return ResponseHandler.success(res, {
      message: "Category deleted successfully",
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};
