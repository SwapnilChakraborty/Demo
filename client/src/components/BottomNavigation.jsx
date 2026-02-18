import { useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { MessageCircle, Heart, Home, ShoppingCart, User } from 'lucide-react';

function BottomNavigation() {
    const navigate = useNavigate();
    const location = useLocation();

    const handleNavClick = (path, event) => {
        gsap.to(event.currentTarget, {
            scale: 0.9,
            duration: 0.1,
            yoyo: true,
            repeat: 1,
            ease: 'power2.inOut',
            onComplete: () => navigate(path)
        });
    };

    const navItems = [
        { icon: Home, label: 'Home', path: '/', isMain: true },
        { icon: ShoppingCart, label: 'Orders', path: '/orders' },
        { icon: Heart, label: 'Favorites', path: '/favorites' },
        { icon: MessageCircle, label: 'Support', path: '/messages' },
        { icon: User, label: 'Dashboard', path: '/dashboard' },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white bottom-nav z-50">
            <div className="px-6 py-3">
                <div className="flex items-center justify-between max-w-md mx-auto">
                    {navItems.map((item, index) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;

                        return (
                            <div
                                key={index}
                                className="nav-item"
                                onClick={(e) => handleNavClick(item.path, e)}
                            >
                                {item.isMain ? (
                                    <div className="bg-red-600 p-4 rounded-full shadow-lg -mt-8">
                                        <Icon className="w-7 h-7 text-white" />
                                    </div>
                                ) : (
                                    <Icon
                                        className={`w-6 h-6 ${isActive ? 'text-red-600' : 'text-gray-400'}`}
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}

export default BottomNavigation;
