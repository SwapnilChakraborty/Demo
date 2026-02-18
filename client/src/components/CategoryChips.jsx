import { motion } from 'framer-motion';
import { Utensils, Pizza, Coffee, Salad, IceCream } from 'lucide-react';

const categories = [
    { id: 'all', name: 'All', icon: Utensils },
    { id: 'rolls', name: 'Egg Rolls', icon: Pizza },
    { id: 'beverages', name: 'Beverages', icon: Coffee },
    { id: 'salads', name: 'Salads', icon: Salad },
    { id: 'desserts', name: 'Desserts', icon: IceCream },
];

function CategoryChips({ activeCategory, onCategoryChange }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="w-full overflow-x-auto scrollbar-hide"
        >
            <div className="flex gap-3 pb-2">
                {categories.map((category, index) => {
                    const Icon = category.icon;
                    const isActive = activeCategory === category.id;

                    return (
                        <motion.button
                            key={category.id}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05, duration: 0.2 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onCategoryChange(category.id)}
                            className={`category-chip ${isActive ? 'category-chip-active' : 'category-chip-inactive'
                                }`}
                        >
                            <div className="flex items-center gap-2">
                                <Icon className="w-4 h-4" />
                                <span>{category.name}</span>
                            </div>
                        </motion.button>
                    );
                })}
            </div>
        </motion.div>
    );
}

export default CategoryChips;
