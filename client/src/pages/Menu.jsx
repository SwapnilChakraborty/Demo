import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, ChevronRight, Star, Plus, Minus, X, Home } from 'lucide-react';
import { getMenuItems } from '../services/api';
import { formatCurrency } from '../utils/helpers';

function Menu() {
    const [menuItems, setMenuItems] = useState([]);
    const [cart, setCart] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [cartOpen, setCartOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => { fetchMenu(); }, []);

    const fetchMenu = async () => {
        try {
            const data = await getMenuItems();
            setMenuItems(data);
        } catch (err) {
            setError('Failed to load menu. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const addToCart = (itemId) => {
        setCart(prev => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
    };

    const removeFromCart = (itemId) => {
        setCart(prev => {
            const next = { ...prev };
            if (next[itemId] > 1) next[itemId]--;
            else delete next[itemId];
            return next;
        });
    };

    const clearItem = (itemId) => {
        setCart(prev => { const next = { ...prev }; delete next[itemId]; return next; });
    };

    const totalItems = Object.values(cart).reduce((s, q) => s + q, 0);
    const totalPrice = Object.entries(cart).reduce((s, [id, q]) => {
        const item = menuItems.find(i => i.id === parseInt(id));
        return s + (item ? item.price * q : 0);
    }, 0);

    const cartItemsList = Object.entries(cart).map(([id, qty]) => {
        const item = menuItems.find(i => i.id === parseInt(id));
        return item ? { ...item, qty } : null;
    }).filter(Boolean);

    const filteredItems = menuItems.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleCheckout = () => {
        if (totalItems === 0) return;
        const cartItems = cartItemsList.map(i => ({ name: i.name, quantity: i.qty, price: i.price }));
        navigate('/checkout', { state: { cartItems, totalAmount: totalPrice } });
    };

    // Loading skeleton
    if (loading) {
        return (
            <div className="min-h-screen bg-[#F7F5F2]">
                <div className="px-4 pt-12 pb-4">
                    <div className="shimmer h-8 w-48 rounded-xl mb-1" />
                    <div className="shimmer h-5 w-32 rounded-xl mt-2" />
                </div>
                <div className="px-4 mb-4">
                    <div className="shimmer h-12 rounded-2xl" />
                </div>
                <div className="px-4 space-y-4">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="bg-white rounded-3xl p-4 flex gap-4 border border-[#EBEBEB]">
                            <div className="shimmer w-24 h-24 rounded-2xl flex-shrink-0" />
                            <div className="flex-1 space-y-2 pt-1">
                                <div className="shimmer h-5 w-3/4 rounded-lg" />
                                <div className="shimmer h-4 w-full rounded-lg" />
                                <div className="shimmer h-4 w-1/2 rounded-lg" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#F7F5F2] flex items-center justify-center p-6">
                <div className="text-center">
                    <div className="text-5xl mb-4">😕</div>
                    <p className="text-[#1A1A1A] font-semibold mb-1">Something went wrong</p>
                    <p className="text-[#8A8A8A] text-sm mb-6">{error}</p>
                    <button onClick={fetchMenu} className="btn-brand">Try Again</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F7F5F2] pb-28">

            {/* ── Header ── */}
            <div className="bg-white border-b border-[#EBEBEB] sticky top-0 z-30">
                <div className="px-4 py-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-lg font-bold text-[#1A1A1A] leading-tight">Fresh Egg Roll Corner</h1>
                        <p className="text-xs text-[#8A8A8A] mt-0.5">🟢 Open now · Fast delivery</p>
                    </div>
                    <button
                        onClick={() => setCartOpen(true)}
                        className="relative w-11 h-11 bg-[#FFF0E8] rounded-2xl flex items-center justify-center"
                    >
                        <ShoppingCart className="w-5 h-5 text-[#FF6B2C]" />
                        {totalItems > 0 && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#FF6B2C] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                {totalItems}
                            </span>
                        )}
                    </button>
                </div>
            </div>

            {/* ── Hero Banner ── */}
            <div className="mx-4 mt-4 rounded-3xl overflow-hidden hero-gradient p-6 relative">
                <div className="relative z-10">
                    <span className="badge-brand mb-3 inline-flex">🔥 Today's Special</span>
                    <h2 className="text-white text-2xl font-bold leading-tight mb-1">
                        Warm Bowls,<br />Bold Flavors!
                    </h2>
                    <p className="text-white/80 text-sm mb-4">Fresh ingredients, made to order</p>
                    <button className="bg-white text-[#FF6B2C] font-semibold text-sm px-5 py-2.5 rounded-xl flex items-center gap-1 hover:bg-orange-50 transition-colors">
                        Explore Menu <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
                {/* Decorative circles */}
                <div className="absolute right-4 top-4 w-24 h-24 bg-white/10 rounded-full" />
                <div className="absolute right-10 bottom-2 w-14 h-14 bg-white/10 rounded-full" />
                <div className="absolute right-0 top-8 w-16 h-16 bg-white/5 rounded-full" />
            </div>

            {/* ── Search ── */}
            <div className="px-4 mt-4">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C0C0C0]" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder="Search dishes..."
                        className="input pl-11"
                    />
                </div>
            </div>

            {/* ── Menu List ── */}
            <div className="px-4 mt-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-bold text-[#1A1A1A]">
                        {searchQuery ? `Results for "${searchQuery}"` : 'Popular Dishes'}
                    </h3>
                    <span className="text-xs text-[#8A8A8A]">{filteredItems.length} items</span>
                </div>

                {filteredItems.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="text-5xl mb-3">🔍</div>
                        <p className="font-semibold text-[#1A1A1A]">No dishes found</p>
                        <p className="text-sm text-[#8A8A8A] mt-1">Try a different search</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filteredItems.map((item, idx) => {
                            const qty = cart[item.id] || 0;
                            return (
                                <div
                                    key={item.id}
                                    className="card-hover p-4 flex gap-4 animate-fade-in-up"
                                    style={{ animationDelay: `${idx * 40}ms` }}
                                >
                                    {/* Image */}
                                    <div className="w-24 h-24 rounded-2xl overflow-hidden bg-[#F0F0F0] flex-shrink-0">
                                        <img
                                            src={item.image || `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop`}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                            onError={e => {
                                                e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop';
                                            }}
                                        />
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="min-w-0">
                                                <h4 className="font-semibold text-[#1A1A1A] text-sm leading-tight truncate">{item.name}</h4>
                                                <p className="text-xs text-[#8A8A8A] mt-0.5 line-clamp-2 leading-relaxed">
                                                    {item.description || 'Made fresh with quality ingredients'}
                                                </p>
                                            </div>
                                            {item.rating && (
                                                <span className="flex items-center gap-0.5 text-xs font-semibold text-[#8A8A8A] flex-shrink-0">
                                                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                                    {item.rating}
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex items-center justify-between mt-3">
                                            <span className="font-bold text-[#FF6B2C] text-base">{formatCurrency(item.price)}</span>

                                            {/* Qty Controls */}
                                            {qty === 0 ? (
                                                <button
                                                    onClick={() => addToCart(item.id)}
                                                    className="qty-btn-add w-9 h-9 rounded-xl flex items-center justify-center"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <button onClick={() => removeFromCart(item.id)} className="qty-btn-remove">
                                                        <Minus className="w-3.5 h-3.5" />
                                                    </button>
                                                    <span className="font-bold text-[#1A1A1A] text-sm w-5 text-center">{qty}</span>
                                                    <button onClick={() => addToCart(item.id)} className="qty-btn-add">
                                                        <Plus className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* ── Cart Drawer Overlay ── */}
            {cartOpen && (
                <div className="fixed inset-0 z-50 flex flex-col justify-end">
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={() => setCartOpen(false)}
                    />
                    <div className="relative bg-white rounded-t-3xl max-h-[80vh] flex flex-col">
                        {/* Drawer handle */}
                        <div className="flex justify-center pt-3 pb-1">
                            <div className="w-10 h-1 bg-[#EBEBEB] rounded-full" />
                        </div>

                        {/* Drawer header */}
                        <div className="flex items-center justify-between px-5 py-3 border-b border-[#EBEBEB]">
                            <div>
                                <h3 className="font-bold text-[#1A1A1A] text-lg">Your Cart</h3>
                                <p className="text-xs text-[#8A8A8A]">{totalItems} item{totalItems !== 1 ? 's' : ''}</p>
                            </div>
                            <button
                                onClick={() => setCartOpen(false)}
                                className="w-9 h-9 bg-[#F0F0F0] rounded-xl flex items-center justify-center"
                            >
                                <X className="w-4 h-4 text-[#8A8A8A]" />
                            </button>
                        </div>

                        {/* Cart items */}
                        <div className="overflow-y-auto flex-1 px-5 py-4">
                            {cartItemsList.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="text-5xl mb-3">🛒</div>
                                    <p className="font-semibold text-[#1A1A1A]">Cart is empty</p>
                                    <p className="text-sm text-[#8A8A8A] mt-1">Add some delicious items!</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {cartItemsList.map(item => (
                                        <div key={item.id} className="flex items-center gap-3 py-2">
                                            <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#F0F0F0] flex-shrink-0">
                                                <img
                                                    src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&h=100&fit=crop'}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover"
                                                    onError={e => { e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&h=100&fit=crop'; }}
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-[#1A1A1A] text-sm truncate">{item.name}</p>
                                                <p className="text-xs text-[#FF6B2C] font-medium mt-0.5">{formatCurrency(item.price)} each</p>
                                            </div>
                                            <div className="flex items-center gap-2 flex-shrink-0">
                                                <button onClick={() => removeFromCart(item.id)} className="qty-btn-remove w-8 h-8 rounded-lg">
                                                    <Minus className="w-3 h-3" />
                                                </button>
                                                <span className="font-bold text-sm w-4 text-center">{item.qty}</span>
                                                <button onClick={() => addToCart(item.id)} className="qty-btn-add w-8 h-8 rounded-lg">
                                                    <Plus className="w-3 h-3" />
                                                </button>
                                                <button onClick={() => clearItem(item.id)} className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center ml-1">
                                                    <X className="w-3 h-3 text-red-400" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Checkout footer */}
                        {cartItemsList.length > 0 && (
                            <div className="px-5 pb-8 pt-4 border-t border-[#EBEBEB]">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-[#8A8A8A] text-sm">Total</span>
                                    <span className="font-bold text-[#1A1A1A] text-xl">{formatCurrency(totalPrice)}</span>
                                </div>
                                <button
                                    onClick={() => { setCartOpen(false); handleCheckout(); }}
                                    className="btn-brand w-full py-4 text-base rounded-2xl"
                                >
                                    Proceed to Checkout
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ── Sticky Cart Bar (when cart has items) ── */}
            {totalItems > 0 && !cartOpen && (
                <div className="fixed bottom-20 left-4 right-4 z-40">
                    <button
                        onClick={() => setCartOpen(true)}
                        className="w-full bg-[#1A1A1A] text-white rounded-2xl px-5 py-4 flex items-center justify-between shadow-xl"
                    >
                        <div className="flex items-center gap-3">
                            <span className="bg-[#FF6B2C] text-white text-xs font-bold w-6 h-6 rounded-lg flex items-center justify-center">
                                {totalItems}
                            </span>
                            <span className="font-semibold text-sm">View Cart</span>
                        </div>
                        <span className="font-bold text-[#FF6B2C]">{formatCurrency(totalPrice)}</span>
                    </button>
                </div>
            )}

            {/* ── Bottom Navigation ── */}
            <nav className="fixed bottom-0 left-0 right-0 bg-white bottom-nav z-30">
                <div className="flex items-center justify-center px-2">
                    <button onClick={() => navigate('/')} className="nav-tab">
                        <Home className="w-5 h-5 text-[#FF6B2C]" />
                        <span className="nav-tab-label text-[#FF6B2C]">Home</span>
                    </button>
                </div>
            </nav>
        </div>
    );
}

export default Menu;
