
const borrowRecordService = require("../../services/borrowRecord.service");

const ResponseHandler = require("../../utils/response-handlers");
const {
  createBorrowRecordSchema,
} = require("../validators/borrowRecord.validator");

async function getAllBorrowRecords(req, res, next) {
  try {
    const borrowRecords = await borrowRecordService.getAll();
    return ResponseHandler.success(res, {
      message: "All borrow records retrieved successfully",
      data: borrowRecords,
    });
  } catch (err) {
    next(err);
  }
}

async function getUserBorrowRecords(req, res, next) {
  try {
    const borrowRecords = await borrowRecordService.getByUserId(
      req.params.userId,
    );
    if (!borrowRecords) {
      return ResponseHandler.notFound(res, "User not found");
    }
   
    if (borrowRecords.length === 0) {
      return ResponseHandler.notFound(
        res,
        "No borrow records found for this user",
      );
    }
    return ResponseHandler.success(res, {
      message: "Your borrow records retrieved successfully",
      data: borrowRecords,
    });
  } catch (err) {
    next(err);
  }
}

async function createBorrowRecord(req, res, next) {
  try {
    const validated = createBorrowRecordSchema.parse({ ...req.body });

    const result = await borrowRecordService.create(validated);

    if (result.error) {
      return ResponseHandler.error(res, {
        statusCode: result.statusCode || 400,
        message: result.message || "Error creating borrow record",
      });
    }

    return ResponseHandler.success(res, {
      statusCode: 201,
      message: "Borrow record created successfully",
      data: result.data,
    });
  } catch (err) {
    next(err);
  }
}


async function returnBook(req, res, next) {
  try {
    const result = await borrowRecordService.returnBook(req.params.id);

    if (result.error) {
      return ResponseHandler.error(res, {
        statusCode: result.statusCode || 400,
        message: result.message,
      });
    }

    return ResponseHandler.success(res, {
      message: "Book returned successfully",
      data: result.data,
    });
  } catch (err) {
    next(err);
  }
}


module.exports = {
  getAllBorrowRecords,
  getUserBorrowRecords,
  createBorrowRecord,
  returnBook,
};
