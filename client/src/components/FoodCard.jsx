import { motion } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import { formatCurrency } from '../utils/helpers';

function FoodCard({ item, quantity = 0, onAdd, onRemove }) {
    // Placeholder image - you can replace with actual images later
    const imageUrl = item.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&size=400&background=FF6B35&color=fff&bold=true`;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
            className="food-card cursor-pointer"
        >
            {/* Food Image */}
            <div className="relative h-40 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                <img
                    src={imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&size=400&background=FF6B35&color=fff&bold=true`;
                    }}
                />
                {item.badge && (
                    <div className="absolute top-2 left-2">
                        <span className="promo-badge">{item.badge}</span>
                    </div>
                )}
            </div>

            {/* Card Content */}
            <div className="p-4">
                <h3 className="font-semibold text-gray-900 text-lg mb-1 line-clamp-1">
                    {item.name}
                </h3>

                {item.description && (
                    <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                        {item.description}
                    </p>
                )}

                <div className="flex items-center justify-between mt-3">
                    <div>
                        <p className="text-xl font-bold text-primary">
                            {formatCurrency(item.price)}
                        </p>
                        {item.rating && (
                            <div className="flex items-center gap-1 mt-1">
                                <span className="text-yellow-500 text-sm">★</span>
                                <span className="text-xs text-gray-600">{item.rating}</span>
                            </div>
                        )}
                    </div>

                    {/* Add/Remove Buttons */}
                    <div className="flex items-center gap-2">
                        {quantity > 0 ? (
                            <>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => onRemove(item.id)}
                                    className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                                >
                                    <Minus className="w-4 h-4 text-gray-700" />
                                </motion.button>
                                <span className="text-lg font-semibold min-w-[24px] text-center">
                                    {quantity}
                                </span>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => onAdd(item)}
                                    className="w-8 h-8 rounded-full bg-primary hover:bg-primary-dark text-white flex items-center justify-center transition-colors shadow-md"
                                >
                                    <Plus className="w-4 h-4" />
                                </motion.button>
                            </>
                        ) : (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => onAdd(item)}
                                className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl font-semibold text-sm flex items-center gap-1 shadow-md transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                Add
                            </motion.button>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default FoodCard;
