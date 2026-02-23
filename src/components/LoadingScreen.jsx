import { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";

const LoadingScreen = ({ isLoading }) => {
  const [count, setCount] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const numberRef = useRef(null);
  const containerRef = useRef(null);
  const progressRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    if (isLoading) {
      // Number entrance from bottom with bounce
      gsap.fromTo(
        numberRef.current,
        { y: 100, opacity: 0, scale: 0.8 },
        { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.7)" },
      );

      // Text entrance
      gsap.fromTo(
        textRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, delay: 0.2, ease: "power3.out" },
      );

      // Progress bar entrance
      gsap.fromTo(
        progressRef.current,
        { scaleX: 0, opacity: 0 },
        {
          scaleX: 1,
          opacity: 1,
          duration: 0.6,
          delay: 0.3,
          ease: "power3.out",
        },
      );

      // Count up animation with random speed
      const interval = setInterval(() => {
        setCount((prev) => {
          if (prev >= 99) {
            clearInterval(interval);
            return 99;
          }
          // Random increment for realistic loading feel
          const increment = Math.floor(Math.random() * 5) + 1;
          return Math.min(prev + increment, 99);
        });
      }, 40);

      return () => clearInterval(interval);
    }
  }, [isLoading]);

  useEffect(() => {
    if (!isLoading) {
      // Complete animation
      gsap.to(numberRef.current, {
        scale: 1.1,
        duration: 0.2,
        ease: "power2.out",
        onComplete: () => {
          setCount(100);
          // Exit animation
          gsap.to(containerRef.current, {
            y: -50,
            opacity: 0,
            duration: 0.5,
            ease: "power2.inOut",
            onComplete: () => setFadeOut(true),
          });
        },
      });
    }
  }, [isLoading]);

  if (fadeOut) return null;

  const displayCount = Math.min(count, 100);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gray-900 overflow-hidden"
    >
      {/* Background animated gradient */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }}
      />

      {/* Main content */}
      <div className="relative z-10 text-center">
        {/* Glitch number effect */}
        <div ref={numberRef} className="relative">
          <span className="text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-purple-200 to-purple-400 tabular-nums tracking-tighter">
            {displayCount}
          </span>

          {/* Subtle glow behind number */}
          <div className="absolute inset-0 blur-3xl bg-purple-500/20 -z-10 scale-150" />

          {/* Percentage symbol */}
          <span className="text-3xl md:text-4xl font-light text-purple-400 ml-2">
            %
          </span>
        </div>

        {/* Loading text with typing effect */}
        <div
          ref={textRef}
          className="mt-6 flex items-center justify-center gap-2 text-gray-500"
        >
          <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
          <span className="text-sm tracking-[0.3em] uppercase font-medium">
            {displayCount < 30
              ? "Initializing"
              : displayCount < 60
                ? "Loading assets"
                : displayCount < 90
                  ? "Preparing content"
                  : "Almost there"}
          </span>
        </div>
      </div>

      {/* Progress bar - bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        {/* Main progress line */}
        <div className="h-1 bg-gray-800">
          <div
            ref={progressRef}
            className="h-full bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 origin-left transition-all duration-75 ease-out"
            style={{
              width: `${displayCount}%`,
              boxShadow: "0 0 20px rgba(139, 92, 246, 0.5)",
            }}
          />
        </div>

        {/* Progress percentage indicators */}
        <div className="flex justify-between px-4 py-3 text-xs text-gray-600 font-mono">
          <span>0%</span>
          <span>25%</span>
          <span>50%</span>
          <span>75%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Corner decorations */}
      <div className="absolute top-8 left-8 w-8 h-8 border-l-2 border-t-2 border-purple-500/30" />
      <div className="absolute top-8 right-8 w-8 h-8 border-r-2 border-t-2 border-purple-500/30" />
      <div className="absolute bottom-16 left-8 w-8 h-8 border-l-2 border-b-2 border-purple-500/30" />
      <div className="absolute bottom-16 right-8 w-8 h-8 border-r-2 border-b-2 border-purple-500/30" />
    </div>
  );
};

export default LoadingScreen;
