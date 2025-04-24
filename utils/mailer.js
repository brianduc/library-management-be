/* eslint-disable no-undef */
// utils/mailer.js
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "Gmail", // or 'Outlook', or use 'host' & 'port' for custom SMTP
  auth: {
    user: process.env.EMAIL_USER, // e.g. admin@gmail.com
    pass: process.env.EMAIL_PASS, // your app password or email password
  },
});


module.exports = transporter;
