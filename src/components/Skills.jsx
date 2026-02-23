import { useState } from "react";

const skills = [
  {
    name: "React",
    icon: "⚛️",
    color: "#61DAFB",
    description: "Modern UI development",
    level: 90,
  },
  {
    name: "JavaScript",
    icon: "🟨",
    color: "#F7DF1E",
    description: "ES6+ & TypeScript",
    level: 85,
  },
  {
    name: "Tailwind CSS",
    icon: "🎨",
    color: "#38B2AC",
    description: "Utility-first styling",
    level: 95,
  },
  {
    name: "Node.js",
    icon: "🟩",
    color: "#339933",
    description: "Backend runtime",
    level: 80,
  },
  {
    name: "Firebase",
    icon: "🔥",
    color: "#FFCA28",
    description: "Auth & Database",
    level: 85,
  },
  {
    name: "Git",
    icon: "📦",
    color: "#F05032",
    description: "Version control",
    level: 88,
  },
  {
    name: "Figma",
    icon: "🎯",
    color: "#F24E1E",
    description: "UI/UX Design",
    level: 75,
  },
  {
    name: "Python",
    icon: "🐍",
    color: "#3776AB",
    description: "Data & Automation",
    level: 70,
  },
];

const SkillCard = ({ skill }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative group p-6 bg-gray-800/50 rounded-2xl border border-gray-700 transition-all duration-500 cursor-pointer overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        boxShadow: isHovered ? `0 0 30px ${skill.color}30` : "none",
      }}
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at center, ${skill.color}20 0%, transparent 70%)`,
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Icon */}
        <div
          className="text-4xl mb-4 transform transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-1"
          style={{
            filter: isHovered ? "grayscale(0%)" : "grayscale(100%)",
            opacity: isHovered ? 1 : 0.6,
          }}
        >
          {skill.icon}
        </div>

        {/* Title */}
        <h3
          className="text-xl font-bold mb-2 transition-colors duration-500"
          style={{ color: isHovered ? skill.color : "#9CA3AF" }}
        >
          {skill.name}
        </h3>

        {/* Description */}
        <p className="text-gray-500 text-sm mb-4 group-hover:text-gray-400 transition-colors">
          {skill.description}
        </p>

        {/* Progress bar */}
        <div className="relative h-2 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out"
            style={{
              width: isHovered ? `${skill.level}%` : "0%",
              backgroundColor: skill.color,
              boxShadow: isHovered ? `0 0 10px ${skill.color}` : "none",
            }}
          />
        </div>

        {/* Level text */}
        <span
          className="text-xs mt-2 block transition-all duration-500"
          style={{
            color: isHovered ? skill.color : "transparent",
            transform: isHovered ? "translateY(0)" : "translateY(10px)",
            opacity: isHovered ? 1 : 0,
          }}
        >
          {skill.level}% Mastery
        </span>
      </div>

      {/* Border glow */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          border: `1px solid ${skill.color}50`,
        }}
      />
    </div>
  );
};

const Skills = () => {
  return (
    <section id="skills" className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            My{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              Skills
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Hover to reveal the colorful world of technologies I work with
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {skills.map((skill, index) => (
            <div
              key={skill.name}
              style={{
                animationDelay: `${index * 100}ms`,
              }}
              className="animate-fade-in-up"
            >
              <SkillCard skill={skill} />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </section>
  );
};

export default Skills;
