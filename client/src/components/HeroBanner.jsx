import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

function HeroBanner() {
    const bannerRef = useRef(null);
    const titleRef = useRef(null);
    const subtitleRef = useRef(null);
    const buttonRef = useRef(null);

    useEffect(() => {
        const tl = gsap.timeline();

        tl.from(bannerRef.current, {
            scale: 0.95,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out'
        })
            .from(titleRef.current, {
                y: 30,
                opacity: 0,
                duration: 0.6,
                ease: 'back.out(1.7)'
            }, '-=0.4')
            .from(subtitleRef.current, {
                y: 20,
                opacity: 0,
                duration: 0.5
            }, '-=0.3')
            .from(buttonRef.current, {
                scale: 0,
                opacity: 0,
                duration: 0.4,
                ease: 'back.out(2)'
            }, '-=0.2');
    }, []);

    return (
        <div
            ref={bannerRef}
            className="hero-banner relative h-48 rounded-3xl overflow-hidden"
            style={{
                backgroundImage: 'url(https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200&h=600&fit=crop)',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}
        >
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-600/90 to-red-800/90"></div>

            {/* Content */}
            <div className="relative h-full flex flex-col items-center justify-center text-center px-6 z-10">
                <h1
                    ref={titleRef}
                    className="text-white text-3xl font-bold mb-2 drop-shadow-lg"
                    style={{ lineHeight: '1.2' }}
                >
                    Warm Bowls<br />Bold Flavors!
                </h1>
                <p
                    ref={subtitleRef}
                    className="text-white/90 text-sm mb-4 max-w-md"
                >
                    Come in and discover your new favorite comfort food—made just for you!
                </p>
                <button
                    ref={buttonRef}
                    className="btn-primary text-sm"
                >
                    EXPLORE
                </button>
            </div>
        </div>
    );
}

export default HeroBanner;
