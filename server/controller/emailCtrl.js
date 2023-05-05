const nodemailer = require("nodemailer"); // Require the nodemailer module
const asyncHandler = require("express-async-handler"); // Require the express-async-handler module

const sendEmail = asyncHandler(async (data, req, res) => {
  // Create an asynchronous function to send emails
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    // Create a transporter object with the SMTP transport
    host: "smtp.gmail.com", // Set the host as Gmail
    port: 587, // Set the port as 587
    secure: false, // Set the security to false
    auth: {
      // Set the authentication details
      user: process.env.MAIL_ID, // Set the user as the environment variable MAIL_ID
      pass: process.env.MP, // Set the password as the environment variable MP
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    // Send the email using the transporter object
    from: '"Hey 👻" <abc@gmail.com>', // Set the sender address
    to: data.to, // Set the receiver address
    subject: data.subject, // Set the subject line
    text: data.text, // Set the plain text body
    html: data.html, // Set the HTML body
  });

  console.log("Message sent: %s", info.messageId); // Log the message ID of the sent email
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info)); // Log the preview URL of the sent email
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
});

module.exports = sendEmail; // Export the sendEmail function
