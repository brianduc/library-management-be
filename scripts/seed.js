const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const config = require("../config/database");
const {
  User,
  Book,
  Category,
  BorrowRequest,
  BorrowRecord,
  Fine,
  Review,
  Notification,
} = require("../models"); // Assuming models/index.js exports all models

const BCRYPT_SALT_ROUNDS = 10; // Or get from config if defined there

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.databaseURL, {
      dbName: config.databaseName,
    });
    console.log("Database connected for seeding.");

    // Clear existing data (optional, but recommended for clean seeding)
    console.log("Clearing existing data...");
    await Promise.all([
      User.deleteMany({}),
      Category.deleteMany({}),
      Book.deleteMany({}),
      BorrowRequest.deleteMany({}),
      BorrowRecord.deleteMany({}),
      Fine.deleteMany({}),
      Review.deleteMany({}),
      Notification.deleteMany({}),
    ]);
    console.log("Existing data cleared.");

    // --- Seed Categories ---
    console.log("Seeding categories...");
    const categories = await Category.insertMany([
      { name: "Fiction" },
      { name: "Science" },
      { name: "History" },
      { name: "Technology" },
      { name: "Fantasy" },
    ]);
    console.log(`${categories.length} categories seeded.`);
    const fictionCategory = categories.find((c) => c.name === "Fiction");
    const techCategory = categories.find((c) => c.name === "Technology");
    const scienceCategory = categories.find((c) => c.name === "Science");

    // --- Seed Users ---
    console.log("Seeding users...");
    const passwordAdmin = await bcrypt.hash("admin123", BCRYPT_SALT_ROUNDS);
    const passwordStaff = await bcrypt.hash("staff123", BCRYPT_SALT_ROUNDS);
    const passwordStudent1 = await bcrypt.hash(
      "student123",
      BCRYPT_SALT_ROUNDS,
    );
    const passwordStudent2 = await bcrypt.hash(
      "student456",
      BCRYPT_SALT_ROUNDS,
    );

    const users = await User.insertMany([
      {
        full_name: "Admin User",
        email: "admin@library.com",
        password: passwordAdmin,
        role: "admin",
        is_active: true,
        phone: "111222333",
        identity_number: "ADM001",
      },
      {
        full_name: "Staff User",
        email: "staff@library.com",
        password: passwordStaff,
        role: "staff",
        is_active: true,
        phone: "444555666",
        identity_number: "STF001",
      },
      {
        full_name: "Alice Wonderland",
        email: "alice@student.com",
        password: passwordStudent1,
        role: "student",
        is_active: true,
        phone: "777888999",
        identity_number: "STU001",
      },
      {
        full_name: "Bob The Builder",
        email: "bob@student.com",
        password: passwordStudent2,
        role: "student",
        is_active: true,
        phone: "123123123",
        identity_number: "STU002",
      },
    ]);
    console.log(`${users.length} users seeded.`);
    const studentUser1 = users.find((u) => u.email === "alice@student.com");
    const studentUser2 = users.find((u) => u.email === "bob@student.com");

    // --- Seed Books ---
    console.log("Seeding books...");
    const books = await Book.insertMany([
      {
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        description: "A novel about the American dream.",
        quantity_total: 5,
        quantity_available: 5,
        status: "available",
        category_id: fictionCategory._id,
        qr_code: "QR_GATSBY_01",
      },
      {
        title: "Clean Code",
        author: "Robert C. Martin",
        description: "A handbook of agile software craftsmanship.",
        quantity_total: 3,
        quantity_available: 2, // One might be borrowed later
        status: "available",
        category_id: techCategory._id,
        qr_code: "QR_CLEANCODE_01",
      },
      {
        title: "Sapiens: A Brief History of Humankind",
        author: "Yuval Noah Harari",
        description: "Exploring the history of humankind.",
        quantity_total: 4,
        quantity_available: 4,
        status: "available",
        category_id: scienceCategory._id,
        qr_code: "QR_SAPIENS_01",
      },
      {
        title: "Damaged Book Example",
        author: "Writer McWriteface",
        description: "This book is intentionally damaged.",
        quantity_total: 1,
        quantity_available: 0,
        status: "damaged",
        category_id: fictionCategory._id,
        qr_code: "QR_DAMAGED_01",
      },
      {
        title: "Out of Stock Book",
        author: "Unavailable Author",
        description: "All copies are currently borrowed.",
        quantity_total: 2,
        quantity_available: 0,
        status: "out_of_stock",
        category_id: techCategory._id,
        qr_code: "QR_OUTOFSTOCK_01",
      },
    ]);
    console.log(`${books.length} books seeded.`);
    const gatsbyBook = books.find((b) => b.title === "The Great Gatsby");
    const cleanCodeBook = books.find((b) => b.title === "Clean Code");
    const sapiensBook = books.find(
      (b) => b.title === "Sapiens: A Brief History of Humankind",
    );
    const outOfStockBook = books.find((b) => b.title === "Out of Stock Book");

    // --- Seed Borrow Requests ---
    console.log("Seeding borrow requests...");
    const borrowRequests = await BorrowRequest.insertMany([
      {
        // Pending request
        user_id: studentUser1._id,
        book_id: gatsbyBook._id,
        status: "pending",
      },
      {
        // Approved request (will become a record)
        user_id: studentUser2._id,
        book_id: cleanCodeBook._id,
        status: "approved",
        approved_date: new Date(),
      },
      {
        // Rejected request
        user_id: studentUser1._id,
        book_id: outOfStockBook._id, // Requesting an out-of-stock book
        status: "rejected",
      },
    ]);
    console.log(`${borrowRequests.length} borrow requests seeded.`);
    const approvedRequest = borrowRequests.find((r) => r.status === "approved");

    // --- Seed Borrow Records ---
    console.log("Seeding borrow records...");
    const today = new Date();
    const dueDate1 = new Date(today);
    dueDate1.setDate(today.getDate() + 14); // Due in 14 days

    const pastBorrowDate = new Date();
    pastBorrowDate.setDate(today.getDate() - 20); // Borrowed 20 days ago
    const pastDueDate = new Date();
    pastDueDate.setDate(today.getDate() - 6); // Was due 6 days ago (overdue)
    const pastReturnDate = new Date();
    pastReturnDate.setDate(today.getDate() - 2); // Returned 2 days ago (late)

    const borrowRecords = await BorrowRecord.insertMany([
      {
        // Active borrow based on approved request
        user_id: approvedRequest.user_id,
        book_id: approvedRequest.book_id,
        borrow_date: approvedRequest.approved_date,
        due_date: dueDate1,
        is_returned: false,
      },
      {
        // Overdue and returned late
        user_id: studentUser1._id,
        book_id: sapiensBook._id,
        borrow_date: pastBorrowDate,
        due_date: pastDueDate,
        return_date: pastReturnDate, // Returned after due date
        is_returned: true,
      },
      {
        // Borrowed and returned on time (example)
        user_id: studentUser2._id,
        book_id: gatsbyBook._id, // Borrowed another book
        borrow_date: new Date(today.setDate(today.getDate() - 10)), // Borrowed 10 days ago
        due_date: new Date(today.setDate(today.getDate() + 4)), // Due in 4 days from original borrow date
        return_date: new Date(today.setDate(today.getDate() + 3)), // Returned 1 day before due date
        is_returned: true,
      },
    ]);
    console.log(`${borrowRecords.length} borrow records seeded.`);
    const lateReturnRecord = borrowRecords.find(
      (r) => r.return_date && r.return_date > r.due_date,
    );

    // --- Seed Fines ---
    console.log("Seeding fines...");
    const fines = await Fine.insertMany([
      {
        // Fine for the late return
        user_id: lateReturnRecord.user_id,
        borrow_record_id: lateReturnRecord._id,
        amount: 5.0, // Example fine amount
        reason: "Late return",
        is_paid: false, // Not yet paid
      },
      {
        // Fine for a damaged book, linked to the same user's late return record for simplicity
        user_id: studentUser1._id,
        borrow_record_id: lateReturnRecord._id, // Link to an existing record for this user
        amount: 20.0,
        reason: "Book damaged",
        is_paid: true, // Already paid
      },
    ]);
    console.log(`${fines.length} fines seeded.`);

    // --- Seed Reviews ---
    console.log("Seeding reviews...");
    const reviews = await Review.insertMany([
      {
        user_id: studentUser1._id,
        book_id: sapiensBook._id, // Reviewed the book they returned late
        rating: 4,
        comment: "Very insightful, but a bit dense in places.",
      },
      {
        user_id: studentUser2._id,
        book_id: cleanCodeBook._id, // Reviewed the book they currently have
        rating: 5,
        comment: "A must-read for every developer!",
      },
      {
        user_id: studentUser2._id,
        book_id: gatsbyBook._id, // Reviewed the book they returned on time
        rating: 3,
        comment: "It was okay.",
      },
    ]);
    console.log(`${reviews.length} reviews seeded.`);

    // --- Seed Notifications ---
    console.log("Seeding notifications...");
    const notifications = await Notification.insertMany([
      {
        // Notification for overdue book (before it was returned)
        user_id: lateReturnRecord.user_id,
        content: `Your borrowed book "${sapiensBook.title}" is overdue. Please return it soon.`,
        is_read: false,
      },
      {
        // Notification about fine issued
        user_id: lateReturnRecord.user_id,
        content: `A fine of $${fines[0].amount.toFixed(2)} has been issued for the late return of "${sapiensBook.title}".`,
        is_read: false,
      },
      {
        // General notification
        user_id: studentUser2._id,
        content: "Welcome to the Library Management System!",
        is_read: true,
      },
    ]);
    console.log(`${notifications.length} notifications seeded.`);

    console.log("Seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log("Database disconnected.");
  }
}

// Run the seeder
seedDatabase();
