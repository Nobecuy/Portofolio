import { useState } from "react";

const About = () => {
  const [activeTab, setActiveTab] = useState("skills");

  const skills = {
    "Frontend": ["React", "Vue.js", "TypeScript", "TailwindCSS", "Next.js"],
    "Backend": ["Node.js", "Express", "MongoDB", "PostgreSQL", "Firebase"],
    "Tools": ["Git", "Docker", "VS Code", "Figma", "Webpack"]
  };

  const interests = [
    "UI/UX Design", "Creative Coding", "Open Source", 
    "Machine Learning", "Game Development", "Digital Art"
  ];

  return (
    <div className="min-h-screen bg-gray-900 pt-20">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            About{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              Me
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Passionate frontend developer who loves creating beautiful and functional web experiences
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Profile Section */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
              <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                <span className="text-4xl text-white font-bold">N</span>
              </div>
              
              <h2 className="text-2xl font-bold text-white text-center mb-2">Nobe</h2>
              <p className="text-purple-400 text-center mb-6">Frontend Developer</p>
              
              <div className="space-y-4 text-gray-300">
                <div className="flex items-center gap-3">
                  <span className="text-purple-400">📍</span>
                  <span>Indonesia</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-purple-400">🎓</span>
                  <span>Computer Science</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-purple-400">💼</span>
                  <span>Available for work</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex justify-center gap-4 mt-6">
                <a href="#" className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors">
                  <span>📧</span>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors">
                  <span>💼</span>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors">
                  <span>🐱</span>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors">
                  <span>🐦</span>
                </a>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="lg:col-span-2 space-y-8">
            {/* Bio */}
            <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
              <h3 className="text-2xl font-bold text-white mb-4">My Story</h3>
              <div className="space-y-4 text-gray-300">
                <p>
                  Hi! I'm Nobe, a passionate frontend developer with a love for creating beautiful and intuitive user interfaces. 
                  I specialize in modern web technologies and enjoy turning complex problems into simple, elegant solutions.
                </p>
                <p>
                  My journey in web development started a few years ago, and since then I've been constantly learning and growing. 
                  I believe in writing clean, maintainable code and creating experiences that users love.
                </p>
                <p>
                  When I'm not coding, you can find me exploring new technologies, contributing to open-source projects, 
                  or creating digital art. I'm always excited to take on new challenges and work on innovative projects.
                </p>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
              <div className="flex gap-4 mb-6 border-b border-gray-700">
                <button
                  onClick={() => setActiveTab("skills")}
                  className={`pb-2 px-4 font-medium transition-colors ${
                    activeTab === "skills" 
                      ? "text-purple-400 border-b-2 border-purple-400" 
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  Skills
                </button>
                <button
                  onClick={() => setActiveTab("interests")}
                  className={`pb-2 px-4 font-medium transition-colors ${
                    activeTab === "interests" 
                      ? "text-purple-400 border-b-2 border-purple-400" 
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  Interests
                </button>
              </div>

              {activeTab === "skills" && (
                <div className="space-y-6">
                  {Object.entries(skills).map(([category, items]) => (
                    <div key={category}>
                      <h4 className="text-lg font-semibold text-white mb-3">{category}</h4>
                      <div className="flex flex-wrap gap-2">
                        {items.map((skill) => (
                          <span
                            key={skill}
                            className="px-3 py-1 bg-purple-600/20 text-purple-400 rounded-full text-sm border border-purple-600/30"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "interests" && (
                <div className="flex flex-wrap gap-3">
                  {interests.map((interest) => (
                    <span
                      key={interest}
                      className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg border border-gray-600"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
