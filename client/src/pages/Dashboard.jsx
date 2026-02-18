import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Clock, IndianRupee, RefreshCw, LogOut, History } from 'lucide-react';
import { getOrders, getOrderStats, updateOrderStatus } from '../services/api';
import { formatCurrency, playNotificationSound } from '../utils/helpers';
import OrderCard from '../components/OrderCard';

const MAX_DONE_VISIBLE = 10; // Show only last 10 completed orders on dashboard

function Dashboard() {
    const [orders, setOrders] = useState([]);
    const [stats, setStats] = useState({ totalRevenue: 0, pendingOrders: 0, totalOrders: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const previousOrderCountRef = useRef(0);
    const navigate = useNavigate();

    const handleLogout = () => {
        sessionStorage.removeItem('ownerAuth');
        navigate('/owner-login');
    };

    const fetchData = useCallback(async (isAutoRefresh = false) => {
        try {
            const [ordersData, statsData] = await Promise.all([
                getOrders(),
                getOrderStats()
            ]);

            if (isAutoRefresh && ordersData.length > previousOrderCountRef.current) {
                const newCount = ordersData.length - previousOrderCountRef.current;
                const hasNew = ordersData.slice(0, newCount).some(o => o.orderStatus === 'New');
                if (hasNew) playNotificationSound();
            }

            previousOrderCountRef.current = ordersData.length;
            setOrders(ordersData);
            setStats(statsData);
            setError(null);
        } catch (err) {
            console.error('Dashboard fetch error:', err);
            if (!isAutoRefresh) setError('Failed to load dashboard. Is the server running?');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchData(false);
        const interval = setInterval(() => fetchData(true), 5000);
        return () => clearInterval(interval);
    }, [fetchData]);

    const handleManualRefresh = async () => {
        if (refreshing) return;
        setRefreshing(true);
        await fetchData(false);
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            await updateOrderStatus(orderId, newStatus);
            setOrders(prev =>
                prev.map(o => o._id === orderId ? { ...o, orderStatus: newStatus } : o)
            );
            fetchData(true);
        } catch {
            alert('Failed to update order status. Please try again.');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F7F5F2] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 rounded-full animate-spin mx-auto mb-4"
                        style={{ border: '3px solid #FFE0CC', borderTopColor: '#FF6B2C' }} />
                    <p className="text-[#8A8A8A] text-sm">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#F7F5F2] flex items-center justify-center p-6">
                <div className="text-center">
                    <div className="text-4xl mb-3">⚠️</div>
                    <p className="font-semibold text-[#1A1A1A] mb-1">Couldn't load dashboard</p>
                    <p className="text-sm text-[#8A8A8A] mb-5">{error}</p>
                    <button onClick={() => { setLoading(true); fetchData(false); }} className="btn-brand">Retry</button>
                </div>
            </div>
        );
    }

    const newOrders = orders.filter(o => o.orderStatus === 'New');
    const preparingOrders = orders.filter(o => o.orderStatus === 'Preparing');
    const allDoneOrders = orders.filter(o => o.orderStatus === 'Done');
    // Only show last MAX_DONE_VISIBLE completed orders on dashboard
    const visibleDoneOrders = allDoneOrders.slice(0, MAX_DONE_VISIBLE);
    const hiddenDoneCount = allDoneOrders.length - visibleDoneOrders.length;

    const activeCount = newOrders.length + preparingOrders.length;

    return (
        <div className="min-h-screen bg-[#F7F5F2] pb-10">

            {/* Header */}
            <div className="bg-white border-b border-[#EBEBEB] sticky top-0 z-10">
                <div className="px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#FFF0E8] rounded-2xl flex items-center justify-center">
                            <span className="text-xl">🍳</span>
                        </div>
                        <div>
                            <h1 className="font-bold text-[#1A1A1A] text-lg leading-tight">Owner Dashboard</h1>
                            <p className="text-xs text-[#8A8A8A]">Fresh Egg Roll Corner</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5 text-xs text-[#8A8A8A]">
                            <span className="w-2 h-2 bg-green-500 rounded-full pulse-dot" />
                            Live
                        </div>
                        <button
                            onClick={() => navigate('/history')}
                            className="w-10 h-10 rounded-xl bg-[#F0F0F0] flex items-center justify-center hover:bg-[#FFF0E8] transition-colors"
                            title="Order History"
                        >
                            <History className="w-4 h-4 text-[#8A8A8A]" />
                        </button>
                        <button
                            onClick={handleLogout}
                            className="w-10 h-10 rounded-xl bg-[#F0F0F0] flex items-center justify-center hover:bg-red-50 transition-colors"
                            title="Logout"
                        >
                            <LogOut className="w-4 h-4 text-[#8A8A8A]" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="px-4 py-5 space-y-5">

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3">
                    <div className="card p-4 text-center">
                        <div className="w-8 h-8 bg-[#FFF0E8] rounded-xl flex items-center justify-center mx-auto mb-2">
                            <TrendingUp className="w-4 h-4 text-[#FF6B2C]" />
                        </div>
                        <p className="text-2xl font-bold text-[#1A1A1A]">{stats.totalOrders}</p>
                        <p className="text-[10px] text-[#8A8A8A] mt-0.5 font-medium">Today's Orders</p>
                    </div>
                    <div className="card p-4 text-center">
                        <div className="w-8 h-8 bg-yellow-50 rounded-xl flex items-center justify-center mx-auto mb-2">
                            <Clock className="w-4 h-4 text-yellow-500" />
                        </div>
                        <p className="text-2xl font-bold text-[#1A1A1A]">{activeCount}</p>
                        <p className="text-[10px] text-[#8A8A8A] mt-0.5 font-medium">Active</p>
                    </div>
                    <div className="card p-4 text-center">
                        <div className="w-8 h-8 bg-green-50 rounded-xl flex items-center justify-center mx-auto mb-2">
                            <IndianRupee className="w-4 h-4 text-green-600" />
                        </div>
                        <p className="text-xl font-bold text-[#1A1A1A]">{formatCurrency(stats.totalRevenue)}</p>
                        <p className="text-[10px] text-[#8A8A8A] mt-0.5 font-medium">Revenue</p>
                    </div>
                </div>

                {/* Section header */}
                <div className="flex items-center justify-between">
                    <h2 className="font-bold text-[#1A1A1A]">
                        Active Orders
                        {activeCount > 0 && (
                            <span className="ml-2 text-xs font-normal text-[#8A8A8A]">({activeCount})</span>
                        )}
                    </h2>
                    <button
                        onClick={handleManualRefresh}
                        disabled={refreshing}
                        className="flex items-center gap-1.5 text-xs text-[#8A8A8A] hover:text-[#FF6B2C] transition-colors disabled:opacity-50 px-3 py-1.5 rounded-xl hover:bg-[#FFF0E8]"
                    >
                        <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
                        {refreshing ? 'Refreshing...' : 'Refresh'}
                    </button>
                </div>

                {/* No active orders */}
                {newOrders.length === 0 && preparingOrders.length === 0 && (
                    <div className="card p-8 text-center">
                        <div className="text-4xl mb-3">✅</div>
                        <p className="font-semibold text-[#1A1A1A]">All caught up!</p>
                        <p className="text-sm text-[#8A8A8A] mt-1">No active orders right now</p>
                    </div>
                )}

                {/* New Orders */}
                {newOrders.length > 0 && (
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="w-2 h-2 bg-[#FF6B2C] rounded-full pulse-dot" />
                            <h3 className="text-sm font-semibold text-[#FF6B2C]">New Orders ({newOrders.length})</h3>
                        </div>
                        <div className="space-y-3">
                            {newOrders.map(order => (
                                <OrderCard key={order._id} order={order} onStatusUpdate={handleStatusUpdate} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Preparing */}
                {preparingOrders.length > 0 && (
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="w-2 h-2 bg-yellow-500 rounded-full" />
                            <h3 className="text-sm font-semibold text-yellow-600">Preparing ({preparingOrders.length})</h3>
                        </div>
                        <div className="space-y-3">
                            {preparingOrders.map(order => (
                                <OrderCard key={order._id} order={order} onStatusUpdate={handleStatusUpdate} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Recently Completed (max 10) */}
                {visibleDoneOrders.length > 0 && (
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-green-500 rounded-full" />
                                <h3 className="text-sm font-semibold text-green-600">
                                    Recently Completed ({visibleDoneOrders.length})
                                </h3>
                            </div>
                        </div>
                        <div className="space-y-3">
                            {visibleDoneOrders.map(order => (
                                <OrderCard key={order._id} order={order} onStatusUpdate={handleStatusUpdate} />
                            ))}
                        </div>
                    </div>
                )}

                {/* "X more in history" banner */}
                {hiddenDoneCount > 0 && (
                    <button
                        onClick={() => navigate('/history')}
                        className="w-full card p-4 flex items-center justify-between hover:border-[#FF6B2C]/30 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-[#FFF0E8] rounded-xl flex items-center justify-center">
                                <History className="w-4 h-4 text-[#FF6B2C]" />
                            </div>
                            <div className="text-left">
                                <p className="text-sm font-semibold text-[#1A1A1A]">
                                    +{hiddenDoneCount} more completed orders
                                </p>
                                <p className="text-xs text-[#8A8A8A]">View full history & analytics</p>
                            </div>
                        </div>
                        <span className="text-[#FF6B2C] text-sm font-semibold">View →</span>
                    </button>
                )}

                {/* History shortcut (always visible at bottom) */}
                <button
                    onClick={() => navigate('/history')}
                    className="w-full flex items-center justify-center gap-2 py-3 text-sm text-[#8A8A8A] hover:text-[#FF6B2C] transition-colors"
                >
                    <History className="w-4 h-4" />
                    View Full History & Analytics
                </button>
            </div>
        </div>
    );
}

export default Dashboard;
