import { useState } from "react";

const Experience = () => {
  const [activeTab, setActiveTab] = useState("work");

  const experiences = [
    {
      id: 1,
      type: "work",
      title: "Senior Frontend Developer",
      company: "Tech Company",
      location: "Jakarta, Indonesia",
      period: "2022 - Present",
      description: "Lead frontend development for enterprise applications, mentoring junior developers, and implementing best practices for scalable web applications.",
      achievements: [
        "Improved application performance by 40%",
        "Led team of 5 developers",
        "Implemented CI/CD pipelines"
      ],
      technologies: ["React", "TypeScript", "Node.js", "AWS"]
    },
    {
      id: 2,
      type: "work",
      title: "Frontend Developer",
      company: "Digital Agency",
      location: "Bandung, Indonesia",
      period: "2020 - 2022",
      description: "Developed responsive web applications for various clients, collaborated with design teams, and ensured cross-browser compatibility.",
      achievements: [
        "Delivered 15+ client projects",
        "Reduced page load time by 60%",
        "Implemented responsive design system"
      ],
      technologies: ["Vue.js", "JavaScript", "CSS", "Firebase"]
    },
    {
      id: 3,
      type: "work",
      title: "Junior Web Developer",
      company: "Startup Studio",
      location: "Yogyakarta, Indonesia",
      period: "2019 - 2020",
      description: "Assisted in developing MVPs for startup ideas, maintained existing applications, and participated in agile development processes.",
      achievements: [
        "Built 5 MVP applications",
        "Participated in daily standups",
        "Learned modern web technologies"
      ],
      technologies: ["HTML", "CSS", "JavaScript", "React"]
    }
  ];

  const education = [
    {
      id: 1,
      type: "education",
      title: "Bachelor of Computer Science",
      institution: "University of Indonesia",
      location: "Jakarta, Indonesia",
      period: "2015 - 2019",
      description: "Focused on software engineering and web development. Graduated with honors.",
      achievements: [
        "GPA: 3.8/4.0",
        "Dean's List for 6 semesters",
        "Best Thesis Award"
      ],
      technologies: ["Data Structures", "Algorithms", "Web Development", "Database Systems"]
    },
    {
      id: 2,
      type: "education",
      title: "Full Stack Web Development Bootcamp",
      institution: "Coding Academy",
      location: "Online",
      period: "2018",
      description: "Intensive 12-week program covering modern web development technologies and best practices.",
      achievements: [
        "Completed 10+ projects",
        "Top 10% of cohort",
        "Built full-stack applications"
      ],
      technologies: ["MERN Stack", "REST APIs", "Git", "Agile"]
    }
  ];

  const certifications = [
    {
      id: 1,
      type: "certification",
      title: "React Professional Certification",
      institution: "Meta",
      location: "Online",
      period: "2023",
      description: "Advanced React development including hooks, context, and performance optimization.",
      achievements: [
        "Score: 95%",
        "Advanced React patterns",
        "Performance optimization"
      ],
      technologies: ["React", "Redux", "Next.js"]
    },
    {
      id: 2,
      type: "certification",
      title: "AWS Cloud Practitioner",
      institution: "Amazon Web Services",
      location: "Online",
      period: "2022",
      description: "Fundamental understanding of AWS cloud services and deployment strategies.",
      achievements: [
        "Passed on first attempt",
        "Cloud architecture basics",
        "Security best practices"
      ],
      technologies: ["AWS", "Cloud Computing", "Security"]
    }
  ];

  const tabs = [
    { id: "work", name: "Work Experience", icon: "💼" },
    { id: "education", name: "Education", icon: "🎓" },
    { id: "certification", name: "Certifications", icon: "🏆" }
  ];

  const getItems = () => {
    switch (activeTab) {
      case "work":
        return experiences;
      case "education":
        return education;
      case "certification":
        return certifications;
      default:
        return experiences;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 pt-20 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            My{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              Journey
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Professional experience, education, and continuous learning journey
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-12">
          <div className="bg-gray-800 rounded-full p-1 flex gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-full font-medium transition-all flex items-center gap-2 ${
                  activeTab === tab.id
                    ? "bg-purple-600 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <span>{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 md:left-1/2 transform md:-translate-x-1/2 top-0 bottom-0 w-0.5 bg-purple-500/30"></div>

          {/* Timeline Items */}
          <div className="space-y-12">
            {getItems().map((item, index) => (
              <div
                key={item.id}
                className={`relative flex items-center ${
                  index % 2 === 0 ? "md:flex-row-reverse" : ""
                }`}
              >
                {/* Timeline Dot */}
                <div className="absolute left-8 md:left-1/2 transform md:-translate-x-1/2 w-4 h-4 bg-purple-500 rounded-full border-4 border-gray-900"></div>

                {/* Content Card */}
                <div className={`ml-16 md:ml-0 md:w-1/2 ${index % 2 === 0 ? "md:pr-12" : "md:pl-12"}`}>
                  <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 hover:border-purple-500/50 transition-all">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1">{item.title}</h3>
                        <div className="text-purple-400 font-medium">
                          {item.company || item.institution}
                        </div>
                      </div>
                      <div className="text-right mt-2 md:mt-0">
                        <div className="text-gray-400 text-sm">{item.period}</div>
                        <div className="text-gray-500 text-xs">{item.location}</div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-300 mb-4">{item.description}</p>

                    {/* Achievements */}
                    <div className="mb-4">
                      <h4 className="text-white font-medium mb-2">Key Achievements:</h4>
                      <ul className="space-y-1">
                        {item.achievements.map((achievement, idx) => (
                          <li key={idx} className="text-gray-400 text-sm flex items-start gap-2">
                            <span className="text-purple-400 mt-1">•</span>
                            {achievement}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Technologies */}
                    <div>
                      <h4 className="text-white font-medium mb-2">Technologies:</h4>
                      <div className="flex flex-wrap gap-2">
                        {item.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="px-3 py-1 bg-purple-600/20 text-purple-400 rounded-full text-sm border border-purple-600/30"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-gray-800 rounded-xl p-6 text-center border border-gray-700">
            <div className="text-3xl font-bold text-purple-400 mb-2">4+</div>
            <div className="text-gray-400 text-sm">Years Experience</div>
          </div>
          <div className="bg-gray-800 rounded-xl p-6 text-center border border-gray-700">
            <div className="text-3xl font-bold text-blue-400 mb-2">20+</div>
            <div className="text-gray-400 text-sm">Projects Delivered</div>
          </div>
          <div className="bg-gray-800 rounded-xl p-6 text-center border border-gray-700">
            <div className="text-3xl font-bold text-green-400 mb-2">5</div>
            <div className="text-gray-400 text-sm">Companies</div>
          </div>
          <div className="bg-gray-800 rounded-xl p-6 text-center border border-gray-700">
            <div className="text-3xl font-bold text-pink-400 mb-2">10+</div>
            <div className="text-gray-400 text-sm">Certifications</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Experience;
