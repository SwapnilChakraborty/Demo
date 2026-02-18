import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { Star, Plus, Minus } from 'lucide-react';
import { formatCurrency } from '../utils/helpers';

function HorizontalFoodCard({ item, quantity = 0, onAdd, onRemove }) {
    const cardRef = useRef(null);

    useEffect(() => {
        gsap.from(cardRef.current, {
            y: 30,
            opacity: 0,
            duration: 0.5,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: cardRef.current,
                start: 'top 90%',
            }
        });
    }, []);

    const handleAdd = () => {
        const btn = cardRef.current.querySelector('.add-btn');
        gsap.to(btn, {
            scale: 1.2,
            duration: 0.1,
            yoyo: true,
            repeat: 1,
            ease: 'power2.inOut'
        });
        onAdd();
    };

    const handleRemove = () => {
        const btn = cardRef.current.querySelector('.remove-btn');
        gsap.to(btn, {
            scale: 1.2,
            duration: 0.1,
            yoyo: true,
            repeat: 1,
            ease: 'power2.inOut'
        });
        onRemove();
    };

    return (
        <div
            ref={cardRef}
            className="food-card-horizontal flex gap-4 p-4 mb-4"
        >
            {/* Image */}
            <div className="relative flex-shrink-0">
                <div className="w-32 h-32 rounded-2xl overflow-hidden bg-gray-200">
                    <img
                        src={item.image || `https://source.unsplash.com/300x300/?food,${item.name}`}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=300&fit=crop';
                        }}
                    />
                </div>
                {/* Star Rating Badge */}
                {item.rating && (
                    <div className="absolute -top-2 -right-2 star-rating">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-gray-900">{item.rating}</span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col justify-between">
                <div>
                    <h3 className="font-bold text-gray-900 text-lg mb-1">{item.name}</h3>
                    <p className="text-gray-500 text-sm line-clamp-2 mb-2">
                        {item.description || 'Delicious food made with fresh ingredients'}
                    </p>
                </div>

                <div className="flex items-center justify-between">
                    <span className="price-tag">{formatCurrency(item.price)}</span>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3">
                        {quantity > 0 && (
                            <>
                                <button
                                    onClick={handleRemove}
                                    className="quantity-btn remove-btn"
                                    aria-label="Decrease quantity"
                                >
                                    <Minus className="w-4 h-4" />
                                </button>
                                <span className="font-bold text-gray-900 w-6 text-center">
                                    {quantity}
                                </span>
                            </>
                        )}
                        <button
                            onClick={handleAdd}
                            className="quantity-btn add-btn"
                            aria-label="Increase quantity"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HorizontalFoodCard;
