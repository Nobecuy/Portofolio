import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

// CORS configuration
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
  credentials: true
}));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Ensure directories exist
const fs = await import('fs');
const projectsDir = path.join(__dirname, 'public/img/projects');
const skillsDir = path.join(__dirname, 'public/img/skills');

if (!fs.existsSync(projectsDir)) {
  fs.mkdirSync(projectsDir, { recursive: true });
}
if (!fs.existsSync(skillsDir)) {
  fs.mkdirSync(skillsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    try {
      // Get folder from query parameter or default to projects
      const folder = req.query.folder || 'projects';
      const uploadPath = path.join(__dirname, 'public/img', folder);
      
      // Ensure directory exists
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      
      console.log(`Uploading to: ${uploadPath}`);
      cb(null, uploadPath);
    } catch (error) {
      console.error('Destination error:', error);
      cb(error);
    }
  },
  filename: function (req, file, cb) {
    try {
      const timestamp = Date.now();
      const originalName = file.originalname || 'image';
      const filename = `${timestamp}_${originalName.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      console.log(`Filename: ${filename}`);
      cb(null, filename);
    } catch (error) {
      console.error('Filename error:', error);
      cb(error);
    }
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Serve static files
app.use(express.static('public'));

// Upload endpoint
app.post('/api/upload', (req, res) => {
  console.log('Upload request received');
  console.log('Headers:', req.headers);
  
  upload.single('image')(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      console.error('Multer error:', err);
      return res.status(400).json({ error: err.message });
    } else if (err) {
      console.error('Upload error:', err);
      return res.status(500).json({ error: err.message });
    }
    
    console.log('File uploaded successfully:', req.file);
    
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const folder = req.query.folder || 'projects';
    const imagePath = `/img/${folder}/${req.file.filename}`;
    console.log('Image path:', imagePath);
    
    res.json({ 
      success: true, 
      imagePath: imagePath 
    });
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Upload server running on http://localhost:${PORT}`);
});
