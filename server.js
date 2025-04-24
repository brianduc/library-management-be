/* eslint-disable no-undef */
const startServer = require("./app");
const { autoCreateFine } = require("./services/fine.service");
const User = require("./models/user");

// Hàm kiểm tra và tạo phạt cho tất cả người dùng
async function checkAndCreateFines() {
  try {
    console.log("Checking for overdue books and creating fines...");
    const users = await User.find();
    for (const user of users) {
      if (user._id) {  // Check if user._id exists
        await autoCreateFine(null, user._id);  // Pass null for res parameter
      }
    }
    
  } catch (error) {
    console.error("Error creating fines:", error);
  }
}

// Gọi hàm kiểm tra và tạo phạt mỗi 30 giây


// Start the application
startServer()
  .then(() => {
    console.info("Application started successfully");
  })
  .catch((error) => {
    console.error("Failed to start application:", error);
    process.exit(1);
  });
checkAndCreateFines();
setInterval(checkAndCreateFines, 10000); // 30000 milliseconds = 30 seconds

