const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { createOrder } = require('../models/Order');

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// POST /api/payment/create-order - Create Razorpay order
router.post('/create-order', async (req, res) => {
    try {
        const { amount, items } = req.body;

        // Validate input
        if (!amount || !items || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Amount and items are required'
            });
        }

        // Create Razorpay order
        const options = {
            amount: amount * 100, // Convert to paise (smallest currency unit)
            currency: 'INR',
            receipt: `receipt_${Date.now()}`,
            notes: {
                items: JSON.stringify(items)
            }
        };

        const razorpayOrder = await razorpay.orders.create(options);

        res.status(200).json({
            success: true,
            data: {
                orderId: razorpayOrder.id,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency
            }
        });
    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create payment order',
            error: error.message
        });
    }
});

// POST /api/payment/verify - Verify payment and save order
router.post('/verify', async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            items,
            totalAmount
        } = req.body;

        // Validate input
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: 'Missing payment verification details'
            });
        }

        // Verify signature
        const sign = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(sign.toString())
            .digest('hex');

        if (razorpay_signature !== expectedSign) {
            return res.status(400).json({
                success: false,
                message: 'Invalid payment signature'
            });
        }

        // Payment verified successfully - save order to Firestore
        const newOrder = await createOrder({
            items,
            totalAmount,
            razorpayOrderId: razorpay_order_id,
            razorpayPaymentId: razorpay_payment_id,
            razorpaySignature: razorpay_signature,
            paymentStatus: 'Paid',
            orderStatus: 'New'
        });

        res.status(200).json({
            success: true,
            message: 'Payment verified and order created',
            data: {
                orderId: newOrder.orderId,
                orderStatus: newOrder.orderStatus,
                timestamp: newOrder.timestamp
            }
        });
    } catch (error) {
        console.error('Error verifying payment:', error);
        res.status(500).json({
            success: false,
            message: 'Payment verification failed',
            error: error.message
        });
    }
});

// POST /api/payment/demo-order - Demo mode: save order directly without Razorpay
router.post('/demo-order', async (req, res) => {
    try {
        const { items, totalAmount } = req.body;

        if (!items || items.length === 0 || !totalAmount) {
            return res.status(400).json({
                success: false,
                message: 'Items and totalAmount are required'
            });
        }

        const newOrder = await createOrder({
            items,
            totalAmount,
            razorpayOrderId: `DEMO-${Date.now()}`,
            razorpayPaymentId: `DEMO-PAY-${Date.now()}`,
            razorpaySignature: 'demo-signature',
            paymentStatus: 'Paid',
            orderStatus: 'New'
        });

        res.status(200).json({
            success: true,
            message: 'Demo order created successfully',
            data: {
                orderId: newOrder.orderId,
                orderStatus: newOrder.orderStatus,
                timestamp: newOrder.timestamp
            }
        });
    } catch (error) {
        console.error('Error creating demo order:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create demo order',
            error: error.message
        });
    }
});

module.exports = router;
