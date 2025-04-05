const nodemailer = require('nodemailer');
require('dotenv').config(); 

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_PASSWORD
    },
});

const sendEmail = async (recipients, subject, text) => {
    const mailOptions = {
        from: process.env.GMAIL_EMAIL,
        to: recipients.join(','),
        subject: subject,
        text: text,
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error with email sender:', error);
    }
};

module.exports = sendEmail;