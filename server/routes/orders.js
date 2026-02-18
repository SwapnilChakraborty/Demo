const express = require('express');
const router = express.Router();
const { getAllOrders, updateOrderStatus } = require('../models/Order');
const admin = require('firebase-admin');

// GET /api/orders - Fetch all orders (sorted by newest first)
router.get('/', async (req, res) => {
    try {
        const orders = await getAllOrders();

        res.status(200).json({
            success: true,
            data: orders
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch orders',
            error: error.message
        });
    }
});

// GET /api/orders/stats - Get today's statistics
router.get('/stats', async (req, res) => {
    try {
        // Get all orders
        const allOrders = await getAllOrders();

        // Get start of today (midnight)
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        // Filter today's paid orders
        const todayOrders = allOrders.filter(order => {
            const orderDate = new Date(order.timestamp);
            return orderDate >= startOfToday && order.paymentStatus === 'Paid';
        });

        // Calculate total revenue
        const totalRevenue = todayOrders.reduce((sum, order) => sum + order.totalAmount, 0);

        // Count pending orders (New or Preparing)
        const pendingOrders = todayOrders.filter(
            order => order.orderStatus === 'New' || order.orderStatus === 'Preparing'
        ).length;

        res.status(200).json({
            success: true,
            data: {
                totalRevenue,
                pendingOrders,
                totalOrders: todayOrders.length
            }
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch statistics',
            error: error.message
        });
    }
});

// PATCH /api/orders/:id/status - Update order status
router.patch('/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Validate status
        if (!['New', 'Preparing', 'Done'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status. Must be New, Preparing, or Done'
            });
        }

        const order = await updateOrderStatus(id, status);

        res.status(200).json({
            success: true,
            message: 'Order status updated',
            data: order
        });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update order status',
            error: error.message
        });
    }
});

module.exports = router;
