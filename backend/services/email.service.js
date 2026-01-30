const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

const sendVerificationEmail = async (email, name, token) => {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
    await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: email,
        subject: 'Verify your email',
        html: `
            <h2>Hello ${name},</h2>
            <p>Please verify your email by clicking the link below:</p>
            <p><a href="${verificationUrl}">${verificationUrl}</a></p>
            <p>This link expires in 24 hours.</p>
        `,
    });
};

module.exports = { sendVerificationEmail };
