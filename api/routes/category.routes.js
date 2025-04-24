const express = require("express");
const router = express.Router();

const categoryController = require("../controllers/category.controller");
const { authenticate, authorizeRole } = require("../middlewares/auth");

router.get(
  "/",
  authenticate,
  authorizeRole("admin", "staff", "member"),
  categoryController.getAllCategory,
);

router.get(
  "/:id",
  authenticate,
  authorizeRole("admin", "staff", "member"),
  categoryController.getCategoryById,
);  

router.post(
  "/",
  authenticate,
  authorizeRole("admin", "staff"),
  categoryController.createCategory,
);

router.put(
  "/:id",
  authenticate,
  authorizeRole("admin", "staff"),
  categoryController.updateCategory,
);
router.delete(
  "/:id",
  authenticate,
  authorizeRole("admin", "staff"),
  categoryController.deleteCategory,
);

module.exports = router;
