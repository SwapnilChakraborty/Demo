import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Home } from 'lucide-react';

function PaymentSuccess() {
    const location = useLocation();
    const navigate = useNavigate();
    const orderId = location.state?.orderId;

    useEffect(() => {
        if (!orderId) navigate('/');
    }, [orderId, navigate]);

    return (
        <div className="min-h-screen bg-[#F7F5F2] flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-sm animate-fade-in-up">

                {/* Success Icon */}
                <div className="flex justify-center mb-6">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-14 h-14 text-green-500" strokeWidth={2} />
                    </div>
                </div>

                {/* Message */}
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-[#1A1A1A] mb-2">Order Placed! 🎉</h1>
                    <p className="text-[#8A8A8A] text-sm">Your food is being prepared with love</p>
                </div>

                {/* Order ID card */}
                <div className="card p-5 mb-6">
                    <p className="text-xs font-semibold text-[#8A8A8A] uppercase tracking-wide mb-1">Order ID</p>
                    <p className="font-bold text-[#FF6B2C] text-lg break-all">{orderId}</p>

                    <div className="mt-4 pt-4 border-t border-[#EBEBEB] space-y-2">
                        <div className="flex items-center gap-2 text-sm text-[#1A1A1A]">
                            <span className="text-base">🍳</span>
                            <span>Your order is being prepared</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-[#8A8A8A]">
                            <span className="text-base">⏱️</span>
                            <span>Estimated time: 15–20 minutes</span>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                    <button
                        onClick={() => navigate('/')}
                        className="btn-brand w-full py-4 rounded-2xl text-base"
                    >
                        <Home className="w-5 h-5" />
                        Order More
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PaymentSuccess;
