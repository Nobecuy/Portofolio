import {
  useEffect,
  useState,
  useRef,
  useLayoutEffect,
  useCallback,
} from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  pageContentService,
  progressService,
  projectsService,
} from "../../firebase";
import { useTheme } from "../../context/ThemeContext";
import ProfileCard from "../../components/ProfileCard";
import ChromaGrid from "../../components/ChromaGrid";
import LoadingScreen from "../../components/LoadingScreen";
import ThemeToggle from "../../components/ThemeToggle";

gsap.registerPlugin(ScrollTrigger);

// Text Scramble Effect - Pure JavaScript
const ScrambleText = ({ text, className, delay = 0 }) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const chars = "!<>-_\\/[]{}—=+*^?#________";
    const el = ref.current;
    const finalText = text;
    const length = finalText.length;
    const queue = [];

    for (let i = 0; i < length; i++) {
      queue.push({
        from: chars[Math.floor(Math.random() * chars.length)],
        to: finalText[i],
        start: Math.floor(Math.random() * 10) + i * 5,
        end: Math.floor(Math.random() * 10) + i * 5 + 15,
      });
    }

    let frame = 0;
    let frameRequest;

    const update = () => {
      let output = "";
      let complete = 0;

      for (let i = 0; i < queue.length; i++) {
        let { from, to, start, end, char } = queue[i];
        let currentChar = char || from;

        if (frame >= end) {
          complete++;
          currentChar = to;
        } else if (frame > start) {
          if (!currentChar || Math.random() < 0.28) {
            currentChar = chars[Math.floor(Math.random() * chars.length)];
            queue[i].char = currentChar;
          }
        }
        output += currentChar;
      }

      el.innerText = output;

      if (complete === queue.length) {
        cancelAnimationFrame(frameRequest);
      } else {
        frame++;
        frameRequest = requestAnimationFrame(update);
      }
    };

    const timer = setTimeout(() => {
      frameRequest = requestAnimationFrame(update);
    }, delay * 1000);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(frameRequest);
    };
  }, [isVisible, text, delay]);

  return (
    <span ref={ref} className={className}>
      {text}
    </span>
  );
};

// Optimized Floating Particles
const FloatingParticles = () => {
  const canvasRef = useRef(null);
  const frameCount = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationId;
    let particles = [];
    const isTouch = window.matchMedia("(pointer: coarse)").matches;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + Math.random() * 100;
        this.size = Math.random() * 2 + 0.5;
        this.speedY = Math.random() * 0.5 + 0.2;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.3 + 0.1;
        this.color = Math.random() > 0.5 ? "139, 92, 246" : "236, 72, 153";
      }

      update() {
        this.y -= this.speedY;
        this.x += this.speedX;
        if (this.y < -10) this.reset();
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
        ctx.fill();
      }
    }

    const particleCount = isTouch ? 15 : 25;
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const animate = () => {
      frameCount.current++;
      if (frameCount.current % 2 === 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach((p) => {
          p.update();
          p.draw();
        });
      }
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-40"
    />
  );
};

// Aurora Background - CSS Animation
const AuroraBackground = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Base gradient - akan berubah sesuai theme */}
      <div className="aurora-base absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-950/20 to-gray-900 dark:from-gray-900 dark:via-purple-950/20 dark:to-gray-900 light:from-gray-50 light:via-purple-100/30 light:to-white" />

      {/* Animated aurora blobs */}
      <div className="aurora-blob aurora-blob-1 absolute -top-1/4 -left-1/4 w-[600px] h-[600px] bg-purple-600/20 dark:bg-purple-600/20 light:bg-purple-400/30 rounded-full blur-[100px]" />
      <div className="aurora-blob aurora-blob-2 absolute top-1/3 -right-1/4 w-[500px] h-[500px] bg-pink-600/15 dark:bg-pink-600/15 light:bg-pink-400/25 rounded-full blur-[80px]" />
      <div className="aurora-blob aurora-blob-3 absolute -bottom-1/4 left-1/3 w-[700px] h-[700px] bg-blue-600/10 dark:bg-blue-600/10 light:bg-blue-400/20 rounded-full blur-[120px]" />
      <div className="aurora-blob aurora-blob-4 absolute top-1/2 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-violet-600/10 dark:bg-violet-600/10 light:bg-violet-400/20 rounded-full blur-[150px]" />

      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.03] light:opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
};

// Magnetic Button
const MagneticButton = ({ children, onClick, className, type = "button" }) => {
  const ref = useRef(null);
  const boundingRef = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) return;

    const handleMove = (e) => {
      if (!boundingRef.current)
        boundingRef.current = el.getBoundingClientRect();
      const rect = boundingRef.current;
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      el.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    };

    const handleLeave = () => {
      boundingRef.current = null;
      el.style.transform = "translate(0, 0)";
    };

    el.addEventListener("mousemove", handleMove, { passive: true });
    el.addEventListener("mouseleave", handleLeave, { passive: true });

    return () => {
      el.removeEventListener("mousemove", handleMove);
      el.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  return (
    <button
      ref={ref}
      onClick={onClick}
      className={`${className} transition-transform duration-200 ease-out will-change-transform`}
      type={type}
    >
      {children}
    </button>
  );
};

