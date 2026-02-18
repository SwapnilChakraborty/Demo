import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, IndianRupee, ShoppingBag, Star, Clock, Calendar } from 'lucide-react';
import { getOrders } from '../services/api';
import { formatCurrency, formatTime } from '../utils/helpers';

// ── Helpers ──────────────────────────────────────────────────────────────────

function getHourLabel(h) {
    if (h === 0) return '12am';
    if (h < 12) return `${h}am`;
    if (h === 12) return '12pm';
    return `${h - 12}pm`;
}

function getDayLabel(d) {
    return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d];
}

// ── Mini bar chart ────────────────────────────────────────────────────────────

function BarChart({ data, labelKey, valueKey, color = '#FF6B2C', formatValue = v => v }) {
    const max = Math.max(...data.map(d => d[valueKey]), 1);
    return (
        <div className="flex items-end gap-1.5 h-24">
            {data.map((item, i) => {
                const pct = (item[valueKey] / max) * 100;
                return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div className="w-full flex flex-col justify-end" style={{ height: '72px' }}>
                            <div
                                className="w-full rounded-t-lg transition-all duration-500"
                                style={{
                                    height: `${Math.max(pct, item[valueKey] > 0 ? 8 : 0)}%`,
                                    backgroundColor: pct === 100 ? color : `${color}66`,
                                    minHeight: item[valueKey] > 0 ? '4px' : '0'
                                }}
                            />
                        </div>
                        <span className="text-[9px] text-[#8A8A8A] font-medium">{item[labelKey]}</span>
                    </div>
                );
            })}
        </div>
    );
}

// ── Main Component ────────────────────────────────────────────────────────────

