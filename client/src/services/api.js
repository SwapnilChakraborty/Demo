const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Fetch menu items
export const getMenuItems = async () => {
    const response = await fetch(`${API_URL}/menu`);
    if (!response.ok) throw new Error('Failed to fetch menu');
    const data = await response.json();
    return data.data;
};

// Create Razorpay order
export const createPaymentOrder = async (amount, items) => {
    const response = await fetch(`${API_URL}/payment/create-order`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amount, items })
    });

    if (!response.ok) throw new Error('Failed to create payment order');
    const data = await response.json();
    return data.data;
};

// Verify payment
export const verifyPayment = async (paymentData) => {
    const response = await fetch(`${API_URL}/payment/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData)
    });
    if (!response.ok) throw new Error('Payment verification failed');
    const data = await response.json();
    return data.data;
};

// Demo order (no Razorpay needed)
export const demoOrder = async (items, totalAmount) => {
    const response = await fetch(`${API_URL}/payment/demo-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, totalAmount })
    });
    if (!response.ok) throw new Error('Failed to create demo order');
    const data = await response.json();
    return data.data;
};

// Fetch all orders
export const getOrders = async () => {
    const response = await fetch(`${API_URL}/orders`);
    if (!response.ok) throw new Error('Failed to fetch orders');
    const data = await response.json();
    return data.data;
};

// Get order statistics
export const getOrderStats = async () => {
    const response = await fetch(`${API_URL}/orders/stats`);
    if (!response.ok) throw new Error('Failed to fetch stats');
    const data = await response.json();
    return data.data;
};

// Update order status
export const updateOrderStatus = async (orderId, status) => {
    const response = await fetch(`${API_URL}/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
    });

    if (!response.ok) throw new Error('Failed to update order status');
    const data = await response.json();
    return data.data;
};
