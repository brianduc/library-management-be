const express = require("express");
const router = express.Router();

const userController = require("../controllers/user.controller");
const {
  authenticate,
  authorizeRole,
} = require("../middlewares/auth");

router.get(
  "/",
  authenticate,
  authorizeRole("admin"),
  userController.getAllUsers,
);
router.get(
  "/:id",
  authenticate,
  authorizeRole("admin"),
  userController.getUserById,
);
router.post(
  "/",
  authenticate,
  authorizeRole("admin"),
  userController.createUser,
);
router.put(
  "/:id",
  authenticate,
  authorizeRole("admin"),
  userController.updateUser,
);
router.delete(
  "/:id",
  authenticate,
  authorizeRole("admin"),
  userController.deleteUser,
);

module.exports = router;