function OrderHistory() {
    const [allOrders, setAllOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // 'all' | 'today' | 'week'
    const navigate = useNavigate();

    const fetchOrders = useCallback(async () => {
        try {
            const data = await getOrders();
            setAllOrders(data);
        } catch (err) {
            console.error('History fetch error:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchOrders(); }, [fetchOrders]);

    // ── Filter orders ──
    const now = new Date();
    const startOfToday = new Date(now); startOfToday.setHours(0, 0, 0, 0);
    const startOfWeek = new Date(now); startOfWeek.setDate(now.getDate() - 6); startOfWeek.setHours(0, 0, 0, 0);

    const filteredOrders = allOrders.filter(o => {
        const d = new Date(o.timestamp);
        if (filter === 'today') return d >= startOfToday;
        if (filter === 'week') return d >= startOfWeek;
        return true;
    });

    const paidOrders = filteredOrders.filter(o => o.paymentStatus === 'Paid');
    const doneOrders = filteredOrders.filter(o => o.orderStatus === 'Done');

    // ── Analytics ──
    const totalRevenue = paidOrders.reduce((s, o) => s + o.totalAmount, 0);
    const totalOrders = paidOrders.length;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const completionRate = totalOrders > 0 ? Math.round((doneOrders.length / totalOrders) * 100) : 0;

    // Popular items
    const itemMap = {};
    paidOrders.forEach(order => {
        order.items.forEach(item => {
            if (!itemMap[item.name]) itemMap[item.name] = { name: item.name, qty: 0, revenue: 0 };
            itemMap[item.name].qty += item.quantity;
            itemMap[item.name].revenue += item.price * item.quantity;
        });
    });
    const popularItems = Object.values(itemMap).sort((a, b) => b.qty - a.qty).slice(0, 5);

    // Hourly distribution (0–23)
    const hourlyData = Array.from({ length: 24 }, (_, h) => ({ hour: h, label: getHourLabel(h), count: 0 }));
    paidOrders.forEach(o => {
        const h = new Date(o.timestamp).getHours();
        hourlyData[h].count++;
    });
    // Show only 6am–11pm for cleaner chart
    const chartHours = hourlyData.filter(h => h.hour >= 6 && h.hour <= 23);

    // Daily distribution (last 7 days)
    const dailyMap = {};
    for (let i = 6; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(now.getDate() - i);
        const key = d.toDateString();
        dailyMap[key] = { label: i === 0 ? 'Today' : getDayLabel(d.getDay()), count: 0, revenue: 0 };
    }
    paidOrders.forEach(o => {
        const key = new Date(o.timestamp).toDateString();
        if (dailyMap[key]) {
            dailyMap[key].count++;
            dailyMap[key].revenue += o.totalAmount;
        }
    });
    const dailyData = Object.values(dailyMap);

    // Peak hour
    const peakHour = hourlyData.reduce((best, h) => h.count > best.count ? h : best, hourlyData[0]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F7F5F2] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 rounded-full animate-spin mx-auto mb-4"
                        style={{ border: '3px solid #FFE0CC', borderTopColor: '#FF6B2C' }} />
                    <p className="text-[#8A8A8A] text-sm">Loading history...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F7F5F2] pb-10">

            {/* Header */}
            <div className="bg-white border-b border-[#EBEBEB] sticky top-0 z-10">
                <div className="px-4 py-4 flex items-center gap-3">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="w-10 h-10 rounded-xl bg-[#F0F0F0] flex items-center justify-center"
                    >
                        <ArrowLeft className="w-5 h-5 text-[#1A1A1A]" />
                    </button>
                    <div>
                        <h1 className="font-bold text-[#1A1A1A] text-lg leading-tight">History & Analytics</h1>
                        <p className="text-xs text-[#8A8A8A]">{allOrders.length} total orders</p>
                    </div>
                </div>

                {/* Filter tabs */}
                <div className="flex px-4 pb-3 gap-2">
                    {[
                        { id: 'today', label: 'Today' },
                        { id: 'week', label: 'Last 7 Days' },
                        { id: 'all', label: 'All Time' },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setFilter(tab.id)}
                            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${filter === tab.id
                                    ? 'bg-[#FF6B2C] text-white'
                                    : 'bg-[#F0F0F0] text-[#8A8A8A] hover:bg-[#EBEBEB]'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="px-4 py-5 space-y-5">

                {/* ── KPI Cards ── */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="card p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-7 h-7 bg-[#FFF0E8] rounded-lg flex items-center justify-center">
                                <IndianRupee className="w-3.5 h-3.5 text-[#FF6B2C]" />
                            </div>
                            <span className="text-xs text-[#8A8A8A] font-medium">Revenue</span>
                        </div>
                        <p className="text-xl font-bold text-[#1A1A1A]">{formatCurrency(totalRevenue)}</p>
                    </div>
                    <div className="card p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center">
                                <ShoppingBag className="w-3.5 h-3.5 text-blue-500" />
                            </div>
                            <span className="text-xs text-[#8A8A8A] font-medium">Orders</span>
                        </div>
                        <p className="text-xl font-bold text-[#1A1A1A]">{totalOrders}</p>
                    </div>
                    <div className="card p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-7 h-7 bg-purple-50 rounded-lg flex items-center justify-center">
                                <TrendingUp className="w-3.5 h-3.5 text-purple-500" />
                            </div>
                            <span className="text-xs text-[#8A8A8A] font-medium">Avg Order</span>
                        </div>
                        <p className="text-xl font-bold text-[#1A1A1A]">{formatCurrency(avgOrderValue)}</p>
                    </div>
                    <div className="card p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-7 h-7 bg-green-50 rounded-lg flex items-center justify-center">
                                <Star className="w-3.5 h-3.5 text-green-500" />
                            </div>
                            <span className="text-xs text-[#8A8A8A] font-medium">Completion</span>
                        </div>
                        <p className="text-xl font-bold text-[#1A1A1A]">{completionRate}%</p>
                    </div>
                </div>

                {/* ── Daily Revenue Chart ── */}
                {filter !== 'today' && (
                    <div className="card p-5">
                        <div className="flex items-center gap-2 mb-4">
                            <Calendar className="w-4 h-4 text-[#FF6B2C]" />
                            <h3 className="font-bold text-[#1A1A1A] text-sm">Orders — Last 7 Days</h3>
                        </div>
                        <BarChart data={dailyData} labelKey="label" valueKey="count" color="#FF6B2C" />
                    </div>
                )}

                {/* ── Hourly Chart ── */}
                <div className="card p-5">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-[#FF6B2C]" />
                            <h3 className="font-bold text-[#1A1A1A] text-sm">Busiest Hours</h3>
                        </div>
                        {peakHour.count > 0 && (
                            <span className="text-xs bg-[#FFF0E8] text-[#FF6B2C] font-semibold px-2 py-1 rounded-full">
                                Peak: {getHourLabel(peakHour.hour)}
                            </span>
                        )}
                    </div>
                    <BarChart data={chartHours} labelKey="label" valueKey="count" color="#FF6B2C" />
                </div>

                {/* ── Popular Items ── */}
                {popularItems.length > 0 && (
                    <div className="card p-5">
                        <div className="flex items-center gap-2 mb-4">
                            <Star className="w-4 h-4 text-[#FF6B2C]" />
                            <h3 className="font-bold text-[#1A1A1A] text-sm">Top Items</h3>
                        </div>
                        <div className="space-y-3">
                            {popularItems.map((item, i) => {
                                const maxQty = popularItems[0].qty;
                                const pct = (item.qty / maxQty) * 100;
                                return (
                                    <div key={i}>
                                        <div className="flex items-center justify-between mb-1">
                                            <div className="flex items-center gap-2">
                                                <span className={`text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center ${i === 0 ? 'bg-[#FF6B2C] text-white' : 'bg-[#F0F0F0] text-[#8A8A8A]'
                                                    }`}>
                                                    {i + 1}
                                                </span>
                                                <span className="text-sm font-medium text-[#1A1A1A]">{item.name}</span>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-xs font-bold text-[#1A1A1A]">{item.qty} sold</span>
                                                <span className="text-xs text-[#8A8A8A] ml-2">{formatCurrency(item.revenue)}</span>
                                            </div>
                                        </div>
                                        <div className="h-1.5 bg-[#F0F0F0] rounded-full overflow-hidden">
                                            <div
                                                className="h-full rounded-full transition-all duration-700"
                                                style={{
                                                    width: `${pct}%`,
                                                    backgroundColor: i === 0 ? '#FF6B2C' : '#FFB899'
                                                }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* ── Order History List ── */}
                <div>
                    <h3 className="font-bold text-[#1A1A1A] mb-3">
                        Order History
                        <span className="ml-2 text-xs font-normal text-[#8A8A8A]">({filteredOrders.length})</span>
                    </h3>

                    {filteredOrders.length === 0 ? (
                        <div className="card p-10 text-center">
                            <div className="text-4xl mb-3">📭</div>
                            <p className="font-semibold text-[#1A1A1A]">No orders found</p>
                            <p className="text-sm text-[#8A8A8A] mt-1">Try changing the filter above</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filteredOrders.map(order => {
                                const statusColor = {
                                    New: 'text-[#FF6B2C] bg-[#FFF0E8]',
                                    Preparing: 'text-yellow-600 bg-yellow-50',
                                    Done: 'text-green-600 bg-green-50',
                                }[order.orderStatus] || 'text-[#8A8A8A] bg-[#F0F0F0]';

                                return (
                                    <div key={order._id} className="card p-4">
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <p className="font-bold text-[#1A1A1A] text-sm">{order.orderId}</p>
                                                <p className="text-xs text-[#8A8A8A] mt-0.5">{formatTime(order.timestamp)}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColor}`}>
                                                    {order.orderStatus}
                                                </span>
                                                <span className="font-bold text-[#FF6B2C] text-sm">
                                                    {formatCurrency(order.totalAmount)}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap gap-1.5">
                                            {order.items.map((item, i) => (
                                                <span key={i} className="text-xs bg-[#F7F5F2] text-[#8A8A8A] px-2 py-0.5 rounded-full">
                                                    {item.quantity}× {item.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default OrderHistory;
