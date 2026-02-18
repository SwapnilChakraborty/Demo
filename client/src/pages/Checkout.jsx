import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Package, CheckCircle2, Smartphone, Banknote, Wallet } from 'lucide-react';
import { demoOrder } from '../services/api';
import { formatCurrency } from '../utils/helpers';

const PAYMENT_METHODS = [
    { id: 'upi', label: 'UPI / GPay / PhonePe', icon: Smartphone, desc: 'Pay using any UPI app' },
    { id: 'cash', label: 'Cash on Delivery', icon: Banknote, desc: 'Pay when you receive' },
    { id: 'card', label: 'Credit / Debit Card', icon: Wallet, desc: 'Visa, Mastercard, RuPay' },
];

function Checkout() {
    const navigate = useNavigate();
    const location = useLocation();
    const { cartItems, totalAmount } = location.state || {};

    const [step, setStep] = useState('details'); // 'details' | 'payment' | 'processing'
    const [customerInfo, setCustomerInfo] = useState({ name: '', phone: '', email: '' });
    const [selectedMethod, setSelectedMethod] = useState('upi');
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        if (!cartItems || cartItems.length === 0) navigate('/');
    }, [cartItems, navigate]);

    const handleInputChange = (e) => {
        setCustomerInfo({ ...customerInfo, [e.target.name]: e.target.value });
    };

    const handleDetailsSubmit = (e) => {
        e.preventDefault();
        setStep('payment');
    };

    const handleConfirmPayment = async () => {
        setProcessing(true);
        setStep('processing');

        try {
            // Small delay to simulate payment processing
            await new Promise(res => setTimeout(res, 1800));

            // Save order to Firebase via demo endpoint
            const result = await demoOrder(cartItems, totalAmount);

            navigate('/success', { state: { orderId: result.orderId } });
        } catch (err) {
            alert('Something went wrong. Please try again.');
            setProcessing(false);
            setStep('payment');
        }
    };

    if (!cartItems || cartItems.length === 0) return null;

    // ── Processing screen ──
    if (step === 'processing') {
        return (
            <div className="min-h-screen bg-[#F7F5F2] flex flex-col items-center justify-center p-6">
                <div className="text-center animate-fade-in-up">
                    <div className="w-20 h-20 bg-[#FFF0E8] rounded-full flex items-center justify-center mx-auto mb-5">
                        <div className="w-10 h-10 border-4 border-[#FF6B2C]/30 border-t-[#FF6B2C] rounded-full animate-spin" />
                    </div>
                    <h2 className="text-xl font-bold text-[#1A1A1A] mb-2">Processing Payment</h2>
                    <p className="text-sm text-[#8A8A8A]">Please wait while we confirm your order...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F7F5F2]">

            {/* Header */}
            <div className="bg-white border-b border-[#EBEBEB] sticky top-0 z-10">
                <div className="px-4 py-4 flex items-center gap-3">
                    <button
                        onClick={() => step === 'payment' ? setStep('details') : navigate('/')}
                        className="w-10 h-10 rounded-xl bg-[#F0F0F0] flex items-center justify-center"
                    >
                        <ArrowLeft className="w-5 h-5 text-[#1A1A1A]" />
                    </button>
                    <div>
                        <h1 className="font-bold text-[#1A1A1A] text-lg leading-tight">
                            {step === 'details' ? 'Checkout' : 'Payment'}
                        </h1>
                        <p className="text-xs text-[#8A8A8A]">
                            Step {step === 'details' ? '1' : '2'} of 2
                        </p>
                    </div>
                </div>

                {/* Progress bar */}
                <div className="h-1 bg-[#EBEBEB]">
                    <div
                        className="h-full bg-[#FF6B2C] transition-all duration-500 rounded-full"
                        style={{ width: step === 'details' ? '50%' : '100%' }}
                    />
                </div>
            </div>

            <div className="px-4 py-5 space-y-4 pb-10">

                {/* Order Summary (always visible) */}
                <div className="card p-5">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-7 h-7 bg-[#FFF0E8] rounded-lg flex items-center justify-center">
                            <Package className="w-3.5 h-3.5 text-[#FF6B2C]" />
                        </div>
                        <h2 className="font-bold text-[#1A1A1A] text-sm">Order Summary</h2>
                    </div>

                    <div className="space-y-2">
                        {cartItems.map((item, i) => (
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

                    <div className="mt-3 pt-3 border-t border-[#EBEBEB] flex items-center justify-between">
                        <span className="font-bold text-[#1A1A1A]">Total</span>
                        <span className="font-bold text-[#FF6B2C] text-lg">{formatCurrency(totalAmount)}</span>
                    </div>
                </div>

                {/* ── STEP 1: Customer Details ── */}
                {step === 'details' && (
                    <div className="card p-5 animate-fade-in-up">
                        <h2 className="font-bold text-[#1A1A1A] mb-4">Your Details</h2>

                        <form onSubmit={handleDetailsSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-[#8A8A8A] uppercase tracking-wide mb-2">
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={customerInfo.name}
                                    onChange={handleInputChange}
                                    required
                                    className="input"
                                    placeholder="Enter your name"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-[#8A8A8A] uppercase tracking-wide mb-2">
                                    Phone Number *
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={customerInfo.phone}
                                    onChange={handleInputChange}
                                    required
                                    pattern="[0-9]{10}"
                                    className="input"
                                    placeholder="10-digit mobile number"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-[#8A8A8A] uppercase tracking-wide mb-2">
                                    Email <span className="normal-case font-normal">(optional)</span>
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={customerInfo.email}
                                    onChange={handleInputChange}
                                    className="input"
                                    placeholder="your@email.com"
                                />
                            </div>

                            <button type="submit" className="btn-brand w-full py-4 rounded-2xl text-base mt-2">
                                Continue to Payment →
                            </button>
                        </form>
                    </div>
                )}

                {/* ── STEP 2: Payment Method ── */}
                {step === 'payment' && (
                    <div className="animate-fade-in-up space-y-4">
                        {/* Demo notice */}
                        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3">
                            <span className="text-lg mt-0.5">🧪</span>
                            <div>
                                <p className="text-xs font-semibold text-amber-800">Demo Mode</p>
                                <p className="text-xs text-amber-700 mt-0.5">
                                    No real payment is charged. Click "Confirm & Place Order" to simulate a successful payment.
                                </p>
                            </div>
                        </div>

                        {/* Payment methods */}
                        <div className="card p-5">
                            <h2 className="font-bold text-[#1A1A1A] mb-4">Select Payment Method</h2>
                            <div className="space-y-3">
                                {PAYMENT_METHODS.map((method) => {
                                    const Icon = method.icon;
                                    const isSelected = selectedMethod === method.id;
                                    return (
                                        <button
                                            key={method.id}
                                            onClick={() => setSelectedMethod(method.id)}
                                            className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${isSelected
                                                    ? 'border-[#FF6B2C] bg-[#FFF0E8]'
                                                    : 'border-[#EBEBEB] bg-white hover:border-[#FF6B2C]/30'
                                                }`}
                                        >
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isSelected ? 'bg-[#FF6B2C]' : 'bg-[#F0F0F0]'
                                                }`}>
                                                <Icon className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-[#8A8A8A]'}`} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className={`font-semibold text-sm ${isSelected ? 'text-[#FF6B2C]' : 'text-[#1A1A1A]'}`}>
                                                    {method.label}
                                                </p>
                                                <p className="text-xs text-[#8A8A8A] mt-0.5">{method.desc}</p>
                                            </div>
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${isSelected ? 'border-[#FF6B2C]' : 'border-[#EBEBEB]'
                                                }`}>
                                                {isSelected && <div className="w-2.5 h-2.5 bg-[#FF6B2C] rounded-full" />}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Customer summary */}
                        <div className="card p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-[#8A8A8A]">Ordering as</p>
                                    <p className="font-semibold text-[#1A1A1A] text-sm mt-0.5">{customerInfo.name}</p>
                                    <p className="text-xs text-[#8A8A8A]">{customerInfo.phone}</p>
                                </div>
                                <button
                                    onClick={() => setStep('details')}
                                    className="text-xs text-[#FF6B2C] font-semibold"
                                >
                                    Edit
                                </button>
                            </div>
                        </div>

                        {/* Confirm button */}
                        <button
                            onClick={handleConfirmPayment}
                            disabled={processing}
                            className="btn-brand w-full py-4 rounded-2xl text-base"
                        >
                            <CheckCircle2 className="w-5 h-5" />
                            Confirm & Place Order · {formatCurrency(totalAmount)}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Checkout;
