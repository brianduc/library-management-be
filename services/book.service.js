const Book = require("../models/book");


async function getAllBookByPage(page) {
  try {
    const books = await Book.find({});
    return books;
  } catch (err) {
    console.error("Lỗi khi lấy danh sách sách:", err);
    throw err;
  }
}

async function getAllBooksv2() {
  return await Book.find({});
}

async function getBookByTitle(title) {
  const book = await Book.findOne({ title });
  return book;
}
async function getBookById(id) {
  return await Book.findById(id);
}
async function createBook(data) {
  return await Book.create(data);
}

async function updateBook(id, data) {
  return await Book.findByIdAndUpdate(id, data, { new: true });
}

async function deleteBook(id) {
  return await Book.findByIdAndDelete(id);
}

async function changeStatusBook(id) {
  const book = await Book.findById(id);
  if (!book) {
    return null;
  }
  const updatedBook = await Book.findByIdAndUpdate(
    id,
    { is_hidden: !book.is_hidden },
    { new: true },
  );
  return updatedBook;
}

module.exports = {
  getAllBookByPage,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  getBookByTitle,
  changeStatusBook,
  getAllBooksv2,
};
