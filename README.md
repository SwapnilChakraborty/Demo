# 🍳 Fresh Egg Roll Corner - Full-Stack Web Application

A production-ready ordering system for street food businesses with customer ordering, Razorpay payment integration, and live owner dashboard.

## ✨ Features

### Customer Features
- **Mobile-First Menu** - Clean, responsive menu display
- **Smart Cart System** - Add/remove items with quantity controls
- **Sticky Cart Bar** - Always visible cart with total price
- **Razorpay Payment** - Secure payment processing
- **Order Confirmation** - Success page with order ID

### Owner Dashboard Features
- **Live Order Updates** - Auto-refresh every 5 seconds
- **Order Management** - Update status (New → Preparing → Done)
- **New Order Alerts** - Visual highlight + notification sound
- **Daily Statistics** - Revenue and pending orders count
- **Large Card Display** - Easy-to-read order details

## 🛠️ Tech Stack

**Frontend:**
- React 18 with Vite
- React Router for navigation
- Tailwind CSS for styling
- Razorpay Checkout

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- Razorpay Payment Gateway
- CORS enabled

## 📁 Project Structure

```
fresh-egg-roll-corner/
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   │   └── OrderCard.jsx
│   │   ├── pages/             # Page components
│   │   │   ├── Menu.jsx       # Customer menu page
│   │   │   ├── Dashboard.jsx  # Owner dashboard
│   │   │   └── PaymentSuccess.jsx
│   │   ├── services/
│   │   │   └── api.js         # API calls
│   │   ├── utils/
│   │   │   └── helpers.js     # Utility functions
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── .env
├── server/                    # Express backend
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── models/
│   │   └── Order.js           # Order schema
│   ├── routes/
│   │   ├── menu.js            # Menu endpoints
│   │   ├── payment.js         # Payment endpoints
│   │   └── orders.js          # Order management
│   ├── server.js              # Main server file
│   ├── package.json
│   └── .env
└── README.md
```

## 🚀 Local Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas account)
- Razorpay account (for payment integration)

### 1. Clone or Navigate to Project

```bash
cd e:\startup
```

### 2. Backend Setup

```bash
cd server

# Install dependencies (already done if following setup)
npm install

# Create .env file
copy .env.example .env
```

**Configure `server/.env`:**
```env
PORT=5000
MONGODB_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/eggroll?retryWrites=true&w=majority
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

**Get MongoDB URI:**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free cluster
3. Get connection string
4. Replace `<password>` and database name

**Get Razorpay Keys:**
1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Navigate to Settings → API Keys
3. Generate Test Keys
4. Copy Key ID and Key Secret

### 3. Frontend Setup

```bash
cd ../client

# Install dependencies (already done if following setup)
npm install

# Create .env file
copy .env.example .env
```

**Configure `client/.env`:**
```env
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
```

> **Note:** Use the same Razorpay Key ID in both frontend and backend

### 4. Run Application

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```
Server runs on: `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```
Frontend runs on: `http://localhost:5173`

## 📱 Using the Application

### Customer Flow
1. Open `http://localhost:5173`
2. Browse menu items
3. Click **Add +** to add items to cart
4. Use **+/-** buttons to adjust quantities
5. Click **Proceed to Pay** in bottom cart bar
6. Complete payment using Razorpay test cards
7. View success confirmation with Order ID

**Test Card Details:**
- Card: `4111 1111 1111 1111`
- Expiry: Any future date
- CVV: Any 3 digits

### Owner Dashboard
1. Open `http://localhost:5173/dashboard`
2. View all orders with status
3. New orders appear at top with **red border**
4. Click **Mark as Preparing** → **Mark as Done**
5. View statistics (revenue, pending orders)
6. Dashboard auto-refreshes every 5 seconds

## 🌐 Deployment

### Frontend (Vercel)

1. **Push code to GitHub** (if not already)
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin your-repo-url
git push -u origin main
```

2. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Set **Root Directory**: `client`
   - Add Environment Variables:
     - `VITE_API_URL` = your backend URL
     - `VITE_RAZORPAY_KEY_ID` = your Razorpay key
   - Deploy

### Backend (Render / Railway)

**Option 1: Render**
1. Go to [render.com](https://render.com)
2. Create new **Web Service**
3. Connect GitHub repository
4. **Root Directory**: `server`
5. **Build Command**: `npm install`
6. **Start Command**: `npm start`
7. Add Environment Variables (from `.env`)
8. Deploy

**Option 2: Railway**
1. Go to [railway.app](https://railway.app)
2. Create new project from GitHub
3. Set **Root Directory**: `server`
4. Add Environment Variables
5. Deploy

> **Important:** After deploying backend, update `VITE_API_URL` in Vercel to point to your deployed backend URL

## 📝 API Documentation

### Menu Endpoints

**GET `/api/menu`**
- Returns list of menu items
- Response: `{ success: true, data: [...items] }`

### Payment Endpoints

**POST `/api/payment/create-order`**
- Creates Razorpay order
- Body: `{ amount: Number, items: Array }`
- Response: `{ success: true, data: { orderId, amount, currency } }`

**POST `/api/payment/verify`**
- Verifies payment and creates order
- Body: `{ razorpay_order_id, razorpay_payment_id, razorpay_signature, items, totalAmount }`
- Response: `{ success: true, data: { orderId, orderStatus, timestamp } }`

### Order Endpoints

**GET `/api/orders`**
- Get all orders (sorted by newest first)
- Response: `{ success: true, data: [...orders] }`

**GET `/api/orders/stats`**
- Get today's statistics
- Response: `{ success: true, data: { totalRevenue, pendingOrders, totalOrders } }`

**PATCH `/api/orders/:id/status`**
- Update order status
- Body: `{ status: 'New' | 'Preparing' | 'Done' }`
- Response: `{ success: true, data: updatedOrder }`

## 🎨 Customization

### Adding Menu Items
Edit `server/routes/menu.js`:
```javascript
const menuItems = [
  { id: 1, name: 'Egg Roll', price: 40 },
  { id: 2, name: 'Double Egg Roll', price: 60 },
  // Add more items...
];
```

### Changing Colors
Edit `client/tailwind.config.js`:
```javascript
colors: {
  primary: '#FF6B35',    // Main brand color
  secondary: '#F7931E',  // Secondary color
  dark: '#1a1a2e',       // Text color
  light: '#f5f5f5'       // Background color
}
```

### Auto-Refresh Interval
Edit `client/src/pages/Dashboard.jsx`:
```javascript
const interval = setInterval(() => {
  fetchData(true);
}, 5000); // Change 5000 to desired milliseconds
```

## 🐛 Troubleshooting

**Payment not working:**
- Verify Razorpay keys in both `.env` files
- Check browser console for errors
- Ensure backend is running

**Orders not appearing:**
- Check MongoDB connection
- Verify backend API is accessible
- Check browser network tab for errors

**Dashboard not updating:**
- Ensure backend is running
- Check auto-refresh is working (green dot animation)
- Verify CORS settings in `server/server.js`

## 📄 License

MIT License - feel free to use this for your business!

## 🤝 Support

For issues or questions, check the code comments or API endpoints.

---

**Built with ❤️ for small business owners**