// Default content structure
const defaultContent = {
  home: {
    badge: "👋 Welcome to my portfolio",
    title: "Hi, I'm",
    highlightName: "Nobe",
    emoji: "👨‍💻",
    subtitle:
      "Frontend Developer & Creative Coder crafting beautiful digital experiences",
    primaryButton: "View Projects 🚀",
    secondaryButton: "Get In Touch 📧",
    profileImage: "https://i.pravatar.cc/400?img=11",
  },
  about: {
    title: "About Me",
    subtitle: "Get to know my journey and passion",
    heading: "Who am I?",
    description:
      "I'm a passionate frontend developer who loves creating beautiful and functional web experiences. With expertise in React, modern CSS, and UI/UX design, I bring ideas to life through clean code.",
    tag1: "React Expert",
    tag2: "UI Designer",
    stat1: { value: "3+", label: "Years Experience" },
    stat2: { value: "50+", label: "Projects Done" },
    stat3: { value: "20+", label: "Happy Clients" },
  },
  skills: {
    title: "My Skills",
    subtitle: "Technologies I work with daily",
    items: [
      {
        icon: "⚛️",
        name: "React",
        level: "Advanced",
        color: "blue",
        image:
          "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
      },
      {
        icon: "🟨",
        name: "JavaScript",
        level: "Advanced",
        color: "yellow",
        image:
          "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
      },
      {
        icon: "🎨",
        name: "Tailwind",
        level: "Advanced",
        color: "blue",
        image:
          "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg",
      },
      {
        icon: "🔷",
        name: "TypeScript",
        level: "Intermediate",
        color: "blue",
        image:
          "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
      },
      {
        icon: "🟢",
        name: "Node.js",
        level: "Intermediate",
        color: "green",
        image:
          "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
      },
      {
        icon: "🔥",
        name: "Firebase",
        level: "Intermediate",
        color: "yellow",
        image:
          "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg",
      },
      {
        icon: "🐙",
        name: "GitHub",
        level: "Advanced",
        color: "gray",
        image:
          "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg",
      },
      {
        icon: "🎯",
        name: "Figma",
        level: "Intermediate",
        color: "purple",
        image:
          "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg",
      },
    ],
  },
  projects: {
    title: "My Projects",
    subtitle: "Explore my latest work",
    categories: ["All", "Web App", "Website", "Mobile", "AI/ML", "Design"],
    items: [],
  },
  experience: {
    title: "Experience & Education",
    subtitle: "My professional journey so far",
    items: [],
  },
  contact: {
    title: "Get In Touch",
    subtitle: "Let's collaborate on your next project",
    email: "nobe@example.com",
    phone: "+62 123 4567 890",
    location: "Indonesia",
    socials: ["GitHub", "LinkedIn", "Twitter", "Dribbble"],
  },
};

