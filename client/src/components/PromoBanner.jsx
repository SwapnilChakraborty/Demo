import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

function PromoBanner() {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-3xl p-6 gradient-orange shadow-lg mb-6"
        >
            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5 text-white" />
                    <span className="text-white font-bold text-sm uppercase tracking-wide">
                        Flash Sale
                    </span>
                </div>
                <h2 className="text-white text-2xl md:text-3xl font-bold mb-2">
                    Lunchtime Special
                </h2>
                <p className="text-white/90 text-sm md:text-base mb-4">
                    Get 20% off on all egg rolls!
                </p>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white text-primary font-semibold px-6 py-2 rounded-xl shadow-md hover:shadow-lg transition-all"
                >
                    Order Now
                </motion.button>
            </div>

            {/* Decorative elements */}
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute -left-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
        </motion.div>
    );
}

export default PromoBanner;
