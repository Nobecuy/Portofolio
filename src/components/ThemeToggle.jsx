import { useRef } from "react";
import { gsap } from "gsap";

const ThemeToggle = ({ isDark, toggle }) => {
  const buttonRef = useRef(null);

  const handleClick = () => {
    // Animation
    gsap.to(buttonRef.current, {
      rotation: "+=360",
      duration: 0.6,
      ease: "back.out(1.7)",
    });

    gsap.to(buttonRef.current, {
      scale: 0.9,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: "power2.inOut",
    });

    toggle();
  };

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 ${
        isDark
          ? "bg-gray-800 text-yellow-300 hover:bg-gray-700 border-2 border-yellow-300/30 shadow-lg shadow-yellow-300/20"
          : "bg-yellow-100 text-yellow-600 hover:bg-yellow-200 border-2 border-yellow-400/50 shadow-lg shadow-yellow-400/20"
      }`}
      aria-label="Toggle theme"
      title="Toggle theme"
    >
      {isDark ? (
        // Moon icon
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      ) : (
        // Sun icon
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="5" />
          <path
            d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      )}
    </button>
  );
};

export default ThemeToggle;
