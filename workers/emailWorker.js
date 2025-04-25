/* eslint-disable no-undef */
// workers/emailWorker.js

const { parentPort } = require("worker_threads");
const transporter = require("../utils/mailer");
require("dotenv").config();

parentPort.on("message", async (data) => {
  const { to, subject, html } = data;

  try {
    await transporter.sendMail({
      from: `"LMS Admin" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    parentPort.postMessage({ success: true });
  } catch (err) {
    parentPort.postMessage({ success: false, error: err.message });
  }
});
