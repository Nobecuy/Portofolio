import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService, projectsService } from "../../firebase";

const ProjectsManager = () => {
  const [projectsList, setProjectsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    category: "Web App",
    description: "",
    image: "🚀",
    tech: [],
    link: "",
    github: ""
  });

  const categories = ["Web App", "Website", "Mobile", "AI/ML"];
  const techOptions = [
    "React", "Vue.js", "Angular", "Next.js", "TypeScript", "JavaScript",
    "Node.js", "Express", "MongoDB", "PostgreSQL", "Firebase", "AWS",
    "TailwindCSS", "Bootstrap", "CSS", "HTML", "Python", "Django",
    "Flask", "TensorFlow", "React Native", "Flutter", "Docker", "Git"
  ];

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const data = await projectsService.getAll();
      setProjectsList(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await authService.logout();
    navigate("/admin/login");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    alert('handleSubmit called!');
    alert(`Form data: ${JSON.stringify(formData, null, 2)}`);
    console.log('Submitting form data:', formData);
    console.log('Form image path:', formData.image);
    try {
      if (editingId) {
        console.log('Updating project with ID:', editingId);
        await projectsService.update(editingId, formData);
        alert('Project updated successfully!');
      } else {
        console.log('Adding new project');
        await projectsService.add(formData);
        alert('Project added successfully!');
      }
      setShowModal(false);
      setEditingId(null);
      resetForm();
      fetchProjects();
    } catch (error) {
      console.error("Error saving project:", error);
      alert(`Error: ${error.message}`);
    }
  };

  const handleEdit = (project) => {
    console.log('Editing project:', project);
    console.log('Project image:', project.image);
    setFormData(project);
    setEditingId(project.id);
    setShowModal(true);
    
    // Set image preview if it's a local image
    if (project.image?.startsWith('/img/')) {
      setImagePreview(project.image);
      alert(`Existing image found: ${project.image}`);
    } else {
      setImagePreview(null);
      alert(`No local image found. Current image: ${project.image}`);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Yakin mau hapus project ini?")) {
      try {
        await projectsService.delete(id);
        fetchProjects();
      } catch (error) {
        console.error("Error deleting:", error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      category: "Web App",
      description: "",
      image: "🚀",
      tech: [],
      link: "",
      github: ""
    });
    setImageFile(null);
    setImagePreview(null);
  };

  const handleTechToggle = (tech) => {
    setFormData(prev => ({
      ...prev,
      tech: prev.tech.includes(tech)
        ? prev.tech.filter(t => t !== tech)
        : [...prev.tech, tech]
    }));
  };

  const handleImageUpload = async (file) => {
    if (!file) return null;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return null;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return null;
    }
    
    setUploading(true);
    
    try {
      // Create FormData for upload
      const formData = new FormData();
      formData.append('image', file);
      
      // Upload to server
      const response = await fetch('http://localhost:3001/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      
      const result = await response.json();
      
      // Create object URL for preview
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      
      return result.imagePath;
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Make sure upload server is running on port 3001');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    alert(`File selected: ${file?.name}`);
    if (file) {
      setImageFile(file);
      const imagePath = await handleImageUpload(file);
      alert(`Image path returned: ${imagePath}`);
      if (imagePath) {
        setFormData(prev => ({ ...prev, image: imagePath }));
        alert(`Form data updated with image: ${imagePath}`);
      }
    }
  };

  const emojis = ["🚀", "💻", "🎨", "📱", "🤖", "🛒", "📋", "🌤️", "🎮", "📊"];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="text-purple-400 hover:text-purple-300 transition-colors"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-2xl font-bold text-white">Projects Manager</h1>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
        >
          Logout
        </button>
      </header>

      <main className="p-6 max-w-7xl mx-auto">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <h3 className="text-gray-400 text-sm font-medium">Total Projects</h3>
            <p className="text-3xl font-bold text-white mt-2">{projectsList.length}</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <h3 className="text-gray-400 text-sm font-medium">Web Apps</h3>
            <p className="text-3xl font-bold text-blue-400 mt-2">
              {projectsList.filter(p => p.category === "Web App").length}
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <h3 className="text-gray-400 text-sm font-medium">Mobile</h3>
            <p className="text-3xl font-bold text-green-400 mt-2">
              {projectsList.filter(p => p.category === "Mobile").length}
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <h3 className="text-gray-400 text-sm font-medium">AI/ML</h3>
            <p className="text-3xl font-bold text-purple-400 mt-2">
              {projectsList.filter(p => p.category === "AI/ML").length}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">Manage Projects</h2>
          <button
            onClick={() => {
              setEditingId(null);
              resetForm();
              setShowModal(true);
            }}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-all transform hover:scale-105"
          >
            + Add Project
          </button>
        </div>

        {/* Projects List */}
        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projectsList.map((project) => (
              <div
                key={project.id}
                className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-purple-500/50 transition-all group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 flex items-center justify-center">
                      {project.image?.startsWith('/img/') ? (
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <span className="text-2xl">{project.image}</span>
                      )}
                    </div>
                    <div>
                      <span className="inline-block px-3 py-1 bg-gray-700 text-gray-300 text-xs rounded-full mb-2">
                        {project.category}
                      </span>
                      <h3 className="text-lg font-semibold text-white">
                        {project.title}
                      </h3>
                    </div>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEdit(project)}
                      className="p-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-colors"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="p-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {project.description}
                </p>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {project.tech.slice(0, 3).map((tech) => (
                    <span
                      key={tech}
                      className="text-xs px-2 py-1 bg-gray-700 text-gray-300 rounded"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.tech.length > 3 && (
                    <span className="text-xs px-2 py-1 bg-gray-700 text-gray-400 rounded">
                      +{project.tech.length - 3}
                    </span>
                  )}
                </div>

                {/* Links */}
                <div className="flex gap-2 text-sm">
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-400 hover:text-purple-300"
                    >
                      🔗 Live
                    </a>
                  )}
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-400 hover:text-purple-300"
                    >
                      🐱 Code
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-2xl border border-gray-700 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-white mb-6">
              {editingId ? "Edit Project" : "Add New Project"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-2 text-sm">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 text-sm">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-2 text-sm">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:outline-none h-24 resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2 text-sm">Project Image</label>
                <div className="space-y-4">
                  {/* Image Upload */}
                  <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 hover:border-purple-500 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer flex flex-col items-center justify-center py-4"
                    >
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-20 h-20 object-cover rounded-lg mb-2"
                        />
                      ) : (
                        <div className="w-20 h-20 bg-gray-700 rounded-lg flex items-center justify-center mb-2">
                          <span className="text-3xl">📷</span>
                        </div>
                      )}
                      <span className="text-sm text-gray-400">
                        {uploading ? "Uploading..." : "Click to upload image"}
                      </span>
                      <span className="text-xs text-gray-500 mt-1">
                        PNG, JPG up to 5MB
                      </span>
                    </label>
                  </div>

                  {/* Emoji Options */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">Or choose emoji:</span>
                    <div className="flex gap-2 flex-wrap">
                      {emojis.map(emoji => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, image: emoji });
                            setImagePreview(null);
                          }}
                          className={`text-2xl p-2 rounded ${formData.image === emoji ? "bg-purple-600" : "bg-gray-700"} hover:bg-purple-600 transition-colors`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-2 text-sm">Technologies</label>
                <div className="grid grid-cols-3 gap-2 max-h-32 overflow-y-auto bg-gray-700 p-3 rounded-lg">
                  {techOptions.map(tech => (
                    <label key={tech} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={formData.tech.includes(tech)}
                        onChange={() => handleTechToggle(tech)}
                        className="rounded"
                      />
                      <span className="text-gray-300">{tech}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-2 text-sm">Live Link</label>
                  <input
                    type="url"
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                    placeholder="https://example.com"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 text-sm">GitHub Link</label>
                  <input
                    type="url"
                    value={formData.github}
                    onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                    placeholder="https://github.com/username/repo"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  {editingId ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsManager;
