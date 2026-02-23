import { useState, useEffect, useCallback, memo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import {
  authService,
  progressService,
  pageContentService,
  storageService,
} from "../../firebase";
import { getLevelFromPercentage } from "../../utils/levelMapping";

// Icons as SVG components for consistency
const Icons = {
  dashboard: (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
      />
    </svg>
  ),
  progress: (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
      />
    </svg>
  ),
  content: (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
      />
    </svg>
  ),
  projects: (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
      />
    </svg>
  ),
  logout: (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
      />
    </svg>
  ),
  plus: (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 4v16m8-8H4"
      />
    </svg>
  ),
  edit: (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
      />
    </svg>
  ),
  trash: (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
      />
    </svg>
  ),
  save: (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
      />
    </svg>
  ),
  check: (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 13l4 4L19 7"
      />
    </svg>
  ),
  close: (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  ),
  upload: (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  ),
  image: (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  ),
  arrowRight: (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17 8l4 4m0 0l-4 4m4-4H3"
      />
    </svg>
  ),
  chevronRight: (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 5l7 7-7 7"
      />
    </svg>
  ),
};

// Memoized input components with improved styling
const InputField = memo(
  ({ label, value, onChange, type = "text", placeholder = "", ...props }) => (
    <div className="space-y-2">
      <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wider">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all hover:border-gray-600"
        {...props}
      />
    </div>
  ),
);

const TextAreaField = memo(
  ({ label, value, onChange, rows = 3, placeholder = "", ...props }) => (
    <div className="space-y-2">
      <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wider">
        {label}
      </label>
      <textarea
        rows={rows}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all resize-none hover:border-gray-600"
        {...props}
      />
    </div>
  ),
);

// Stats Card Component
const StatCard = memo(({ icon, label, value, color = "purple" }) => {
  const colorClasses = {
    purple:
      "from-purple-500/20 to-purple-600/20 text-purple-400 border-purple-500/30",
    green:
      "from-green-500/20 to-green-600/20 text-green-400 border-green-500/30",
    blue: "from-blue-500/20 to-blue-600/20 text-blue-400 border-blue-500/30",
    yellow:
      "from-yellow-500/20 to-yellow-600/20 text-yellow-400 border-yellow-500/30",
  };

  return (
    <div
      className={`animate-card bg-gradient-to-br ${colorClasses[color]} p-6 rounded-2xl border backdrop-blur-sm`}
    >
      <div className="flex items-center justify-between">
        <div className={`p-3 rounded-xl bg-gray-900/50`}>{icon}</div>
      </div>
      <div className="mt-4">
        <p className="text-gray-400 text-sm">{label}</p>
        <p className="text-3xl font-bold text-white mt-1">{value}</p>
      </div>
    </div>
  );
});

// Color Picker Component
const ColorPicker = ({ value, onChange, label }) => {
  const colors = [
    { name: "blue", class: "bg-blue-500", hex: "#3b82f6" },
    { name: "purple", class: "bg-purple-500", hex: "#8b5cf6" },
    { name: "pink", class: "bg-pink-500", hex: "#ec4899" },
    { name: "green", class: "bg-green-500", hex: "#10b981" },
    { name: "yellow", class: "bg-yellow-500", hex: "#f59e0b" },
    { name: "red", class: "bg-red-500", hex: "#ef4444" },
    { name: "gray", class: "bg-gray-500", hex: "#6b7280" },
    { name: "indigo", class: "bg-indigo-500", hex: "#6366f1" },
  ];

  return (
    <div className="space-y-2">
      <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wider">
        {label}
      </label>
      <div className="flex flex-wrap gap-2">
        {colors.map((color) => (
          <button
            key={color.name}
            type="button"
            onClick={() => onChange(color.name)}
            className={`w-8 h-8 rounded-full ${color.class} transition-all hover:scale-110 ${
              value === color.name
                ? "ring-2 ring-white ring-offset-2 ring-offset-gray-800 scale-110"
                : "opacity-70 hover:opacity-100"
            }`}
            title={color.name}
          />
        ))}
      </div>
    </div>
  );
};

// Modal Component
const Modal = ({ isOpen, onClose, title, children, maxWidth = "max-w-md" }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      gsap.fromTo(
        modalRef.current,
        { opacity: 0, scale: 0.95, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.3, ease: "power3.out" },
      );
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        ref={modalRef}
        className={`relative bg-gray-800 rounded-2xl border border-gray-700 shadow-2xl w-full ${maxWidth} max-h-[90vh] overflow-y-auto`}
      >
        <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-6 flex items-center justify-between z-10">
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-gray-400 hover:text-white"
          >
            {Icons.close}
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

// Alert Component
const Alert = ({ type, message, onClose }) => {
  const colors = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-blue-500",
  };

  const icons = {
    success: Icons.check,
    error: Icons.close,
    info: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  };

  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed top-4 right-4 z-[9999] ${colors[type]} text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-slide-in`}
    >
      {icons[type]}
      <span className="font-medium">{message}</span>
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Progress state
  const [progressList, setProgressList] = useState([]);
  const [progressLoading, setProgressLoading] = useState(true);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [editingProgress, setEditingProgress] = useState(null);
  const [progressForm, setProgressForm] = useState({
    title: "",
    percentage: 0,
    color: "blue",
    emoji: "📈",
  });

  // Page content state
  const [pageContent, setPageContent] = useState({
    home: {
      badge: "",
      title: "",
      highlightName: "",
      subtitle: "",
      primaryButton: "",
      secondaryButton: "",
      emoji: "",
    },
    about: {
      title: "",
      subtitle: "",
      heading: "",
      description: "",
      tag1: "",
      tag2: "",
      stat1: { value: "", label: "" },
      stat2: { value: "", label: "" },
      stat3: { value: "", label: "" },
    },
    projects: {
      title: "",
      subtitle: "",
      categories: ["All", "Web App", "Website", "Mobile", "AI/ML", "Design"],
      items: [],
    },
    skills: { title: "", subtitle: "", items: [] },
    experience: { title: "", subtitle: "", items: [] },
    contact: {
      title: "",
      subtitle: "",
      email: "",
      phone: "",
      location: "",
      socials: [],
    },
  });

  const [savingContent, setSavingContent] = useState(false);
  const [alert, setAlert] = useState(null);

  const [activeContentTab, setActiveContentTab] = useState("home");

  const tabs = [
    { id: "overview", label: "Overview", icon: Icons.dashboard },
    { id: "progress", label: "Progress", icon: Icons.progress },
    { id: "content", label: "Page Content", icon: Icons.content },
    { id: "projects", label: "Projects", icon: Icons.projects },
  ];

  const contentSubTabs = [
    { id: "home", label: "Home", icon: "🏠" },
    { id: "about", label: "About", icon: "👤" },
    { id: "skills", label: "Skills", icon: "⚡" },
    { id: "projects", label: "Projects", icon: "💼" },
    { id: "experience", label: "Experience", icon: "🎓" },
    { id: "contact", label: "Contact", icon: "📧" },
  ];

  // Show alert helper
  const showAlert = useCallback((type, message) => {
    setAlert({ type, message });
  }, []);

  // GSAP animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".tab-content",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" },
      );
      gsap.fromTo(
        ".animate-card",
        { opacity: 0, y: 30, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: "power3.out",
          delay: 0.1,
        },
      );
    });
    return () => ctx.revert();
  }, [activeTab, activeContentTab]);

  useEffect(() => {
    const unsubscribe = authService.onAuthChange((user) => {
      setUser(user);
      if (!user) navigate("/admin/login");
    });
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    fetchProgress();
    loadPageContent();
  }, []);

  const fetchProgress = async () => {
    try {
      const data = await progressService.getAll();
      setProgressList(data);
    } catch (error) {
      showAlert("error", "Failed to load progress data");
    } finally {
      setProgressLoading(false);
    }
  };

  const loadPageContent = async () => {
    try {
      const data = await pageContentService.getAll();
      if (data) {
        setPageContent((prev) => ({ ...prev, ...data }));
      }
    } catch (error) {
      showAlert("error", "Failed to load page content");
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate("/admin/login");
    } catch (error) {
      showAlert("error", "Logout failed");
    }
  };

  // Progress handlers
  const handleProgressSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProgress) {
        await progressService.update(editingProgress, progressForm);
        showAlert("success", "Progress updated successfully");
      } else {
        await progressService.add(progressForm);
        showAlert("success", "Progress added successfully");
      }
      setShowProgressModal(false);
      setEditingProgress(null);
      setProgressForm({ title: "", percentage: 0, color: "blue", emoji: "📈" });
      fetchProgress();
    } catch (error) {
      showAlert("error", "Failed to save progress");
    }
  };

  const handleEditProgress = (item) => {
    setProgressForm(item);
    setEditingProgress(item.id);
    setShowProgressModal(true);
  };

  const handleDeleteProgress = async (id) => {
    if (window.confirm("Are you sure you want to delete this progress item?")) {
      try {
        await progressService.delete(id);
        showAlert("success", "Progress deleted successfully");
        fetchProgress();
      } catch (error) {
        showAlert("error", "Failed to delete progress");
      }
    }
  };

  // Page content handlers
  const updateContentField = useCallback((section, field, value) => {
    setPageContent((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  }, []);

  const handleSaveContent = async () => {
    setSavingContent(true);
    try {
      await pageContentService.update(pageContent);
      showAlert("success", "All changes saved successfully!");
    } catch (error) {
      showAlert("error", "Failed to save changes");
    }
    setSavingContent(false);
  };

  // Project handlers
  const addProject = useCallback(() => {
    const newProject = {
      id: Date.now().toString(),
      title: "",
      category: "Web App",
      desc: "",
      emoji: "🚀",
      tech: "",
      link: "",
    };
    setPageContent((prev) => ({
      ...prev,
      projects: {
        ...prev.projects,
        items: [...prev.projects.items, newProject],
      },
    }));
  }, []);

  const deleteProject = useCallback(
    (index) => {
      if (window.confirm("Are you sure you want to delete this project?")) {
        setPageContent((prev) => ({
          ...prev,
          projects: {
            ...prev.projects,
            items: prev.projects.items.filter((_, i) => i !== index),
          },
        }));
        showAlert("success", "Project removed");
      }
    },
    [showAlert],
  );

  const updateProject = useCallback((index, field, value) => {
    setPageContent((prev) => ({
      ...prev,
      projects: {
        ...prev.projects,
        items: prev.projects.items.map((item, i) =>
          i === index ? { ...item, [field]: value } : item,
        ),
      },
    }));
  }, []);

  // Experience handlers
  const addExperience = useCallback(() => {
    const newExp = { period: "", title: "", company: "", desc: "" };
    setPageContent((prev) => ({
      ...prev,
      experience: {
        ...prev.experience,
        items: [...prev.experience.items, newExp],
      },
    }));
  }, []);

  const deleteExperience = useCallback(
    (index) => {
      if (window.confirm("Are you sure you want to delete this experience?")) {
        setPageContent((prev) => ({
          ...prev,
          experience: {
            ...prev.experience,
            items: prev.experience.items.filter((_, i) => i !== index),
          },
        }));
        showAlert("success", "Experience removed");
      }
    },
    [showAlert],
  );

  const updateExperience = useCallback((index, field, value) => {
    setPageContent((prev) => ({
      ...prev,
      experience: {
        ...prev.experience,
        items: prev.experience.items.map((item, i) =>
          i === index ? { ...item, [field]: value } : item,
        ),
      },
    }));
  }, []);

  // Skill handlers
  const addSkill = useCallback(() => {
    const newSkill = {
      icon: "🔧",
      name: "",
      level: "Intermediate",
      color: "blue",
    };
    setPageContent((prev) => ({
      ...prev,
      skills: {
        ...prev.skills,
        items: [...(prev.skills.items || []), newSkill],
      },
    }));
  }, []);

  const deleteSkill = useCallback(
    (index) => {
      if (window.confirm("Are you sure you want to delete this skill?")) {
        setPageContent((prev) => ({
          ...prev,
          skills: {
            ...prev.skills,
            items: prev.skills.items.filter((_, i) => i !== index),
          },
        }));
        showAlert("success", "Skill removed");
      }
    },
    [showAlert],
  );

  const updateSkill = useCallback((index, field, value) => {
    setPageContent((prev) => ({
      ...prev,
      skills: {
        ...prev.skills,
        items: prev.skills.items.map((item, i) =>
          i === index ? { ...item, [field]: value } : item,
        ),
      },
    }));
  }, []);

  // Image upload handlers
  const handleSkillImageUpload = useCallback(
    async (index, file) => {
      if (!file) return;
      try {
        // Use local upload server with skills folder
        const formData = new FormData();
        formData.append("image", file);

        const response = await fetch(
          "http://localhost:3001/api/upload?folder=skills",
          {
            method: "POST",
            body: formData,
          },
        );

        if (!response.ok) {
          throw new Error("Upload failed");
        }

        const result = await response.json();
        updateSkill(index, "image", result.imagePath);
        showAlert("success", "Image uploaded successfully");
      } catch (error) {
        showAlert(
          "error",
          "Failed to upload image. Make sure upload server is running on port 3001",
        );
      }
    },
    [updateSkill, showAlert],
  );

  const handleProjectImageUpload = useCallback(
    async (index, file) => {
      if (!file) return;
      try {
        // Use local upload server with projects folder
        const formData = new FormData();
        formData.append("image", file);

        const response = await fetch(
          "http://localhost:3001/api/upload?folder=projects",
          {
            method: "POST",
            body: formData,
          },
        );

        if (!response.ok) {
          throw new Error("Upload failed");
        }

        const result = await response.json();
        updateProject(index, "image", result.imagePath);
        showAlert("success", "Image uploaded successfully");
      } catch (error) {
        showAlert(
          "error",
          "Failed to upload image. Make sure upload server is running on port 3001",
        );
      }
    },
    [updateProject, showAlert],
  );

  const getColorClass = (color) => {
    const colorMap = {
      blue: "from-blue-500 to-cyan-500",
      purple: "from-purple-500 to-pink-500",
      pink: "from-pink-500 to-rose-500",
      green: "from-green-500 to-emerald-500",
      yellow: "from-yellow-500 to-amber-500",
      red: "from-red-500 to-orange-500",
    };
    return colorMap[color] || "from-blue-500 to-cyan-500";
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      {/* Alert */}
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 bg-gray-900/95 backdrop-blur-md border-b border-gray-800">
        <div className="flex items-center justify-between px-4 lg:px-8 h-16">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
                <span className="text-xl">⚡</span>
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-xs text-gray-500">Manage your portfolio</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-white bg-gray-800/50 hover:bg-gray-800 rounded-lg transition-all border border-gray-700 hover:border-gray-600"
            >
              <span>View Site</span>
              {Icons.arrowRight}
            </a>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-all border border-red-500/20"
            >
              <span className="hidden sm:inline">Logout</span>
              {Icons.logout}
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`fixed lg:sticky top-16 left-0 z-30 w-64 h-[calc(100vh-4rem)] bg-gray-900 border-r border-gray-800 transform transition-transform duration-300 lg:transform-none ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="p-4 space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-purple-400 border border-purple-500/30 shadow-lg shadow-purple-500/10"
                    : "text-gray-400 hover:bg-gray-800/50 hover:text-white"
                }`}
              >
                <span
                  className={
                    activeTab === tab.id ? "text-purple-400" : "text-gray-500"
                  }
                >
                  {tab.icon}
                </span>
                <span className="font-medium">{tab.label}</span>
                {activeTab === tab.id && (
                  <span className="ml-auto">{Icons.chevronRight}</span>
                )}
              </button>
            ))}
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-4 rounded-xl border border-gray-700/50">
              <p className="text-xs text-gray-500 mb-1">Pro Tip</p>
              <p className="text-sm text-gray-300 leading-relaxed">
                Use "Page Content" tab to edit your portfolio text and data.
              </p>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-20 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8 tab-content min-h-[calc(100vh-4rem)]">
          {/* OVERVIEW TAB */}
          {activeTab === "overview" && (
            <div className="space-y-8 max-w-6xl">
              <div>
                <h2 className="text-3xl font-bold mb-2">Dashboard Overview</h2>
                <p className="text-gray-400">
                  Welcome back! Here's what's happening with your portfolio.
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                  icon={Icons.progress}
                  label="Total Progress"
                  value={progressList.length}
                  color="purple"
                />
                <StatCard
                  icon={Icons.check}
                  label="Completed"
                  value={
                    progressList.filter((p) => p.percentage === 100).length
                  }
                  color="green"
                />
                <StatCard
                  icon={Icons.projects}
                  label="Projects"
                  value={pageContent.projects.items.length}
                  color="blue"
                />
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="animate-card bg-gray-800/30 backdrop-blur-sm p-6 rounded-2xl border border-gray-700/50">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center text-purple-400">
                      ⚡
                    </span>
                    Quick Actions
                  </h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => setActiveTab("content")}
                      className="w-full flex items-center justify-between p-4 bg-gray-800/50 hover:bg-gray-800 rounded-xl transition-all group border border-gray-700 hover:border-purple-500/30"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center text-purple-400">
                          {Icons.content}
                        </span>
                        <div className="text-left">
                          <p className="font-medium text-white">
                            Edit Page Content
                          </p>
                          <p className="text-sm text-gray-400">
                            Update text and sections
                          </p>
                        </div>
                      </div>
                      <span className="text-gray-500 group-hover:text-purple-400 transition-colors">
                        {Icons.chevronRight}
                      </span>
                    </button>
                    <button
                      onClick={() => setActiveTab("progress")}
                      className="w-full flex items-center justify-between p-4 bg-gray-800/50 hover:bg-gray-800 rounded-xl transition-all group border border-gray-700 hover:border-purple-500/30"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400">
                          {Icons.progress}
                        </span>
                        <div className="text-left">
                          <p className="font-medium text-white">
                            Update Progress
                          </p>
                          <p className="text-sm text-gray-400">
                            Track your learning
                          </p>
                        </div>
                      </div>
                      <span className="text-gray-500 group-hover:text-blue-400 transition-colors">
                        {Icons.chevronRight}
                      </span>
                    </button>
                  </div>
                </div>

                <div className="animate-card bg-gray-800/30 backdrop-blur-sm p-6 rounded-2xl border border-gray-700/50">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center text-green-400">
                      📊
                    </span>
                    Recent Activity
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-sm">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span className="text-gray-300">
                        Dashboard loaded successfully
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                      <span className="text-gray-300">
                        {progressList.length} progress items tracked
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <span className="text-gray-300">
                        {pageContent.projects.items.length} projects published
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                      <span className="text-gray-300">
                        {pageContent.skills.items?.length || 0} skills listed
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PROGRESS TAB */}
          {activeTab === "progress" && (
            <div className="space-y-6 max-w-6xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-bold mb-1">Learning Progress</h2>
                  <p className="text-gray-400">
                    Track your skills development journey
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingProgress(null);
                    setProgressForm({
                      title: "",
                      percentage: 0,
                      color: "blue",
                      emoji: "📈",
                    });
                    setShowProgressModal(true);
                  }}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-xl font-medium transition-all shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30"
                >
                  {Icons.plus}
                  <span>Add Progress</span>
                </button>
              </div>

              {progressLoading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
                </div>
              ) : progressList.length === 0 ? (
                <div className="text-center py-20 bg-gray-800/30 rounded-2xl border border-dashed border-gray-700">
                  <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    {Icons.progress}
                  </div>
                  <h3 className="text-lg font-medium text-gray-300 mb-2">
                    No progress yet
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Start tracking your learning journey
                  </p>
                  <button
                    onClick={() => setShowProgressModal(true)}
                    className="px-4 py-2 bg-purple-600/20 text-purple-400 rounded-lg hover:bg-purple-600/30 transition-colors"
                  >
                    Add your first progress
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {progressList.map((item) => (
                    <div
                      key={item.id}
                      className="animate-card group bg-gray-800/30 backdrop-blur-sm p-6 rounded-2xl border border-gray-700/50 hover:border-purple-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{item.emoji || "📈"}</span>
                          <h3 className="font-semibold text-lg">
                            {item.title}
                          </h3>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEditProgress(item)}
                            className="p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-colors"
                            title="Edit"
                          >
                            {Icons.edit}
                          </button>
                          <button
                            onClick={() => handleDeleteProgress(item.id)}
                            className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
                            title="Delete"
                          >
                            {Icons.trash}
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-between text-sm mb-3">
                        <span className="text-gray-400">
                          {getLevelFromPercentage(item.percentage)}
                        </span>
                        <span className="font-bold text-white">
                          {item.percentage}%
                        </span>
                      </div>
                      <div className="h-3 bg-gray-700/50 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${getColorClass(item.color)} rounded-full transition-all duration-500`}
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* CONTENT TAB */}
          {activeTab === "content" && (
            <div className="space-y-6 max-w-6xl">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-bold mb-1">Page Content</h2>
                  <p className="text-gray-400">
                    Manage your portfolio content and information
                  </p>
                </div>
                <button
                  onClick={handleSaveContent}
                  disabled={savingContent}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-medium transition-all shadow-lg shadow-green-500/20"
                >
                  {savingContent ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      {Icons.save}
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>

              {/* Content Sub-tabs */}
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {contentSubTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveContentTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap transition-all ${
                      activeContentTab === tab.id
                        ? "bg-purple-600 text-white shadow-lg shadow-purple-500/20"
                        : "bg-gray-800/50 text-gray-400 hover:bg-gray-800 hover:text-white border border-gray-700"
                    }`}
                  >
                    <span>{tab.icon}</span>
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Content Forms */}
              <div className="animate-card bg-gray-800/30 backdrop-blur-sm p-6 lg:p-8 rounded-2xl border border-gray-700/50">
                {/* HOME CONTENT */}
                {activeContentTab === "home" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <InputField
                        label="Badge Text"
                        value={pageContent.home.badge}
                        onChange={(e) =>
                          updateContentField("home", "badge", e.target.value)
                        }
                        placeholder="👋 Welcome to my portfolio"
                      />
                      <InputField
                        label="Title"
                        value={pageContent.home.title}
                        onChange={(e) =>
                          updateContentField("home", "title", e.target.value)
                        }
                        placeholder="Hi, I'm"
                      />
                      <InputField
                        label="Highlighted Name"
                        value={pageContent.home.highlightName}
                        onChange={(e) =>
                          updateContentField(
                            "home",
                            "highlightName",
                            e.target.value,
                          )
                        }
                        placeholder="Your Name"
                      />
                      <InputField
                        label="Emoji"
                        value={pageContent.home.emoji}
                        onChange={(e) =>
                          updateContentField("home", "emoji", e.target.value)
                        }
                        placeholder="👨‍💻"
                      />
                    </div>
                    <TextAreaField
                      label="Subtitle"
                      value={pageContent.home.subtitle}
                      onChange={(e) =>
                        updateContentField("home", "subtitle", e.target.value)
                      }
                      placeholder="Frontend Developer & Creative Coder..."
                      rows={3}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <InputField
                        label="Primary Button"
                        value={pageContent.home.primaryButton}
                        onChange={(e) =>
                          updateContentField(
                            "home",
                            "primaryButton",
                            e.target.value,
                          )
                        }
                        placeholder="View Projects 🚀"
                      />
                      <InputField
                        label="Secondary Button"
                        value={pageContent.home.secondaryButton}
                        onChange={(e) =>
                          updateContentField(
                            "home",
                            "secondaryButton",
                            e.target.value,
                          )
                        }
                        placeholder="Get In Touch 📧"
                      />
                    </div>
                  </div>
                )}

                {/* ABOUT CONTENT */}
                {activeContentTab === "about" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <InputField
                        label="Title"
                        value={pageContent.about.title}
                        onChange={(e) =>
                          updateContentField("about", "title", e.target.value)
                        }
                        placeholder="About Me"
                      />
                      <InputField
                        label="Subtitle"
                        value={pageContent.about.subtitle}
                        onChange={(e) =>
                          updateContentField(
                            "about",
                            "subtitle",
                            e.target.value,
                          )
                        }
                        placeholder="Get to know my journey"
                      />
                    </div>
                    <InputField
                      label="Heading"
                      value={pageContent.about.heading}
                      onChange={(e) =>
                        updateContentField("about", "heading", e.target.value)
                      }
                      placeholder="Who am I?"
                    />
                    <TextAreaField
                      label="Description"
                      value={pageContent.about.description}
                      onChange={(e) =>
                        updateContentField(
                          "about",
                          "description",
                          e.target.value,
                        )
                      }
                      placeholder="Tell your story..."
                      rows={4}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <InputField
                        label="Tag 1"
                        value={pageContent.about.tag1}
                        onChange={(e) =>
                          updateContentField("about", "tag1", e.target.value)
                        }
                        placeholder="React Expert"
                      />
                      <InputField
                        label="Tag 2"
                        value={pageContent.about.tag2}
                        onChange={(e) =>
                          updateContentField("about", "tag2", e.target.value)
                        }
                        placeholder="UI Designer"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {["stat1", "stat2", "stat3"].map((stat, i) => (
                        <div
                          key={stat}
                          className="bg-gray-800/50 p-4 rounded-xl space-y-3 border border-gray-700/50"
                        >
                          <p className="text-sm font-medium text-gray-400">
                            Statistic {i + 1}
                          </p>
                          <input
                            type="text"
                            value={pageContent.about[stat].value}
                            onChange={(e) =>
                              updateContentField("about", stat, {
                                ...pageContent.about[stat],
                                value: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
                            placeholder="3+"
                          />
                          <input
                            type="text"
                            value={pageContent.about[stat].label}
                            onChange={(e) =>
                              updateContentField("about", stat, {
                                ...pageContent.about[stat],
                                label: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none text-sm"
                            placeholder="Years Experience"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* SKILLS CONTENT */}
                {activeContentTab === "skills" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <InputField
                        label="Section Title"
                        value={pageContent.skills.title}
                        onChange={(e) =>
                          updateContentField("skills", "title", e.target.value)
                        }
                        placeholder="My Skills"
                      />
                      <InputField
                        label="Subtitle"
                        value={pageContent.skills.subtitle}
                        onChange={(e) =>
                          updateContentField(
                            "skills",
                            "subtitle",
                            e.target.value,
                          )
                        }
                        placeholder="Technologies I work with"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-gray-400">
                        Skills ({pageContent.skills.items?.length || 0})
                      </p>
                      <button
                        onClick={addSkill}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600/20 text-green-400 hover:bg-green-600/30 rounded-lg text-sm font-medium transition-all"
                      >
                        {Icons.plus}
                        <span>Add Skill</span>
                      </button>
                    </div>

                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                      {(pageContent.skills.items || []).map((skill, index) => (
                        <div
                          key={index}
                          className="bg-gray-800/50 p-5 rounded-xl border border-gray-700/50 space-y-4 hover:border-purple-500/30 transition-colors"
                        >
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-400">
                              Skill #{index + 1}
                            </span>
                            <button
                              onClick={() => deleteSkill(index)}
                              className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                            >
                              {Icons.trash}
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              {skill.image ? (
                                <div className="relative group">
                                  <img
                                    src={skill.image}
                                    alt={skill.name}
                                    className="w-full h-24 object-contain bg-gray-900/50 rounded-lg p-2"
                                  />
                                  <button
                                    onClick={() =>
                                      updateSkill(index, "image", "")
                                    }
                                    className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    ×
                                  </button>
                                </div>
                              ) : (
                                <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-purple-500 transition-colors bg-gray-900/30">
                                  <span className="text-gray-400 text-xs flex items-center gap-1">
                                    {Icons.image}
                                    <span>Upload Icon</span>
                                  </span>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) =>
                                      handleSkillImageUpload(
                                        index,
                                        e.target.files[0],
                                      )
                                    }
                                  />
                                </label>
                              )}
                            </div>
                            <div className="space-y-3">
                              <input
                                type="text"
                                value={skill.icon}
                                onChange={(e) =>
                                  updateSkill(index, "icon", e.target.value)
                                }
                                className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white text-center text-xl"
                                placeholder="⚛️"
                              />
                              <input
                                type="text"
                                value={skill.name}
                                onChange={(e) =>
                                  updateSkill(index, "name", e.target.value)
                                }
                                className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white text-sm"
                                placeholder="Skill name"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <select
                              value={skill.level}
                              onChange={(e) =>
                                updateSkill(index, "level", e.target.value)
                              }
                              className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white text-sm focus:border-purple-500 focus:outline-none"
                            >
                              <option value="Beginner">Beginner</option>
                              <option value="Intermediate">Intermediate</option>
                              <option value="Advanced">Advanced</option>
                            </select>
                            <div className="flex items-center gap-2">
                              {[
                                "blue",
                                "purple",
                                "pink",
                                "green",
                                "yellow",
                                "red",
                              ].map((color) => (
                                <button
                                  key={color}
                                  type="button"
                                  onClick={() =>
                                    updateSkill(index, "color", color)
                                  }
                                  className={`w-6 h-6 rounded-full bg-gradient-to-r ${getColorClass(color)} ${
                                    skill.color === color
                                      ? "ring-2 ring-white"
                                      : "opacity-50 hover:opacity-100"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* PROJECTS CONTENT */}
                {activeContentTab === "projects" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <InputField
                        label="Section Title"
                        value={pageContent.projects.title}
                        onChange={(e) =>
                          updateContentField(
                            "projects",
                            "title",
                            e.target.value,
                          )
                        }
                        placeholder="My Projects"
                      />
                      <InputField
                        label="Subtitle"
                        value={pageContent.projects.subtitle}
                        onChange={(e) =>
                          updateContentField(
                            "projects",
                            "subtitle",
                            e.target.value,
                          )
                        }
                        placeholder="Explore my latest work"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-gray-400">
                        Projects ({pageContent.projects.items.length})
                      </p>
                      <button
                        onClick={addProject}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600/20 text-green-400 hover:bg-green-600/30 rounded-lg text-sm font-medium transition-all"
                      >
                        {Icons.plus}
                        <span>Add Project</span>
                      </button>
                    </div>

                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                      {pageContent.projects.items.map((project, index) => (
                        <div
                          key={project.id}
                          className="bg-gray-800/50 p-5 rounded-xl border border-gray-700/50 space-y-4 hover:border-purple-500/30 transition-colors"
                        >
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-400">
                              Project #{index + 1}
                            </span>
                            <button
                              onClick={() => deleteProject(index)}
                              className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                            >
                              {Icons.trash}
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="md:col-span-1">
                              {project.image ? (
                                <div className="relative group">
                                  <img
                                    src={project.image}
                                    alt={project.title}
                                    className="w-full h-24 object-cover rounded-lg"
                                  />
                                  <button
                                    onClick={() =>
                                      updateProject(index, "image", "")
                                    }
                                    className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    ×
                                  </button>
                                </div>
                              ) : (
                                <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-purple-500 transition-colors bg-gray-900/30">
                                  <span className="text-gray-400 text-xs text-center">
                                    {Icons.image}
                                    <span className="block mt-1">Upload</span>
                                  </span>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) =>
                                      handleProjectImageUpload(
                                        index,
                                        e.target.files[0],
                                      )
                                    }
                                  />
                                </label>
                              )}
                            </div>
                            <div className="md:col-span-3 space-y-3">
                              <div className="grid grid-cols-2 gap-3">
                                <input
                                  type="text"
                                  value={project.title}
                                  onChange={(e) =>
                                    updateProject(
                                      index,
                                      "title",
                                      e.target.value,
                                    )
                                  }
                                  className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white text-sm"
                                  placeholder="Project Title"
                                />
                                <select
                                  value={project.category}
                                  onChange={(e) =>
                                    updateProject(
                                      index,
                                      "category",
                                      e.target.value,
                                    )
                                  }
                                  className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white text-sm"
                                >
                                  {pageContent.projects.categories.map(
                                    (cat) => (
                                      <option key={cat} value={cat}>
                                        {cat}
                                      </option>
                                    ),
                                  )}
                                </select>
                              </div>
                              <input
                                type="text"
                                value={project.link}
                                onChange={(e) =>
                                  updateProject(index, "link", e.target.value)
                                }
                                className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white text-sm"
                                placeholder="Project URL"
                              />
                              <input
                                type="text"
                                value={
                                  typeof project.tech === "string"
                                    ? project.tech
                                    : project.tech?.join(", ")
                                }
                                onChange={(e) =>
                                  updateProject(index, "tech", e.target.value)
                                }
                                className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white text-sm"
                                placeholder="Tech stack (comma separated)"
                              />
                              <textarea
                                value={project.desc}
                                onChange={(e) =>
                                  updateProject(index, "desc", e.target.value)
                                }
                                className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white text-sm resize-none"
                                rows={2}
                                placeholder="Description"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* EXPERIENCE CONTENT */}
                {activeContentTab === "experience" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <InputField
                        label="Section Title"
                        value={pageContent.experience.title}
                        onChange={(e) =>
                          updateContentField(
                            "experience",
                            "title",
                            e.target.value,
                          )
                        }
                        placeholder="Experience & Education"
                      />
                      <InputField
                        label="Subtitle"
                        value={pageContent.experience.subtitle}
                        onChange={(e) =>
                          updateContentField(
                            "experience",
                            "subtitle",
                            e.target.value,
                          )
                        }
                        placeholder="My professional journey"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-gray-400">
                        Items ({pageContent.experience.items.length})
                      </p>
                      <button
                        onClick={addExperience}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600/20 text-green-400 hover:bg-green-600/30 rounded-lg text-sm font-medium transition-all"
                      >
                        {Icons.plus}
                        <span>Add Experience</span>
                      </button>
                    </div>

                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                      {pageContent.experience.items.map((item, index) => (
                        <div
                          key={index}
                          className="bg-gray-800/50 p-5 rounded-xl border border-gray-700/50 space-y-4 hover:border-purple-500/30 transition-colors"
                        >
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-400">
                              Item #{index + 1}
                            </span>
                            <button
                              onClick={() => deleteExperience(index)}
                              className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                            >
                              {Icons.trash}
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                              type="text"
                              value={item.period}
                              onChange={(e) =>
                                updateExperience(
                                  index,
                                  "period",
                                  e.target.value,
                                )
                              }
                              className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white text-sm"
                              placeholder="2023 - Present"
                            />
                            <input
                              type="text"
                              value={item.title}
                              onChange={(e) =>
                                updateExperience(index, "title", e.target.value)
                              }
                              className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white text-sm"
                              placeholder="Senior Developer"
                            />
                          </div>

                          <input
                            type="text"
                            value={item.company}
                            onChange={(e) =>
                              updateExperience(index, "company", e.target.value)
                            }
                            className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white text-sm"
                            placeholder="Company Name"
                          />

                          <textarea
                            value={item.desc}
                            onChange={(e) =>
                              updateExperience(index, "desc", e.target.value)
                            }
                            className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white text-sm resize-none"
                            rows={3}
                            placeholder="Describe your role and achievements..."
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* CONTACT CONTENT */}
                {activeContentTab === "contact" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <InputField
                        label="Section Title"
                        value={pageContent.contact.title}
                        onChange={(e) =>
                          updateContentField("contact", "title", e.target.value)
                        }
                        placeholder="Get In Touch"
                      />
                      <InputField
                        label="Subtitle"
                        value={pageContent.contact.subtitle}
                        onChange={(e) =>
                          updateContentField(
                            "contact",
                            "subtitle",
                            e.target.value,
                          )
                        }
                        placeholder="Let's collaborate"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <InputField
                        label="Email"
                        type="email"
                        value={pageContent.contact.email}
                        onChange={(e) =>
                          updateContentField("contact", "email", e.target.value)
                        }
                        placeholder="your@email.com"
                      />
                      <InputField
                        label="Phone"
                        value={pageContent.contact.phone}
                        onChange={(e) =>
                          updateContentField("contact", "phone", e.target.value)
                        }
                        placeholder="+62 123 4567 890"
                      />
                      <InputField
                        label="Location"
                        value={pageContent.contact.location}
                        onChange={(e) =>
                          updateContentField(
                            "contact",
                            "location",
                            e.target.value,
                          )
                        }
                        placeholder="Indonesia"
                      />
                    </div>

                    <InputField
                      label="Social Links (comma separated)"
                      value={pageContent.contact.socials.join(", ")}
                      onChange={(e) =>
                        updateContentField(
                          "contact",
                          "socials",
                          e.target.value
                            .split(",")
                            .map((s) => s.trim())
                            .filter(Boolean),
                        )
                      }
                      placeholder="GitHub, LinkedIn, Twitter, Dribbble"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* PROJECTS TAB */}
          {activeTab === "projects" && (
            <div className="space-y-6 max-w-6xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-bold mb-1">Project Manager</h2>
                  <p className="text-gray-400">
                    Manage your portfolio projects in detail
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab("content")}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 rounded-xl font-medium transition-all shadow-lg shadow-blue-500/20"
                >
                  <span>Manage in Content Tab</span>
                  {Icons.arrowRight}
                </button>
              </div>

              <div className="animate-card bg-gray-800/30 backdrop-blur-sm p-12 rounded-2xl border border-gray-700/50 text-center">
                <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                  {Icons.projects}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Project Management
                </h3>
                <p className="text-gray-400 mb-6 max-w-md mx-auto">
                  We've moved project management to the "Page Content" tab for
                  better organization. Click the button above to manage your
                  projects.
                </p>
                <button
                  onClick={() => {
                    setActiveTab("content");
                    setActiveContentTab("projects");
                  }}
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-500 rounded-xl font-medium transition-colors"
                >
                  Go to Projects Section
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Progress Modal */}
      <Modal
        isOpen={showProgressModal}
        onClose={() => setShowProgressModal(false)}
        title={editingProgress ? "Edit Progress" : "Add New Progress"}
      >
        <form onSubmit={handleProgressSubmit} className="space-y-6">
          <InputField
            label="Skill Title"
            value={progressForm.title}
            onChange={(e) =>
              setProgressForm({ ...progressForm, title: e.target.value })
            }
            placeholder="e.g. React, TypeScript"
            required
          />

          <div>
            <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wider mb-3">
              Progress Level: {progressForm.percentage}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={progressForm.percentage}
              onChange={(e) =>
                setProgressForm({
                  ...progressForm,
                  percentage: parseInt(e.target.value),
                })
              }
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>Beginner</span>
              <span>Intermediate</span>
              <span>Advanced</span>
              <span>Expert</span>
            </div>
            <p className="text-center text-sm text-purple-400 mt-2 font-medium">
              {getLevelFromPercentage(progressForm.percentage)}
            </p>
          </div>

          <InputField
            label="Emoji"
            value={progressForm.emoji}
            onChange={(e) =>
              setProgressForm({ ...progressForm, emoji: e.target.value })
            }
            placeholder="📈"
          />

          <ColorPicker
            label="Color Theme"
            value={progressForm.color}
            onChange={(color) => setProgressForm({ ...progressForm, color })}
          />

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setShowProgressModal(false)}
              className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-xl transition-all font-medium shadow-lg shadow-purple-500/20"
            >
              {editingProgress ? "Update" : "Add Progress"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Dashboard;
