const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
dotenv.config();
const express = require('express');
const app = express();
const port = 5000;
const connectDB = require('./config/db');
const cors = require('cors');
connectDB();

app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use('/api/auth', authRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
