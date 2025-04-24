const path = require("path");
const { Worker } = require("worker_threads");

function sendEmailInThread({ to, subject, html }) {
  const worker = new Worker(
    // eslint-disable-next-line no-undef
    path.resolve(__dirname, "../workers/emailWorker.js"),
  );

  worker.postMessage({ to, subject, html });

  worker.on("message", (result) => {
    if (!result.success) {
      console.error("Email failed:", result.error);
    }
    worker.terminate(); // Clean up
  });

  worker.on("error", (err) => {
    console.error("Worker error:", err);
    worker.terminate();
  });
}

module.exports = sendEmailInThread;
