const admin = require('firebase-admin');

// Firestore reference
let db;

const setDb = (database) => {
    db = database;
};

const getDb = () => {
    if (!db) {
        throw new Error('Firestore not initialized');
    }
    return db;
};

// Get next order ID (auto-increment)
const getNextOrderId = async () => {
    const counterRef = db.collection('counters').doc('orderId');

    try {
        const result = await db.runTransaction(async (transaction) => {
            const doc = await transaction.get(counterRef);

            let newCount = 1;
            if (doc.exists) {
                newCount = (doc.data().count || 0) + 1;
            }

            transaction.set(counterRef, { count: newCount });
            return newCount;
        });

        return `ER-${String(result).padStart(3, '0')}`;
    } catch (error) {
        console.error('Error getting next order ID:', error);
        throw error;
    }
};

// Create new order
const createOrder = async (orderData) => {
    const orderId = await getNextOrderId();

    const order = {
        orderId,
        items: orderData.items,
        totalAmount: orderData.totalAmount,
        razorpayOrderId: orderData.razorpayOrderId,
        razorpayPaymentId: orderData.razorpayPaymentId || '',
        razorpaySignature: orderData.razorpaySignature || '',
        paymentStatus: orderData.paymentStatus || 'Pending',
        orderStatus: orderData.orderStatus || 'New',
        timestamp: admin.firestore.FieldValue.serverTimestamp()
    };

    const docRef = await db.collection('orders').add(order);

    // Get the created document
    const doc = await docRef.get();
    return {
        id: docRef.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date()
    };
};

// Get all orders
const getAllOrders = async () => {
    const snapshot = await db.collection('orders')
        .orderBy('timestamp', 'desc')
        .get();

    return snapshot.docs.map(doc => ({
        _id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date()
    }));
};

// Get orders by filter
const getOrdersByFilter = async (filter) => {
    let query = db.collection('orders');

    Object.entries(filter).forEach(([key, value]) => {
        query = query.where(key, '==', value);
    });

    const snapshot = await query.get();

    return snapshot.docs.map(doc => ({
        _id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date()
    }));
};

// Update order status
const updateOrderStatus = async (orderId, status) => {
    const orderRef = db.collection('orders').doc(orderId);

    await orderRef.update({
        orderStatus: status
    });

    const doc = await orderRef.get();

    if (!doc.exists) {
        throw new Error('Order not found');
    }

    return {
        _id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date()
    };
};

module.exports = {
    setDb,
    getDb,
    createOrder,
    getAllOrders,
    getOrdersByFilter,
    updateOrderStatus
};
