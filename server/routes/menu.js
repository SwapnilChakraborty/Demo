const express = require('express');
const router = express.Router();

// Menu items - hardcoded as per requirements
const menuItems = [
    {
        id: 1,
        name: 'Egg Roll',
        price: 40,
        category: 'rolls',
        description: 'Classic crispy egg roll with fresh vegetables',
        rating: 4.5
    },
    {
        id: 2,
        name: 'Double Egg Roll',
        price: 60,
        category: 'rolls',
        description: 'Two delicious egg rolls packed with flavor',
        rating: 4.7,
        badge: 'Popular'
    },
    {
        id: 3,
        name: 'Chicken Roll',
        price: 80,
        category: 'rolls',
        description: 'Tender chicken wrapped in crispy roll',
        rating: 4.6
    },
    {
        id: 4,
        name: 'Double Chicken Roll',
        price: 100,
        category: 'rolls',
        description: 'Double the chicken, double the taste',
        rating: 4.8,
        badge: 'Best Seller'
    }
];

// GET /api/menu - Fetch all menu items
router.get('/', (req, res) => {
    try {
        res.status(200).json({
            success: true,
            data: menuItems
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch menu items',
            error: error.message
        });
    }
});

module.exports = router;
