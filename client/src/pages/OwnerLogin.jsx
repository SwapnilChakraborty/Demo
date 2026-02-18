import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, ChefHat, ArrowLeft } from 'lucide-react';

const OWNER_PASSWORD = import.meta.env.VITE_OWNER_PASSWORD || 'owner1234';

function OwnerLogin() {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [shaking, setShaking] = useState(false);
    const inputRef = useRef(null);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password === OWNER_PASSWORD) {
            sessionStorage.setItem('ownerAuth', 'true');
            navigate('/dashboard');
        } else {
            setError('Incorrect password. Please try again.');
            setShaking(true);
            setPassword('');
            setTimeout(() => setShaking(false), 500);
            inputRef.current?.focus();
        }
    };

    return (
        <div className="min-h-screen bg-[#F7F5F2] flex flex-col">
            {/* Back button */}
            <div className="p-4">
                <button
                    onClick={() => navigate('/')}
                    className="w-10 h-10 rounded-xl bg-white border border-[#EBEBEB] flex items-center justify-center"
                >
                    <ArrowLeft className="w-5 h-5 text-[#1A1A1A]" />
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col items-center justify-center px-6 pb-16">
                <div className="w-full max-w-sm animate-fade-in-up">

                    {/* Icon */}
                    <div className="flex justify-center mb-6">
                        <div className="w-20 h-20 bg-[#FFF0E8] rounded-3xl flex items-center justify-center">
                            <ChefHat className="w-10 h-10 text-[#FF6B2C]" />
                        </div>
                    </div>

                    {/* Heading */}
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-[#1A1A1A] mb-1">Owner Access</h1>
                        <p className="text-sm text-[#8A8A8A]">Enter your password to view the dashboard</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className={`transition-all duration-150 ${shaking ? 'translate-x-2' : ''}`}>
                            <label className="block text-xs font-semibold text-[#8A8A8A] uppercase tracking-wide mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                                    <Lock className="w-4 h-4 text-[#C0C0C0]" />
                                </div>
                                <input
                                    ref={inputRef}
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={e => { setPassword(e.target.value); setError(''); }}
                                    className={`input pl-11 pr-12 ${error ? 'border-red-400 focus:border-red-400 focus:ring-red-100' : ''}`}
                                    placeholder="Enter owner password"
                                    autoFocus
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#C0C0C0] hover:text-[#8A8A8A] transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>

                            {error && (
                                <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                                    <span>⚠️</span> {error}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={!password}
                            className="btn-brand w-full py-4 rounded-2xl text-base disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <Lock className="w-4 h-4" />
                            Access Dashboard
                        </button>
                    </form>

                    <p className="text-center text-xs text-[#C0C0C0] mt-6">
                        This area is restricted to the restaurant owner only.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default OwnerLogin;
