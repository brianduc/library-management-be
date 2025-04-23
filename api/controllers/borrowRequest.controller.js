const borrowRequestService = require("../../services/borrowRequest.service");

const ResponseHandler = require("../../utils/response-handlers");

const {
  createBorrowRequestSchema,
} = require("../validators/borrowRequest.validator");
const borrowRecordService = require("../../services/borrowRecord.service");

async function getAllBorrowRequests(req, res, next) {
  try {
    const requests = await borrowRequestService.getAll();
   
    return ResponseHandler.success(res, {
      message: "All borrow requests retrieved successfully",
      data: requests,
    });
  } catch (err) {
    next(err);
  }
}

async function getMyBorrowRequests(req, res, next) {
  try {
    const requests = await borrowRequestService.getByUserId(req.params.userId, res);

    if (!requests) {
      return ResponseHandler.notFound(res, "User not found");
    }
    if (requests.length === 0) {
      return ResponseHandler.notFound(
        res,
        "No borrow requests found for this user",
      );
    }
    return ResponseHandler.success(res, {
      message: "Your borrow requests retrieved successfully",
      data: requests,
    });
  } catch (err) {
    next(err);
  }
}

async function createBorrowRequest(req, res, next) {
  try {
    const validated = createBorrowRequestSchema.parse({ ...req.body });
     console.log("validated",validated)
   
    // const created = await borrowRequestService.create(validated,res);
    
    const result = await borrowRequestService.create(validated);

    // Nếu là lỗi trả về dạng { error: true, message: "...", statusCode: 400 }
    if (result?.error) {
      return ResponseHandler.error(res, {
        statusCode: result.statusCode || 400,
        message: result.message,
      });
    }

    return ResponseHandler.success(res, {
      statusCode: 201,
      message: "Borrow request created successfully",
      data: result,
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

async function approveBorrowRequest(req, res, next) {
  try {
    const updated = await borrowRequestService.updateStatus(
      req.params.id,
      "approved"
    );

    // Nếu updateStatus trả về lỗi
    if (!updated) {
      return ResponseHandler.notFound(res, "Borrow request not found");
    }

    if (updated?.error) {
      return ResponseHandler.error(res, {
        statusCode: updated.statusCode || 400,
        message: updated.message || "Failed to update borrow request status",
      });
    }

    const newBorrowRecord = await borrowRecordService.create({
      user_id: updated.user_id, // từ updated
      book_id: updated.book_id,
      due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 
    });

    return ResponseHandler.success(res, {
      message: "Borrow request approved",
      data: updated,
      newBorrowRecord,
    });
  } catch (err) {
    next(err);
  }
}


async function rejectBorrowRequest(req, res, next) {
  try {
    const updated = await borrowRequestService.updateStatus(
      req.params.id,
      "rejected",
    );
    if (!updated)
      return ResponseHandler.notFound(res, "Borrow request not found");
    return ResponseHandler.success(res, {
      message: "Borrow request rejected",
      data: updated,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllBorrowRequests,
  getMyBorrowRequests,
  createBorrowRequest,
  approveBorrowRequest,
  rejectBorrowRequest,
};
