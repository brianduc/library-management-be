const { z } = require("zod");

const baseCategorySchema = {
  name: z.string().min(1, "Category name is required"),
};

const createCategorySchema = z.object({
  ...baseCategorySchema,
});

const updateCategorySchema = z.object({
  name: baseCategorySchema.name.optional(),
});


module.exports = {
  createCategorySchema,
  updateCategorySchema,
  
};
