require('dotenv').config();
const express = require('express');
const cors = require('cors');

const initializeFirebase = require('./config/db');
const { setDb } = require('./models/Order');

const menuRoutes = require('./routes/menu');
const paymentRoutes = require('./routes/payment');
const orderRoutes = require('./routes/orders');

const app = express();

// ✅ Initialize Firebase
const db = initializeFirebase();
setDb(db);

// ✅ FIXED CORS CONFIG (Development Safe)
app.use(cors({
    origin: true,        // Allow any localhost origin
    credentials: true
}));

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Routes
app.use('/api/menu', menuRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/orders', orderRoutes);

// ✅ Root
app.get('/', (req, res) => {
    res.json({
        message: '🍳 Fresh Egg Roll Corner API',
        status: 'Server is running',
    });
});

// ✅ Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
    });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});