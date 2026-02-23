import { useRef, useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";
import { gsap } from "gsap";

const PageTransition = ({ children }) => {
  const location = useLocation();
  const pageRef = useRef(null);

  useLayoutEffect(() => {
    const page = pageRef.current;
    if (!page) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        page,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
      );
    });

    return () => ctx.revert();
  }, [location]);

  return (
    <div ref={pageRef} className="w-full min-h-screen">
      {children}
    </div>
  );
};

export default PageTransition;
