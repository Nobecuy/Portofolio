import { useState } from "react";

const Skills = () => {
  const [activeCategory, setActiveCategory] = useState("frontend");

  const skills = {
    frontend: [
      { name: "React", level: 90, icon: "⚛️", description: "Building interactive UIs with React ecosystem" },
      { name: "Vue.js", level: 85, icon: "💚", description: "Progressive framework for building UIs" },
      { name: "TypeScript", level: 80, icon: "📘", description: "Type-safe JavaScript development" },
      { name: "TailwindCSS", level: 95, icon: "🎨", description: "Utility-first CSS framework" },
      { name: "Next.js", level: 85, icon: "▲", description: "Full-stack React framework" },
      { name: "HTML/CSS", level: 95, icon: "🌐", description: "Semantic markup and modern CSS" }
    ],
    backend: [
      { name: "Node.js", level: 85, icon: "🟢", description: "JavaScript runtime for server-side development" },
      { name: "Express.js", level: 80, icon: "🚂", description: "Web framework for Node.js" },
      { name: "MongoDB", level: 75, icon: "🍃", description: "NoSQL database for modern applications" },
      { name: "PostgreSQL", level: 70, icon: "🐘", description: "Powerful relational database" },
      { name: "Firebase", level: 80, icon: "🔥", description: "Backend-as-a-Service platform" },
      { name: "REST APIs", level: 85, icon: "🔌", description: "Designing and implementing RESTful APIs" }
    ],
    tools: [
      { name: "Git", level: 90, icon: "📦", description: "Version control and collaboration" },
      { name: "Docker", level: 70, icon: "🐳", description: "Containerization and deployment" },
      { name: "VS Code", level: 95, icon: "💻", description: "Primary development environment" },
      { name: "Figma", level: 80, icon: "🎨", description: "UI/UX design and prototyping" },
      { name: "Webpack", level: 75, icon: "📦", description: "Module bundling and optimization" },
      { name: "npm/yarn", level: 90, icon: "📦", description: "Package management and scripts" }
    ],
    other: [
      { name: "UI/UX Design", level: 85, icon: "🎨", description: "User interface and experience design" },
      { name: "Responsive Design", level: 95, icon: "📱", description: "Mobile-first design principles" },
      { name: "Performance Optimization", level: 80, icon: "⚡", description: "Web performance and optimization" },
      { name: "Testing", level: 75, icon: "🧪", description: "Unit and integration testing" },
      { name: "Agile/Scrum", level: 85, icon: "🔄", description: "Project management methodologies" },
      { name: "Problem Solving", level: 90, icon: "🧩", description: "Analytical thinking and debugging" }
    ]
  };

  const categories = [
    { id: "frontend", name: "Frontend", icon: "🎨" },
    { id: "backend", name: "Backend", icon: "⚙️" },
    { id: "tools", name: "Tools", icon: "🔧" },
    { id: "other", name: "Other", icon: "📚" }
  ];

  const getProgressColor = (level) => {
    if (level >= 90) return "from-green-500 to-emerald-500";
    if (level >= 80) return "from-blue-500 to-cyan-500";
    if (level >= 70) return "from-purple-500 to-pink-500";
    if (level >= 60) return "from-yellow-500 to-amber-500";
    return "from-gray-500 to-slate-500";
  };

  return (
    <div className="min-h-screen bg-gray-900 pt-20 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Skills{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              & Expertise
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Technologies and tools I work with to create amazing digital experiences
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex justify-center mb-12">
          <div className="bg-gray-800 rounded-full p-1 flex gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-6 py-3 rounded-full font-medium transition-all flex items-center gap-2 ${
                  activeCategory === category.id
                    ? "bg-purple-600 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <span>{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {skills[activeCategory].map((skill) => (
            <div
              key={skill.name}
              className="bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-purple-500/50 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="text-3xl">{skill.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-white">{skill.name}</h3>
                    <span className="text-purple-400 font-medium">{skill.level}%</span>
                  </div>
                  
                  <p className="text-gray-400 text-sm mb-4">{skill.description}</p>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${getProgressColor(skill.level)} transition-all duration-700`}
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Overview Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-gray-800 rounded-xl p-6 text-center border border-gray-700">
            <div className="text-3xl font-bold text-purple-400 mb-2">6+</div>
            <div className="text-gray-400 text-sm">Years Experience</div>
          </div>
          <div className="bg-gray-800 rounded-xl p-6 text-center border border-gray-700">
            <div className="text-3xl font-bold text-blue-400 mb-2">50+</div>
            <div className="text-gray-400 text-sm">Projects Completed</div>
          </div>
          <div className="bg-gray-800 rounded-xl p-6 text-center border border-gray-700">
            <div className="text-3xl font-bold text-green-400 mb-2">24</div>
            <div className="text-gray-400 text-sm">Technologies</div>
          </div>
          <div className="bg-gray-800 rounded-xl p-6 text-center border border-gray-700">
            <div className="text-3xl font-bold text-pink-400 mb-2">100%</div>
            <div className="text-gray-400 text-sm">Client Satisfaction</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Skills;
