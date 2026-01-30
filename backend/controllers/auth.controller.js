const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const { sendVerificationEmail } = require('../services/email.service');

const registerController = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Name, email and password are required.' });
    }
    if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: 'Email already registered.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const user = await User.create({ name, email, password: hashedPassword, verificationToken, verificationTokenExpires });
    try {
        await sendVerificationEmail(email, name, verificationToken);
        console.log('Verification email sent');
    } catch (emailErr) {
        console.error('Verification email failed:', emailErr.message);
    }
    res.status(201).json({ message: 'User registered successfully. Please check your email to verify your account.', user: { id: user._id, name: user.name, email: user.email } });
};

const verifyEmailController = async (req, res) => {
    const { token } = req.query;
    if (!token) {
        return res.status(400).json({ message: 'Verification token is required.' });
    }
    const user = await User.findOne({
        verificationToken: token,
        verificationTokenExpires: { $gt: Date.now() },
    });
    if (!user) {
        return res.status(400).json({ message: 'Invalid or expired verification token.' });
    }
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();
    res.json({ message: 'Email verified successfully. You can now log in.' });
};
const loginController = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: 'Invalid credentials.' });
    }
    if (!user.isVerified) {
        return res.status(401).json({ message: 'Please verify your email before logging in.' });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        return res.status(401).json({ message: 'Invalid credentials.' });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token });
};
const profileController = async (req, res) => {
    res.json({ name: req.user.name, email: req.user.email });
};
module.exports = { registerController, verifyEmailController, loginController, profileController };