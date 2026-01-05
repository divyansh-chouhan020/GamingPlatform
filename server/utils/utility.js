const nodemailer = require("nodemailer");
const sendEmail = async ({to, subject, text}) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SENDER_MAIL,
      pass: process.env.PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.SENDER_MAIL,
    to: to,
    subject: subject,
    text: text,
   
  };
  console.log("mailOptions", mailOptions);

  await transporter.sendMail(mailOptions);
  console.log("Email sent successfully!");
};
module.exports = { sendEmail };