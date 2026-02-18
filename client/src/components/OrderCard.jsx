import { formatCurrency, formatTime } from '../utils/helpers';
import { Clock, CheckCircle2, ChefHat } from 'lucide-react';

function OrderCard({ order, onStatusUpdate }) {
    const isNew = order.orderStatus === 'New';
    const isPreparing = order.orderStatus === 'Preparing';
    const isDone = order.orderStatus === 'Done';

    const statusConfig = {
        New: { label: 'New Order', color: 'text-[#FF6B2C]', bg: 'bg-[#FFF0E8]', dot: 'bg-[#FF6B2C]' },
        Preparing: { label: 'Preparing', color: 'text-yellow-600', bg: 'bg-yellow-50', dot: 'bg-yellow-500' },
        Done: { label: 'Completed', color: 'text-green-600', bg: 'bg-green-50', dot: 'bg-green-500' },
    };
    const status = statusConfig[order.orderStatus] || statusConfig.New;

    return (
        <div className={`card p-5 transition-all ${isNew ? 'ring-2 ring-[#FF6B2C]/30' : ''}`}>
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div>
                    <p className="text-xs text-[#8A8A8A] font-medium mb-0.5">Order</p>
                    <h3 className="font-bold text-[#1A1A1A] text-lg leading-tight">{order.orderId}</h3>
                    <div className="flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3 text-[#C0C0C0]" />
                        <p className="text-xs text-[#8A8A8A]">{formatTime(order.timestamp)}</p>
                    </div>
                </div>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${status.bg} ${status.color}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${status.dot} ${isNew ? 'pulse-dot' : ''}`} />
                    {status.label}
                </span>
            </div>

            {/* Items */}
            <div className="bg-[#F7F5F2] rounded-2xl p-4 mb-4 space-y-2">
                {order.items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between">
                        <span className="text-sm text-[#1A1A1A]">
                            <span className="font-semibold">{item.quantity}×</span> {item.name}
                        </span>
                        <span className="text-sm font-semibold text-[#1A1A1A]">
                            {formatCurrency(item.price * item.quantity)}
                        </span>
                    </div>
                ))}
            </div>

            {/* Total */}
            <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-[#8A8A8A]">Total Paid</span>
                <span className="font-bold text-[#FF6B2C] text-lg">{formatCurrency(order.totalAmount)}</span>
            </div>

            {/* Actions */}
            {isNew && (
                <button
                    onClick={() => onStatusUpdate(order._id, 'Preparing')}
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 rounded-2xl transition-colors flex items-center justify-center gap-2 text-sm"
                >
                    <ChefHat className="w-4 h-4" />
                    Start Preparing
                </button>
            )}
            {isPreparing && (
                <button
                    onClick={() => onStatusUpdate(order._id, 'Done')}
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-2xl transition-colors flex items-center justify-center gap-2 text-sm"
                >
                    <CheckCircle2 className="w-4 h-4" />
                    Mark as Done
                </button>
            )}
            {isDone && (
                <div className="w-full bg-green-50 text-green-600 font-semibold py-3 rounded-2xl text-center text-sm flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Order Completed
                </div>
            )}
        </div>
    );
}

export default OrderCard;
