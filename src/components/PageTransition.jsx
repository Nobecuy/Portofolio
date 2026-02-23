import { useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";

const PageTransition = ({ children }) => {
  const pageRef = useRef(null);

  useLayoutEffect(() => {
    const page = pageRef.current;
    if (!page) return;

    gsap.fromTo(
      page,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
    );
  }, []);

  return (
    <div ref={pageRef} className="w-full min-h-screen">
      {children}
    </div>
  );
};

export default PageTransition;
