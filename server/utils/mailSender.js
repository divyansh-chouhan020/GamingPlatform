const nodemailer = require("nodemailer");

exports.sendEmail = async (email, title, body) => {
    try {
        // Create a Transporter
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST, // smtp.gmail.com
            auth: {
                user: process.env.MAIL_USER, // my gmail 
                pass: process.env.MAIL_PASS, //  16-digit App Password always connect me 
            },
        });

        // Send the mail
        let info = await transporter.sendMail({
            from: `"Game Arena | Divyansh" <${process.env.MAIL_USER}>`, 
            to: `${email}`,
            subject: `${title}`,
            html: `${body}`,
        });

        console.log("Email sent successfully: ", info.messageId);
        return info;
    } catch (error) {
        console.error("Nodemailer Error: ", error.message);
        throw error; // Rethrow so the controller knows the email failed
    }
};