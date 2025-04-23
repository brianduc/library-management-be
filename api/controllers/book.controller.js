const bookService = require("../../services/book.service");
const ResponseHandler = require("../../utils/response-handlers");
const {
    createBookSchema,
    updateBookSchema,
  } = require("../validators/book.validator");
async function getAllBooks(req, res, next) {
  try {
    const page = parseInt(req.query.page) || 1;
    const books = await bookService.getAllBookByPage(page);
    return ResponseHandler.success(res, {
      message: "List of books fetched successfully",
      data: books,
    });
  } catch (err) {
    next(err);
  }
}
async function getBookById(req, res, next) {
  try {
    const book = await bookService.getBookById(req.params.id);
    if (!book) return ResponseHandler.notFound(res, "Book not found");
    return ResponseHandler.success(res, {
      message: "Book fetched successfully",
      data: book,
    });
  } catch (err) {
    next(err);
  }
}

async function createBook(req, res, next) {
  try {
    const validated = createBookSchema.parse(req.body);
    const exitTitle = await bookService.getBookByTitle(req.body.title);
    if(exitTitle){
        return res.status(400).json({
            success: "false",
            message: "Validation failed",
            errors: [{
                "field": "title",
                "message": "title already exists"
            }]
        });
    }
    const newBook = await bookService.createBook(validated);
    return ResponseHandler.success(res, {
      statusCode: 201,
      message: "Book created successfully",
      data: newBook,
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

async function updateBook(req, res, next) {
  try {
    const validated = updateBookSchema.parse(req.body);
    const exitTitle = await bookService.getBookByTitle(req.body.title);
    if(exitTitle){
        return res.status(400).json({
            success: "false",
            message: "Validation failed",
            errors: [{
                "field": "title",
                "message": "title is exit"
            }]
        });
    }
    const updateBook = await bookService.updateBook(req.params.id, validated);
    if (!updateBook) return ResponseHandler.notFound(res, "Book not found");
    return ResponseHandler.success(res, {
      message: "Book updated successfully",
      data: updateBook,
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

async function deleteBook(req, res, next) {
  try {
    const deleted = await bookService.deleteBook(req.params.id);
    if (!deleted) return ResponseHandler.notFound(res, "Book not found");
    return ResponseHandler.success(res, {
      message: "Book deleted successfully",
    });
  } catch (err) {
    next(err);
  }
}

async function changeStatusBook(req, res, next) {
  try {
    const book = await bookService.changeStatusBook(req.params.id);
    if (!book) return ResponseHandler.notFound(res, "Book not found");
    return ResponseHandler.success(res, {
      message: "Book change status successfully",
    });
  } catch (err) {
    next(err);
  }
}
module.exports = {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  changeStatusBook,
};
