# Nobedes Portfolio

A modern, interactive portfolio website showcasing my work as a Frontend Developer & Creative Coder. Built with React, Vite, and cutting-edge web technologies to deliver an exceptional user experience.

## ✨ Features

### 🎨 **Interactive Design**
- **Dynamic Theme System** - Seamless dark/light mode switching with smooth transitions
- **Custom Animations** - GSAP-powered scroll animations and micro-interactions
- **Responsive Layout** - Optimized for desktop, tablet, and mobile devices
- **Modern UI Components** - Built with Tailwind CSS and custom styling

### 🚀 **Core Sections**
- **Hero Section** - Animated introduction with gradient text effects
- **About Me** - Professional profile with statistics and skills showcase
- **Learning Progress** - Dynamic skill tracking with animated progress bars
- **Projects Gallery** - Interactive project showcase with spotlight effects
- **Tech Stack** - Skills visualization with hover animations
- **Experience Timeline** - Professional journey timeline
- **Contact Form** - Functional contact interface

### 🛠️ **Technical Features**
- **Admin Dashboard** - Content management system for portfolio updates
- **Firebase Integration** - Real-time data synchronization
- **Local Upload Server** - Express-based image upload functionality
- **Component Architecture** - Modular, reusable React components
- **Performance Optimized** - Lazy loading, code splitting, and optimized animations

## 🎯 **Project Showcase**

The portfolio features an innovative **ChromaGrid** component for project display:
- **Dynamic Grid Layout** - Responsive grid that adapts to content
- **Spotlight Effects** - Interactive hover animations with radial gradients
- **Smooth Transitions** - GSAP-powered animations for enhanced UX
- **Grayscale to Color** - Images transition from grayscale to full color on hover

## 🛠️ **Tech Stack**

### **Frontend**
- **React 18** - Modern hooks and component patterns
- **Vite** - Lightning-fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **GSAP** - Professional animation library
- **React Router** - Client-side routing

### **Backend & Services**
- **Firebase** - Real-time database and authentication
- **Express.js** - Local upload server for images
- **Multer** - File upload middleware

### **Development Tools**
- **ESLint** - Code quality and consistency
- **PostCSS** - CSS processing and optimization
- **Vite PWA** - Progressive Web App capabilities

## 📱 **Responsive Design**

- **Desktop** (1200px+) - Full grid layout with enhanced animations
- **Tablet** (768px-1199px) - Adapted grid and touch-friendly interactions
- **Mobile** (<768px) - Single-column layout with optimized performance

## 🎨 **Design System**

### **Color Palette**
- **Primary** - Purple (#8b5cf6) and Pink (#ec4899) gradients
- **Dark Theme** - Dark backgrounds with vibrant accent colors
- **Light Theme** - Clean whites with subtle purple accents

### **Typography**
- **Headings** - Bold, gradient text effects
- **Body** - Clean, readable sans-serif fonts
- **Interactive Elements** - Smooth hover states and transitions

## 🚀 **Getting Started**

### **Prerequisites**
- Node.js 18+ 
- npm or yarn package manager

### **Installation**

1. **Clone the repository**
   ```bash
   git clone https://github.com/nobedev/portfolio.git
   cd portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Start upload server** (for image uploads)
   ```bash
   node upload-server.js
   ```

5. **Open your browser**
   ```
   http://localhost:5173
   ```

### **Admin Access**
- Navigate to `/admin/login` for content management
- Use your credentials to access the dashboard
- Update projects, skills, and content in real-time

## 📁 **Project Structure**

```
portfolio/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ChromaGrid.jsx  # Interactive project grid
│   │   ├── ThemeToggle.jsx # Theme switcher
│   │   └── ProfileCard.jsx # User profile component
│   ├── context/            # React context providers
│   │   └── ThemeContext.jsx # Theme management
│   ├── pages/              # Page components
│   │   ├── user/          # Public-facing pages
│   │   └── admin/         # Admin dashboard
│   ├── firebase/           # Firebase services
│   └── styles/            # Global styles and CSS
├── public/                # Static assets
│   └── img/               # Project and skill images
└── upload-server.js       # Express upload server
```

## 🎯 **Performance Features**

- **Lazy Loading** - Images and components load on demand
- **Code Splitting** - Optimized bundle sizes
- **Smooth Animations** - 60fps animations with GPU acceleration
- **Responsive Images** - Optimized image delivery
- **Minimal Repaints** - Efficient rendering strategies

## 🔧 **Customization**

### **Theme Customization**
- Modify `src/context/ThemeContext.jsx` for theme logic
- Update `src/index.css` for color variables
- Adjust component styles in respective files

### **Content Management**
- Use the admin dashboard for easy content updates
- Modify Firebase collections for direct data changes
- Update `src/pages/user/OnePage.jsx` for layout changes

## 🌟 **Highlights**

- **Zero Configuration** - Works out of the box
- **Modern Stack** - Latest React features and best practices
- **Professional Design** - Production-ready UI/UX
- **Scalable Architecture** - Easy to extend and maintain
- **Performance Optimized** - Fast loading and smooth interactions

## 📄 **License**

This project is open source and available under the [MIT License](LICENSE).

## 🤝 **Connect**

- **Portfolio** - [nobedev.vercel.app](https://nobedev.vercel.app)
- **GitHub** - [github.com/nobedev](https://github.com/nobedev)
- **LinkedIn** - [linkedin.com/in/nobedev](https://linkedin.com/in/nobedev)

---

*Built with ❤️ using React, Vite, and modern web technologies*
