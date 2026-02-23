import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import "./ChromaGrid.css";

const ChromaGrid = ({
  items,
  className = "",
  radius = 300,
  columns = 4,
  damping = 0.45,
  fadeOut = 0.6,
  ease = "power3.out",
}) => {
  const rootRef = useRef(null);
  const fadeRef = useRef(null);
  const setX = useRef(null);
  const setY = useRef(null);
  const pos = useRef({ x: 0, y: 0 });

  // Calculate dynamic rows based on items count
  const calculateRows = (itemCount, cols) => {
    return Math.ceil(itemCount / cols);
  };

  // Convert skills/projects data to chroma format
  const convertToChroma = (items) => {
    return items.map((item) => ({
      image: item.image || `https://placehold.co/300x300/1e1e23/6b7280?text=${encodeURIComponent(item.title || item.name)}`,
      title: item.title || item.name,
      subtitle: item.subtitle || item.level || item.category,
      handle: item.handle || item.icon || (Array.isArray(item.tech) ? item.tech[0] : item.tech || "React"),
      borderColor: item.borderColor || getColorFromGradient(item.color),
      gradient: item.gradient || `linear-gradient(145deg, ${getColorFromGradient(item.color)}, #000)`,
      url: item.url || null,
    }));
  };

  const getColorFromGradient = (gradient) => {
    const colorMap = {
      "from-blue-400 to-cyan-400": "#3b82f6",
      "from-yellow-400 to-orange-400": "#fbbf24",
      "from-cyan-400 to-blue-400": "#06b6d4",
      "from-blue-500 to-blue-600": "#3b82f6",
      "from-green-400 to-green-600": "#4ade80",
      "from-yellow-400 to-orange-500": "#f59e0b",
      "from-gray-400 to-gray-600": "#9ca3af",
      "from-purple-400 to-pink-400": "#c084fc",
    };
    return colorMap[gradient] || "#8b5cf6";
  };

  const data = items?.length ? convertToChroma(items) : [];
  
  // Calculate dynamic rows
  const dynamicRows = calculateRows(data.length, columns);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    setX.current = gsap.quickSetter(el, "--x", "px");
    setY.current = gsap.quickSetter(el, "--y", "px");
    const { width, height } = el.getBoundingClientRect();
    pos.current = { x: width / 2, y: height / 2 };
    setX.current(pos.current.x);
    setY.current(pos.current.y);
  }, []);

  const moveTo = (x, y) => {
    gsap.to(pos.current, {
      x,
      y,
      duration: damping,
      ease,
      onUpdate: () => {
        setX.current?.(pos.current.x);
        setY.current?.(pos.current.y);
      },
      overwrite: true,
    });
  };

  const handleMove = (e) => {
    const r = rootRef.current.getBoundingClientRect();
    moveTo(e.clientX - r.left, e.clientY - r.top);
    gsap.to(fadeRef.current, { opacity: 0, duration: 0.25, overwrite: true });
  };

  const handleLeave = () => {
    gsap.to(fadeRef.current, {
      opacity: 1,
      duration: fadeOut,
      overwrite: true,
    });
  };

  const handleCardMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <div
      ref={rootRef}
      className={`chroma-grid ${className}`}
      style={{
        "--r": `${radius}px`,
        "--cols": columns,
        "--rows": dynamicRows,
      }}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
    >
      {data.map((c, i) => (
        <article
          key={i}
          className="chroma-card"
          onMouseMove={handleCardMove}
          style={{
            "--card-border": c.borderColor || "transparent",
            "--card-gradient": c.gradient,
          }}
        >
          <div className="chroma-img-wrapper">
            <img src={c.image} alt={c.title} loading="lazy" />
          </div>
          <footer className="chroma-info">
            <h3 className="name">{c.title}</h3>
            <span className="handle">{c.handle}</span>
            <p className="role">{c.subtitle}</p>
          </footer>
        </article>
      ))}
      <div className="chroma-overlay" />
      <div ref={fadeRef} className="chroma-fade" />
    </div>
  );
};

export default ChromaGrid;
