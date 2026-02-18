import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { Search, SlidersHorizontal } from 'lucide-react';

function SearchBarPro({ value, onChange, placeholder = "Search your favorite food..." }) {
    const searchRef = useRef(null);

    useEffect(() => {
        gsap.from(searchRef.current, {
            y: -20,
            opacity: 0,
            duration: 0.6,
            delay: 0.3,
            ease: 'back.out(1.7)'
        });
    }, []);

    return (
        <div ref={searchRef} className="relative mx-4 my-4">
            {/* Search Icon - Left */}
            <div className="absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none">
                <div className="bg-red-600 p-2 rounded-full">
                    <Search className="w-4 h-4 text-white" />
                </div>
            </div>

            {/* Input */}
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="search-input"
            />

            {/* Search Icon - Right */}
            <div className="absolute right-5 top-1/2 -translate-y-1/2">
                <Search className="w-5 h-5 text-gray-400" />
            </div>
        </div>
    );
}

export default SearchBarPro;