const OnePage = () => {
  const { isDark, toggleTheme } = useTheme();
  const [isReady, setIsReady] = useState(false);
  const [projects, setProjects] = useState([]);
  const [progressData, setProgressData] = useState([]);
  const [pageContent, setPageContent] = useState(defaultContent);
  const [activeSection, setActiveSection] = useState("home");
  
  // Debug theme state removed

  const homeRef = useRef(null);
  const aboutRef = useRef(null);
  const progressRef = useRef(null);
  const projectsRef = useRef(null);
  const skillsRef = useRef(null);
  const experienceRef = useRef(null);
  const contactRef = useRef(null);
  const formRef = useRef(null);
  const scrollTriggersRef = useRef([]);

  // Custom Cursor - DISABLED
  useEffect(() => {
    // Custom cursor disabled for better performance
    return () => {};
  }, []);

  // Load data dari Firebase
  useEffect(() => {
    let unsubProgress = null;

    const loadData = async () => {
      try {
        const contentData = await pageContentService.getAll();
        if (contentData) {
          setPageContent((prev) => ({
            ...prev,
            ...contentData,
            home: { ...prev.home, ...contentData.home },
            about: { ...prev.about, ...contentData.about },
            skills: { ...prev.skills, ...contentData.skills },
            projects: {
              ...prev.projects,
              ...contentData.projects,
              items: contentData.projects?.items || prev.projects.items,
            },
            experience: {
              ...prev.experience,
              ...contentData.experience,
              items: contentData.experience?.items || prev.experience.items,
            },
            contact: { ...prev.contact, ...contentData.contact },
          }));
        }

        const projectData = await projectsService.getAll();
        if (projectData && projectData.length > 0) {
          setProjects(projectData);
        } else if (contentData?.projects?.items?.length > 0) {
          setProjects(
            contentData.projects.items.map((p, i) => ({
              ...p,
              id: p.id || `proj-${i}`,
            })),
          );
        }

        unsubProgress = progressService.onProgressChange((data) => {
          setProgressData(data);
        });

        await new Promise((resolve) => setTimeout(resolve, 800));
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsReady(true);
      }
    };

    loadData();
    return () => {
      if (unsubProgress) unsubProgress();
    };
  }, []);

  // Hero Entrance Animation
  useLayoutEffect(() => {
    if (!isReady) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
      });

      tl.fromTo(
        ".bg-blob",
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 0.7, duration: 1.5, stagger: 0.2 },
        0,
      );

      tl.fromTo(
        ".hero-badge",
        { opacity: 0, y: 20, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "back.out(1.7)" },
        0.3,
      );

      tl.fromTo(
        ".hero-title-line",
        { opacity: 0, y: 50, rotateX: -40 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 1,
          stagger: 0.12,
          ease: "power3.out",
        },
        0.4,
      );

      tl.fromTo(
        ".hero-name",
        { opacity: 0, scale: 1.1, filter: "blur(20px)" },
        {
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          duration: 1,
          ease: "power2.out",
        },
        0.6,
      );

      tl.fromTo(
        ".hero-subtitle",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8 },
        0.8,
      );

      tl.fromTo(
        ".hero-btn",
        { opacity: 0, y: 20, scale: 0.8 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "back.out(1.7)",
        },
        1,
      );

      tl.fromTo(
        ".hero-card",
        { opacity: 0, x: 80, rotateY: -15 },
        { opacity: 1, x: 0, rotateY: 0, duration: 1.2, ease: "power3.out" },
        0.5,
      );
    }, homeRef);

    return () => ctx.revert();
  }, [isReady]);

  // Scroll Animations
  useLayoutEffect(() => {
    if (!isReady) return;

    scrollTriggersRef.current.forEach((st) => st.kill());
    scrollTriggersRef.current = [];

    const ctx = gsap.context(() => {
      const revealElements = gsap.utils.toArray(".reveal-on-scroll");

      revealElements.forEach((el) => {
        el.classList.add("reveal-hidden");

        const st = ScrollTrigger.create({
          trigger: el,
          start: "top 85%",
          once: true,
          onEnter: () => {
            el.classList.remove("reveal-hidden");
            el.classList.add("reveal-visible");
          },
        });
        scrollTriggersRef.current.push(st);
      });

      const progressBars = gsap.utils.toArray(".progress-bar");
      progressBars.forEach((bar) => {
        const width = bar.getAttribute("data-width");
        const st = ScrollTrigger.create({
          trigger: bar,
          start: "top 90%",
          once: true,
          onEnter: () => {
            gsap.to(bar, {
              width: `${width}%`,
              duration: 1.2,
              ease: "power2.out",
            });
          },
        });
        scrollTriggersRef.current.push(st);
      });

      const staggerGroups = gsap.utils.toArray(".stagger-group");
      staggerGroups.forEach((group) => {
        const items = group.querySelectorAll(".stagger-item");
        items.forEach((item, i) => {
          item.style.transitionDelay = `${i * 0.08}s`;
        });

        const st = ScrollTrigger.create({
          trigger: group,
          start: "top 80%",
          once: true,
          onEnter: () => {
            group.classList.add("stagger-visible");
          },
        });
        scrollTriggersRef.current.push(st);
      });
    });

    return () => {
      ctx.revert();
      scrollTriggersRef.current.forEach((st) => st.kill());
      scrollTriggersRef.current = [];
    };
  }, [isReady]);

  // Active section detection
  useEffect(() => {
    let rafId = null;
    let lastScrollPos = 0;
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;

      rafId = requestAnimationFrame(() => {
        const scrollPos = window.scrollY + window.innerHeight / 3;

        if (Math.abs(scrollPos - lastScrollPos) < 50) {
          ticking = false;
          return;
        }
        lastScrollPos = scrollPos;

        const sections = [
          { id: "home", ref: homeRef.current },
          { id: "about", ref: aboutRef.current },
          { id: "progress", ref: progressRef.current },
          { id: "projects", ref: projectsRef.current },
          { id: "skills", ref: skillsRef.current },
          { id: "experience", ref: experienceRef.current },
          { id: "contact", ref: contactRef.current },
        ];

        for (const s of sections) {
          if (s.ref) {
            const offsetTop = s.ref.offsetTop;
            const offsetHeight = s.ref.offsetHeight;
            if (
              scrollPos >= offsetTop &&
              scrollPos < offsetTop + offsetHeight
            ) {
              if (activeSection !== s.id) {
                setActiveSection(s.id);
              }
              break;
            }
          }
        }
        ticking = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [activeSection]);

  const scrollTo = useCallback((ref) => {
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const handleNav = useCallback(
    (id) => {
      const map = {
        home: homeRef,
        about: aboutRef,
        progress: progressRef,
        projects: projectsRef,
        skills: skillsRef,
        experience: experienceRef,
        contact: contactRef,
      };
      scrollTo(map[id]);
    },
    [scrollTo],
  );

  const getLevel = (p) =>
    p < 40 ? "Learning" : p < 75 ? "Intermediate" : "Advanced";

  const getColor = (p) =>
    p < 40
      ? "from-red-500 to-orange-500"
      : p < 75
        ? "from-yellow-500 to-orange-500"
        : "from-green-500 to-emerald-500";

  const getProjectColor = (category) => {
    const colors = {
      "Web App": "#8b5cf6",
      Website: "#3b82f6",
      Mobile: "#10b981",
      "AI/ML": "#f59e0b",
      Design: "#ec4899",
    };
    return colors[category] || "#8b5cf6";
  };

  const getColorClass = (color) => {
    const colorMap = {
      blue: "bg-gradient-to-r from-blue-500 to-cyan-500",
      purple: "bg-gradient-to-r from-purple-500 to-pink-500",
      pink: "bg-gradient-to-r from-pink-500 to-rose-500",
      green: "bg-gradient-to-r from-green-500 to-emerald-500",
      yellow: "bg-gradient-to-r from-yellow-500 to-amber-500",
      red: "bg-gradient-to-r from-red-500 to-orange-500",
      gray: "bg-gradient-to-r from-gray-500 to-gray-600",
    };
    return colorMap[color] || "bg-gradient-to-r from-blue-500 to-cyan-500";
  };

  const navItems = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "progress", label: "Progress" },
    { id: "projects", label: "Projects" },
    { id: "skills", label: "Skills" },
    { id: "experience", label: "Experience" },
    { id: "contact", label: "Contact" },
  ];

  const home = pageContent.home || defaultContent.home;
  const about = pageContent.about || defaultContent.about;
  const skills = pageContent.skills || defaultContent.skills;
  const experience = pageContent.experience || defaultContent.experience;
  const contact = pageContent.contact || defaultContent.contact;
  const projectsContent = pageContent.projects || defaultContent.projects;

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(formRef.current);
    console.log("Form submitted:", Object.fromEntries(formData));
  };

  if (!isReady) {
    return <LoadingScreen isLoading={!isReady} />;
  }

  return (
    <div
      className={`w-full min-h-screen overflow-x-hidden selection:bg-purple-500/30 selection:text-purple-200 font-sans relative ${isDark ? "dark bg-gray-900" : "light bg-white"}`}
    >
      {/* Aurora Background */}
      <AuroraBackground />

      {/* Floating Particles */}
      <FloatingParticles />

      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          activeSection !== "home"
            ? isDark
              ? "bg-gray-900/80 border-b border-gray-800/50"
              : "bg-white border-b border-gray-200"
            : isDark
              ? "bg-transparent"
              : "bg-white"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14">
            <button
              onClick={() => handleNav("home")}
              className={`text-base font-bold bg-clip-text text-transparent transition-all flex items-center gap-2 nav-logo ${
                isDark
                  ? "bg-gradient-to-r from-white to-gray-400 hover:from-purple-400 hover:to-pink-400"
                  : "bg-gradient-to-r from-gray-900 to-gray-600 hover:from-purple-600 hover:to-pink-600"
              }`}
            >
              <svg
                className={`w-5 h-5 ${isDark ? "stroke-white" : "stroke-gray-900"}`}
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            </button>

            <div className="hidden md:flex items-center gap-0.5">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`nav-item relative px-3 py-1.5 text-xs font-medium transition-all duration-300 rounded-md ${
                    activeSection === item.id
                      ? isDark
                        ? "text-purple-400 bg-purple-500/10"
                        : "text-purple-600 bg-purple-500/10"
                      : isDark
                        ? "text-gray-400 hover:text-white hover:bg-white/5"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <ThemeToggle isDark={isDark} toggle={toggleTheme} />
              <a
                href="/admin/login"
                className={`admin-link hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md transition-all border ${
                  isDark
                    ? "text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 border-transparent hover:border-gray-700"
                    : "text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 border-transparent hover:border-gray-300"
                }`}
              >
                <span>Admin</span>
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        <div
          className={`md:hidden fixed bottom-0 left-0 right-0 backdrop-blur-xl border-t safe-area-pb z-50 mobile-nav ${
            isDark
              ? "bg-gray-900/95 border-gray-800/50"
              : "bg-white/95 border-gray-200/50"
          }`}
        >
          <div className="flex justify-around py-2 px-2">
            {navItems.slice(0, 5).map((item) => (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-md transition-all duration-300 ${
                  activeSection === item.id
                    ? isDark
                      ? "text-purple-400 scale-110"
                      : "text-purple-600 scale-110"
                    : isDark
                      ? "text-gray-500"
                      : "text-gray-400"
                }`}
              >
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Home Section */}
      <section
        ref={homeRef}
        id="home"
        className="min-h-screen flex items-center pt-16 relative overflow-hidden"
      >
        <div className="bg-blob absolute top-32 left-20 w-96 h-96 bg-purple-500/30 rounded-full blur-[100px]" />
        <div className="bg-blob absolute bottom-32 right-20 w-[500px] h-[500px] bg-pink-500/20 rounded-full blur-[120px]" />
        <div className="bg-blob absolute top-1/2 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-violet-500/15 rounded-full blur-[150px]" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="perspective-1000">
              <span
                className={`hero-badge inline-flex items-center gap-1.5 px-4 py-2 border rounded-full text-xs mb-6 backdrop-blur-sm ${
                  isDark
                    ? "bg-purple-500/10 border-purple-500/20 text-purple-400"
                    : "bg-purple-100 border-purple-200 text-purple-600"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full animate-pulse ${isDark ? "bg-purple-400" : "bg-purple-600"}`}
                />
                {home.badge}
              </span>

              <h1
                className={`hero-title text-4xl md:text-5xl lg:text-7xl font-bold mb-6 leading-tight ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
                style={{ perspective: "1000px" }}
              >
                <span className="hero-title-line block">{home.title}</span>
                <span className="hero-title-line block">
                  <span className="hero-name inline-block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-violet-400">
                    <ScrambleText text={home.highlightName} delay={0.5} />
                  </span>
                </span>
              </h1>

              <p
                className={`hero-subtitle text-lg md:text-xl mb-8 max-w-lg leading-relaxed ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {home.subtitle}
              </p>

              <div className="flex flex-wrap gap-4">
                <MagneticButton
                  onClick={() => handleNav("projects")}
                  className="hero-btn px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-full text-sm font-semibold shadow-lg shadow-purple-600/30 hover:shadow-purple-600/50 transition-all hover:scale-105 active:scale-95"
                >
                  {home.primaryButton}
                </MagneticButton>
                <MagneticButton
                  onClick={() => handleNav("contact")}
                  className={`hero-btn px-8 py-3 border rounded-full text-sm font-semibold transition-all hover:scale-105 active:scale-95 ${
                    isDark
                      ? "border-gray-600 hover:border-purple-500 text-white hover:bg-purple-500/10"
                      : "border-gray-300 hover:border-purple-500 text-gray-900 hover:bg-purple-50"
                  }`}
                >
                  {home.secondaryButton}
                </MagneticButton>
              </div>

              <div
                className={`mt-16 hidden lg:flex items-center gap-2 text-sm scroll-indicator ${
                  isDark ? "text-gray-500" : "text-gray-400"
                }`}
              >
                <span>Scroll to explore</span>
                <svg
                  className="w-5 h-5 animate-bounce"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </div>
            </div>

            <div className="hero-card hidden lg:flex justify-center items-center perspective-1000">
              <ProfileCard
                avatarUrl="/img/me.jpeg"
                name="Nobedes"
                title="Frontend Developer"
                handle="nobedev"
                status="Available for work"
                contactText="Hire Me"
                onContactClick={() => handleNav("contact")}
                behindGlowEnabled={true}
                behindGlowColor="rgba(139, 92, 246, 0.5)"
                behindGlowSize="70%"
                enableTilt={true}
                showUserInfo={true}
              />
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section
        ref={aboutRef}
        id="about"
        className="py-24 relative flex items-center overflow-hidden"
      >
        <div className="parallax-slow absolute top-32 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-[100px]" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="mb-16 reveal-on-scroll">
            <span
              className={`section-badge inline-block px-4 py-1.5 rounded-full text-xs font-medium mb-4 border ${
                isDark
                  ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                  : "bg-purple-100 text-purple-600 border-purple-200"
              }`}
            >
              01. About
            </span>
            <h2
              className={`section-title text-3xl md:text-5xl font-bold mb-4 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
              style={{ perspective: "1000px" }}
            >
              {about.title?.split(" ")[0] || "About"}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                {about.title?.split(" ")[1] || "Me"}
              </span>
            </h2>
            <p
              className={`text-base max-w-xl ${isDark ? "text-gray-400" : "text-gray-600"}`}
            >
              {about.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 stagger-group">
            <div
              className={`stagger-item md:col-span-2 backdrop-blur-md p-8 rounded-3xl transition-all duration-500 border card-hover ${
                isDark
                  ? "bg-gray-800/30 hover:bg-gray-800/50 border-gray-700/50 hover:border-purple-500/30"
                  : "bg-white/50 hover:bg-white/80 border-gray-200/50 hover:border-purple-300/50 shadow-lg"
              }`}
            >
              <h3
                className={`text-xl font-bold mb-4 transition-colors ${
                  isDark
                    ? "text-white group-hover:text-purple-400"
                    : "text-gray-900 group-hover:text-purple-600"
                }`}
              >
                {about.heading}
              </h3>
              <p
                className={`leading-relaxed mb-6 ${isDark ? "text-gray-400" : "text-gray-600"}`}
              >
                {about.description}
              </p>
              <div className="flex flex-wrap gap-3">
                <span
                  className={`tag-pulse px-4 py-2 rounded-full text-xs cursor-default transition-colors ${
                    isDark
                      ? "bg-purple-500/10 text-purple-400 border border-purple-500/20 hover:bg-purple-500/20"
                      : "bg-purple-100 text-purple-600 border border-purple-200 hover:bg-purple-200"
                  }`}
                >
                  {about.tag1}
                </span>
                <span
                  className={`tag-pulse px-4 py-2 rounded-full text-xs cursor-default transition-colors ${
                    isDark
                      ? "bg-pink-500/10 text-pink-400 border border-pink-500/20 hover:bg-pink-500/20"
                      : "bg-pink-100 text-pink-600 border border-pink-200 hover:bg-pink-200"
                  }`}
                >
                  {about.tag2}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="stagger-item stat-card bg-gradient-to-br from-purple-600 to-pink-600 p-6 rounded-2xl text-center shadow-lg shadow-purple-600/20 hover:shadow-purple-600/30 transition-all">
                <div className="text-4xl font-bold text-white mb-1">
                  {about.stat1?.value}
                </div>
                <div className="text-white/80 text-xs">
                  {about.stat1?.label}
                </div>
              </div>
              <div
                className={`stagger-item stat-card backdrop-blur-md p-6 rounded-2xl text-center border transition-all ${
                  isDark
                    ? "bg-gray-800/30 border-gray-700/50 hover:border-purple-500/30"
                    : "bg-white/50 border-gray-200/50 hover:border-purple-300/50 shadow-md"
                }`}
              >
                <div
                  className={`text-4xl font-bold mb-1 ${isDark ? "text-purple-400" : "text-purple-600"}`}
                >
                  {about.stat2?.value}
                </div>
                <div className={isDark ? "text-gray-400" : "text-gray-500"}>
                  {about.stat2?.label}
                </div>
              </div>
              <div
                className={`stagger-item stat-card backdrop-blur-md p-6 rounded-2xl text-center border transition-all ${
                  isDark
                    ? "bg-gray-800/30 border-gray-700/50 hover:border-pink-500/30"
                    : "bg-white/50 border-gray-200/50 hover:border-pink-300/50 shadow-md"
                }`}
              >
                <div
                  className={`text-4xl font-bold mb-1 ${isDark ? "text-pink-400" : "text-pink-600"}`}
                >
                  {about.stat3?.value}
                </div>
                <div className={isDark ? "text-gray-400" : "text-gray-500"}>
                  {about.stat3?.label}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Progress Section */}
      <section
        ref={progressRef}
        id="progress"
        className="py-24 relative flex items-center overflow-hidden"
      >
        <div className="parallax-slow absolute bottom-32 left-10 w-72 h-72 bg-pink-500/20 rounded-full blur-[100px]" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 reveal-on-scroll">
            <div>
              <span
                className={`section-badge inline-block px-4 py-1.5 rounded-full text-xs font-medium mb-4 border ${
                  isDark
                    ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                    : "bg-purple-100 text-purple-600 border-purple-200"
                }`}
              >
                02. Progress
              </span>
              <h2
                className={`section-title text-3xl md:text-5xl font-bold mb-4 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Learning{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                  Progress
                </span>
              </h2>
              <p className={isDark ? "text-gray-400" : "text-gray-600"}>
                My skills development journey
              </p>
            </div>
            <div className="hidden md:block text-right stat-counter">
              <div
                className={`text-4xl font-bold ${isDark ? "text-purple-400" : "text-purple-600"}`}
              >
                {progressData.length}
              </div>
              <div className={isDark ? "text-gray-400" : "text-gray-500"}>
                Skills Tracked
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 stagger-group">
            {progressData.length > 0 ? (
              progressData.map((item, i) => {
                const level = getLevel(item.percentage);
                const color = getColor(item.percentage);
                return (
                  <div
                    key={item.id || i}
                    className={`stagger-item skill-card group backdrop-blur-md p-6 rounded-2xl transition-all border ${
                      isDark
                        ? "bg-gray-800/30 hover:bg-gray-800/50 border-gray-700/50 hover:border-purple-500/30"
                        : "bg-white/50 hover:bg-white/80 border-gray-200/50 hover:border-purple-300/50 shadow-md"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-3">
                        <span
                          className={`skill-icon w-10 h-10 rounded-xl flex items-center justify-center text-lg ${getColorClass(item.color)} bg-opacity-20 text-white`}
                        >
                          {item.emoji || "📈"}
                        </span>
                        <div>
                          <span
                            className={`font-medium text-sm block ${isDark ? "text-white" : "text-gray-900"}`}
                          >
                            {item.title}
                          </span>
                          <span
                            className={
                              isDark ? "text-gray-500" : "text-gray-400"
                            }
                          >
                            {level}
                          </span>
                        </div>
                      </div>
                      <span
                        className={`text-lg font-bold bg-gradient-to-r ${color} bg-clip-text text-transparent`}
                      >
                        {item.percentage}%
                      </span>
                    </div>
                    <div className="relative h-2.5 bg-gray-700/50 rounded-full overflow-hidden">
                      <div
                        className={`progress-bar absolute inset-y-0 left-0 bg-gradient-to-r ${color} rounded-full`}
                        data-width={item.percentage}
                        style={{ width: "0%" }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <div
                className={`md:col-span-2 text-center py-12 rounded-2xl border border-dashed stagger-item ${
                  isDark
                    ? "text-gray-400 bg-gray-800/20 border-gray-700"
                    : "text-gray-500 bg-gray-100/50 border-gray-300"
                }`}
              >
                <p>No progress data yet. Add some from the admin dashboard!</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section
        ref={projectsRef}
        id="projects"
        className="py-24 relative flex items-center overflow-hidden"
      >
        <div className="parallax-slow absolute top-40 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px]" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="mb-12 text-center reveal-on-scroll">
            <span
              className={`section-badge inline-block px-4 py-1.5 rounded-full text-xs font-medium mb-4 border ${
                isDark
                  ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                  : "bg-purple-100 text-purple-600 border-purple-200"
              }`}
            >
              03. Projects
            </span>
            <h2
              className={`section-title text-3xl md:text-5xl font-bold mb-4 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {projectsContent.title?.split(" ")[0] || "My"}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                {projectsContent.title?.split(" ").slice(1).join(" ") ||
                  "Projects"}
              </span>
            </h2>
            <p className={isDark ? "text-gray-400" : "text-gray-600"}>
              {projectsContent.subtitle}
            </p>
          </div>

          {projects.length > 0 ? (
            <div className="reveal-on-scroll">
              <ChromaGrid
                items={projects.map((p) => ({
                  image: p.image?.startsWith("/img/")
                    ? p.image
                    : p.image &&
                        !p.image.startsWith("http") &&
                        !p.image.includes("🚀")
                      ? `https://placehold.co/600x400/1e1e23/6b7280?text=${encodeURIComponent(p.title)}`
                      : p.image ||
                        `https://placehold.co/600x400/1e1e23/6b7280?text=${encodeURIComponent(p.title)}`,
                  title: p.title,
                  subtitle: p.category || "Web App",
                  handle: Array.isArray(p.tech) ? p.tech[0] : p.tech || "React",
                  borderColor: getProjectColor(p.category),
                  gradient: `linear-gradient(145deg, ${getProjectColor(p.category)}, #000)`,
                  url: p.link || "#",
                }))}
                columns={3}
                rows={2}
                radius={200}
              />
            </div>
          ) : (
            <div
              className={`text-center py-20 rounded-2xl border border-dashed reveal-on-scroll ${
                isDark
                  ? "text-gray-400 bg-gray-800/20 border-gray-700"
                  : "text-gray-500 bg-gray-100/50 border-gray-300"
              }`}
            >
              <span className="text-4xl mb-4 block">📂</span>
              <p>No projects yet. Add some from the admin dashboard!</p>
            </div>
          )}
        </div>
      </section>

      {/* Skills Section */}
      <section
        ref={skillsRef}
        id="skills"
        className="py-24 relative flex items-center overflow-hidden"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="mb-12 text-center reveal-on-scroll">
            <span
              className={`section-badge inline-block px-4 py-1.5 rounded-full text-xs font-medium mb-4 border ${
                isDark
                  ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                  : "bg-purple-100 text-purple-600 border-purple-200"
              }`}
            >
              04. Skills
            </span>
            <h2
              className={`section-title text-3xl md:text-4xl font-bold mb-4 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {skills.title?.split(" ")[0] || "Tech"}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                {skills.title?.split(" ").slice(1).join(" ") || "Stack"}
              </span>
            </h2>
            <p className={isDark ? "text-gray-400" : "text-gray-600"}>
              {skills.subtitle}
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-10 stagger-group">
            {(skills.items || []).map((skill) => {
              const progressItem = progressData.find(
                (p) => p.title.toLowerCase() === skill.name.toLowerCase(),
              );
              const percentage = progressItem?.percentage || 0;

              return (
                <div
                  key={skill.name}
                  className={`stagger-item skill-tag group relative px-4 py-3 rounded-xl border transition-all hover:-translate-y-1 ${
                    isDark
                      ? "bg-gray-800/30 backdrop-blur-md border-gray-700/50 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10"
                      : "bg-white/50 backdrop-blur-md border-gray-200/50 hover:border-purple-300/50 hover:shadow-lg hover:shadow-purple-500/10"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {skill.image ? (
                      <img
                        src={skill.image}
                        alt={skill.name}
                        className="w-5 h-5 object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                        loading="lazy"
                      />
                    ) : (
                      <span className="text-base grayscale group-hover:grayscale-0 transition-all duration-300">
                        {skill.icon}
                      </span>
                    )}
                    <div className="flex flex-col">
                      <span
                        className={`text-sm font-medium group-hover:text-white transition-colors ${
                          isDark ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {skill.name}
                      </span>
                      <span className="text-xs text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {percentage > 0 ? `${percentage}%` : skill.level}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto stagger-group">
            {(skills.items || []).slice(0, 8).map((skill) => (
              <div
                key={`level-${skill.name}`}
                className={`stagger-item skill-level-card text-center p-4 rounded-xl border transition-all hover:scale-105 ${
                  isDark
                    ? "bg-gray-800/20 border-gray-700/30 hover:border-purple-500/30"
                    : "bg-white/30 border-gray-200/50 hover:border-purple-300/50 shadow-sm"
                }`}
              >
                <div
                  className={`text-sm font-medium mb-2 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {skill.name}
                </div>
                <div className="h-2 bg-gray-700/50 rounded-full overflow-hidden mb-2">
                  <div
                    className={`h-full ${getColorClass(skill.color)} rounded-full transition-all duration-1000 skill-bar`}
                    style={{
                      width:
                        skill.level === "Advanced"
                          ? "90%"
                          : skill.level === "Intermediate"
                            ? "70%"
                            : "50%",
                    }}
                  />
                </div>
                <div
                  className={
                    isDark ? "text-xs text-gray-500" : "text-xs text-gray-400"
                  }
                >
                  {skill.level}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section
        ref={experienceRef}
        id="experience"
        className="py-24 relative flex items-center overflow-hidden"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid lg:grid-cols-5 gap-16 items-start">
            <div className="lg:col-span-3">
              <div className="mb-12 reveal-on-scroll">
                <span
                  className={`section-badge inline-block px-4 py-1.5 rounded-full text-xs font-medium mb-4 border ${
                    isDark
                      ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                      : "bg-purple-100 text-purple-600 border-purple-200"
                  }`}
                >
                  05. Journey
                </span>
                <h2
                  className={`section-title text-3xl md:text-4xl font-bold mb-4 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {experience.title?.split(" ").slice(0, 2).join(" ") ||
                    "Experience"}{" "}
                  &{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                    {experience.title?.split(" ").slice(2).join(" ") ||
                      "Education"}
                  </span>
                </h2>
                <p className={isDark ? "text-gray-400" : "text-gray-600"}>
                  {experience.subtitle || "My professional journey so far"}
                </p>
              </div>

              <div className="relative stagger-group">
                <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500/50 via-pink-500/50 to-transparent timeline-line" />
                <div className="space-y-8">
                  {(experience.items || []).length > 0 ? (
                    (experience.items || []).map((item, index) => (
                      <div
                        key={index}
                        className="stagger-item timeline-item relative flex gap-4 group"
                      >
                        <div className="relative z-10 flex-shrink-0">
                          <div
                            className={`timeline-dot w-10 h-10 rounded-full flex items-center justify-center text-sm border-2 transition-all duration-300 ${
                              index === 0
                                ? "bg-purple-500 border-purple-500 text-white shadow-lg shadow-purple-500/30"
                                : isDark
                                  ? "bg-gray-800 border-gray-600 text-gray-400 group-hover:border-purple-500 group-hover:text-purple-400"
                                  : "bg-white border-gray-300 text-gray-500 group-hover:border-purple-500 group-hover:text-purple-600"
                            }`}
                          >
                            {index === 0 ? "★" : index + 1}
                          </div>
                        </div>
                        <div
                          className={`flex-1 backdrop-blur-md p-5 rounded-2xl border transition-all hover:translate-x-2 card-hover ${
                            isDark
                              ? "bg-gray-800/30 border-gray-700/30 hover:border-purple-500/30"
                              : "bg-white/50 border-gray-200/50 hover:border-purple-300/50 shadow-md"
                          }`}
                        >
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className="text-purple-400 text-xs font-semibold bg-purple-500/10 px-3 py-1 rounded-full">
                              {item.period}
                            </span>
                            {index === 0 && (
                              <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full border border-green-500/30">
                                Current
                              </span>
                            )}
                          </div>
                          <h3
                            className={`text-lg font-bold mb-1 transition-colors ${
                              isDark
                                ? "text-white group-hover:text-purple-400"
                                : "text-gray-900 group-hover:text-purple-600"
                            }`}
                          >
                            {item.title}
                          </h3>
                          <p
                            className={
                              isDark
                                ? "text-gray-400 text-sm mb-2"
                                : "text-gray-600 text-sm mb-2"
                            }
                          >
                            {item.company}
                          </p>
                          {item.desc && (
                            <p
                              className={
                                isDark
                                  ? "text-gray-500 text-sm leading-relaxed"
                                  : "text-gray-500 text-sm leading-relaxed"
                              }
                            >
                              {item.desc}
                            </p>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div
                      className={`stagger-item p-8 rounded-2xl border border-dashed text-center ml-12 ${
                        isDark
                          ? "text-gray-400 bg-gray-800/20 border-gray-700"
                          : "text-gray-500 bg-gray-100/50 border-gray-300"
                      }`}
                    >
                      <span className="text-3xl mb-3 block">🎓</span>
                      <p>No experience added yet.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 lg:sticky lg:top-24">
              <div
                className={`reveal-on-scroll aspect-square max-w-sm mx-auto rounded-3xl flex items-center justify-center border relative overflow-hidden group transition-all duration-500 floating-card ${
                  isDark
                    ? "bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20 hover:border-purple-500/40"
                    : "bg-gradient-to-br from-purple-100 to-pink-100 border-purple-200 hover:border-purple-300 shadow-lg"
                }`}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                    isDark ? "" : "from-purple-500/10 to-pink-500/10"
                  }`}
                />
                <div className="text-center relative z-10 p-8">
                  <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-3xl shadow-lg shadow-purple-500/30 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">
                    🚀
                  </div>
                  <div
                    className={`font-bold text-xl mb-2 ${isDark ? "text-white" : "text-gray-900"}`}
                  >
                    Keep Growing
                  </div>
                  <div
                    className={
                      isDark ? "text-gray-400 text-sm" : "text-gray-600 text-sm"
                    }
                  >
                    Every day is a new opportunity to learn
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        ref={contactRef}
        id="contact"
        className="py-24 relative flex items-center overflow-hidden"
      >
        <div className="parallax-slow absolute top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-[100px]" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="text-center mb-12 reveal-on-scroll">
            <span
              className={`section-badge inline-block px-4 py-1.5 rounded-full text-xs font-medium mb-4 border ${
                isDark
                  ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                  : "bg-purple-100 text-purple-600 border-purple-200"
              }`}
            >
              06. Contact
            </span>
            <h2
              className={`section-title text-3xl md:text-5xl font-bold mb-4 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {contact.title?.split(" ").slice(0, 2).join(" ") || "Get In"}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                {contact.title?.split(" ").slice(2).join(" ") || "Touch"}
              </span>
            </h2>
            <p
              className={`text-base max-w-2xl mx-auto ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {contact.subtitle}
            </p>
          </div>

          <div className="grid lg:grid-cols-5 gap-8 items-start">
            <div className="lg:col-span-2 space-y-4 stagger-group">
              <div
                className={`stagger-item contact-card group backdrop-blur-md p-5 rounded-2xl flex items-center gap-4 transition-all border ${
                  isDark
                    ? "bg-gray-800/30 hover:bg-gray-800/50 border-gray-700/50 hover:border-purple-500/30"
                    : "bg-white/50 hover:bg-white/80 border-gray-200/50 hover:border-purple-300/50 shadow-md"
                }`}
              >
                <div
                  className={`contact-icon w-12 h-12 rounded-xl flex items-center justify-center border transition-all flex-shrink-0 ${
                    isDark
                      ? "bg-purple-500/10 border-purple-500/20 group-hover:bg-purple-500/20"
                      : "bg-purple-100 border-purple-200 group-hover:bg-purple-200"
                  }`}
                >
                  <svg
                    className={`w-5 h-5 ${isDark ? "text-purple-400" : "text-purple-600"}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p
                    className={
                      isDark
                        ? "text-gray-500 text-xs mb-1"
                        : "text-gray-400 text-xs mb-1"
                    }
                  >
                    Email
                  </p>
                  <a
                    href={`mailto:${contact.email}`}
                    className={`font-medium text-sm truncate block transition-colors ${
                      isDark
                        ? "text-white group-hover:text-purple-400"
                        : "text-gray-900 group-hover:text-purple-600"
                    }`}
                  >
                    {contact.email}
                  </a>
                </div>
              </div>

              <div
                className={`stagger-item contact-card group backdrop-blur-md p-5 rounded-2xl flex items-center gap-4 transition-all border ${
                  isDark
                    ? "bg-gray-800/30 hover:bg-gray-800/50 border-gray-700/50 hover:border-pink-500/30"
                    : "bg-white/50 hover:bg-white/80 border-gray-200/50 hover:border-pink-300/50 shadow-md"
                }`}
              >
                <div
                  className={`contact-icon w-12 h-12 rounded-xl flex items-center justify-center border transition-all flex-shrink-0 ${
                    isDark
                      ? "bg-pink-500/10 border-pink-500/20 group-hover:bg-pink-500/20"
                      : "bg-pink-100 border-pink-200 group-hover:bg-pink-200"
                  }`}
                >
                  <svg
                    className={`w-5 h-5 ${isDark ? "text-pink-400" : "text-pink-600"}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <div>
                  <p
                    className={
                      isDark
                        ? "text-gray-500 text-xs mb-1"
                        : "text-gray-400 text-xs mb-1"
                    }
                  >
                    Phone
                  </p>
                  <a
                    href={`tel:${contact.phone}`}
                    className={`font-medium text-sm transition-colors ${
                      isDark
                        ? "text-white group-hover:text-pink-400"
                        : "text-gray-900 group-hover:text-pink-600"
                    }`}
                  >
                    {contact.phone}
                  </a>
                </div>
              </div>

              <div
                className={`stagger-item contact-card group backdrop-blur-md p-5 rounded-2xl flex items-center gap-4 transition-all border ${
                  isDark
                    ? "bg-gray-800/30 hover:bg-gray-800/50 border-gray-700/50 hover:border-purple-500/30"
                    : "bg-white/50 hover:bg-white/80 border-gray-200/50 hover:border-purple-300/50 shadow-md"
                }`}
              >
                <div
                  className={`contact-icon w-12 h-12 rounded-xl flex items-center justify-center border transition-all flex-shrink-0 ${
                    isDark
                      ? "bg-purple-500/10 border-purple-500/20 group-hover:bg-purple-500/20"
                      : "bg-purple-100 border-purple-200 group-hover:bg-purple-200"
                  }`}
                >
                  <svg
                    className={`w-5 h-5 ${isDark ? "text-purple-400" : "text-purple-600"}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p
                    className={
                      isDark
                        ? "text-gray-500 text-xs mb-1"
                        : "text-gray-400 text-xs mb-1"
                    }
                  >
                    Location
                  </p>
                  <p
                    className={`font-medium text-sm transition-colors ${
                      isDark
                        ? "text-white group-hover:text-purple-400"
                        : "text-gray-900 group-hover:text-purple-600"
                    }`}
                  >
                    {contact.location}
                  </p>
                </div>
              </div>

              <div className="stagger-item pt-4">
                <p
                  className={
                    isDark
                      ? "text-gray-500 text-xs mb-3"
                      : "text-gray-400 text-xs mb-3"
                  }
                >
                  Follow me on
                </p>
                <div className="flex flex-wrap gap-2">
                  {(contact.socials || []).map((s) => (
                    <a
                      key={s}
                      href="#"
                      className={`social-link px-4 py-2 rounded-xl text-xs transition-all hover:scale-105 active:scale-95 ${
                        isDark
                          ? "bg-gray-800/30 hover:bg-gray-700/60 text-gray-400 hover:text-white border border-gray-700/50 hover:border-purple-500/30"
                          : "bg-white/50 hover:bg-gray-100 text-gray-600 hover:text-gray-900 border border-gray-200/50 hover:border-purple-300/50 shadow-sm"
                      }`}
                    >
                      {s}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-3 reveal-on-scroll">
              <form
                ref={formRef}
                className={`contact-form backdrop-blur-md p-8 rounded-2xl border shadow-xl ${
                  isDark
                    ? "bg-gray-800/30 border-gray-700/50"
                    : "bg-white/50 border-gray-200/50"
                }`}
                onSubmit={handleSubmit}
              >
                <div className="grid md:grid-cols-2 gap-5 mb-5">
                  <div className="form-group group">
                    <label
                      className={`block text-xs mb-2 font-medium transition-colors ${
                        isDark
                          ? "text-gray-400 group-focus-within:text-purple-400"
                          : "text-gray-500 group-focus-within:text-purple-600"
                      }`}
                    >
                      Your Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      className={`form-input w-full px-4 py-3 border rounded-xl text-sm placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all hover:border-gray-600 ${
                        isDark
                          ? "bg-gray-900/50 border-gray-700/50 text-white"
                          : "bg-white/80 border-gray-300/50 text-gray-900"
                      }`}
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="form-group group">
                    <label
                      className={`block text-xs mb-2 font-medium transition-colors ${
                        isDark
                          ? "text-gray-400 group-focus-within:text-purple-400"
                          : "text-gray-500 group-focus-within:text-purple-600"
                      }`}
                    >
                      Your Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      className={`form-input w-full px-4 py-3 border rounded-xl text-sm placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all hover:border-gray-600 ${
                        isDark
                          ? "bg-gray-900/50 border-gray-700/50 text-white"
                          : "bg-white/80 border-gray-300/50 text-gray-900"
                      }`}
                      placeholder="john@email.com"
                    />
                  </div>
                </div>

                <div className="form-group group mb-5">
                  <label
                    className={`block text-xs mb-2 font-medium transition-colors ${
                      isDark
                        ? "text-gray-400 group-focus-within:text-purple-400"
                        : "text-gray-500 group-focus-within:text-purple-600"
                    }`}
                  >
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    required
                    className={`form-input w-full px-4 py-3 border rounded-xl text-sm placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all hover:border-gray-600 ${
                      isDark
                        ? "bg-gray-900/50 border-gray-700/50 text-white"
                        : "bg-white/80 border-gray-300/50 text-gray-900"
                    }`}
                    placeholder="Project inquiry"
                  />
                </div>

                <div className="form-group group mb-6">
                  <label
                    className={`block text-xs mb-2 font-medium transition-colors ${
                      isDark
                        ? "text-gray-400 group-focus-within:text-purple-400"
                        : "text-gray-500 group-focus-within:text-purple-600"
                    }`}
                  >
                    Message
                  </label>
                  <textarea
                    name="message"
                    rows={5}
                    required
                    className={`form-input w-full px-4 py-3 border rounded-xl text-sm placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 resize-none transition-all hover:border-gray-600 ${
                      isDark
                        ? "bg-gray-900/50 border-gray-700/50 text-white"
                        : "bg-white/80 border-gray-300/50 text-gray-900"
                    }`}
                    placeholder="Tell me about your project..."
                  />
                </div>

                <MagneticButton
                  type="submit"
                  className="submit-btn w-full py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-purple-600/25 hover:shadow-purple-600/40 flex items-center justify-center gap-2 group active:scale-[0.98]"
                >
                  <span>Send Message</span>
                  <svg
                    className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                </MagneticButton>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className={`py-10 px-4 border-t relative overflow-hidden ${
          isDark ? "border-gray-800/50" : "border-gray-200/50"
        }`}
      >
        <div
          className={`absolute inset-0 bg-gradient-to-t pointer-events-none ${
            isDark
              ? "from-purple-900/10 to-transparent"
              : "from-purple-100/50 to-transparent"
          }`}
        />
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 relative z-10">
          <p
            className={`text-sm text-center md:text-left ${
              isDark ? "text-gray-500" : "text-gray-500"
            }`}
          >
            © {new Date().getFullYear()}{" "}
            <span className="text-purple-400 font-semibold">
              {home.highlightName || "Nobe"}
            </span>
            . Built with React, Tailwind CSS, GSAP & ❤️
          </p>
          <div className="flex gap-8">
            {["Home", "Projects", "Contact"].map((item) => (
              <button
                key={item}
                onClick={() => handleNav(item.toLowerCase())}
                className={`footer-link text-sm transition-colors relative group ${
                  isDark
                    ? "text-gray-500 hover:text-purple-400"
                    : "text-gray-500 hover:text-purple-600"
                }`}
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-500 group-hover:w-full transition-all duration-300" />
              </button>
            ))}
          </div>
        </div>
      </footer>

      <div className="h-20 md:hidden" />
    </div>
  );
};

export default OnePage;
