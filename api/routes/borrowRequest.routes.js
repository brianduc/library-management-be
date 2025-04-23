const express = require("express");
const router = express.Router();
const borrowRequestController = require("../controllers/borrowRequest.controller");
const { authenticate, authorizeRole } = require("../middlewares/auth");

router.get(
  "/",
  authenticate,
  authorizeRole('admin',"staff",'member'),
  borrowRequestController.getAllBorrowRequests
);

router.get(
  "/:userId",
  authenticate,
  authorizeRole('admin',"staff",'member'),
  borrowRequestController.getMyBorrowRequests
);

router.post(
  "/",
  authenticate,
  authorizeRole('admin', 'staff', 'member'),
  borrowRequestController.createBorrowRequest
);

router.patch(
  "/:id/approve",
  authenticate,
  authorizeRole("staff",'admin'),
  borrowRequestController.approveBorrowRequest
);

router.patch(
  "/:id/rejected",
  authenticate,
  authorizeRole("staff",'admin'),
  borrowRequestController.rejectBorrowRequest
);

module.exports = router;
