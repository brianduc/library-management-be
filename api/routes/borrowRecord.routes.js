const express = require("express");
const router = express.Router();
const borrowRecordController = require("../controllers/borrowRecord.controller");
const { authenticate, authorizeRole } = require("../middlewares/auth");
// Tạo một BorrowRecord mới khi mượn sách
router.post("/",
     authenticate,
      authorizeRole("staff",'admin'),
     borrowRecordController.createBorrowRecord);

// Lấy tất cả BorrowRecords
router.get("/",
    authenticate,
    authorizeRole("staff",'admin','member'),
     borrowRecordController.getAllBorrowRecords);

// Lấy các BorrowRecords của một người dùng cụ thể
router.get("/user/:userId",
    authenticate,
    authorizeRole("staff",'admin','member'),
     borrowRecordController.getUserBorrowRecords);

// Cập nhật khi trả sách
router.patch("/:id/return",
    authenticate,
    authorizeRole("staff",'admin'),
     borrowRecordController.returnBook);

module.exports = router;
