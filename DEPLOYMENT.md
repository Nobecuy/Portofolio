# Nobedes Portfolio - GitHub Pages Setup

## 🚀 Deployment Instructions

### **Problem Solved**
GitHub Pages tidak support Node.js upload server. Portfolio sekarang di-configure untuk:
- **Static build** - Generate `dist` folder dengan Vite
- **GitHub Actions** - Auto-deployment ke GitHub Pages
- **No server needed** - Pure static hosting

## 📁 **Files Added/Modified**

### **1. GitHub Actions Workflow**
- **File**: `.github/workflows/deploy.yml`
- **Function**: Auto-build dan deploy ke GitHub Pages
- **Trigger**: Setiap push ke main branch

### **2. Vite Configuration**
- **File**: `vite.config.js`
- **Changes**: Build configuration untuk static hosting
- **Output**: `dist/` folder dengan optimized assets

### **3. Package Scripts**
- **File**: `package.json`
- **Added**: `deploy` script untuk build dan commit
- **Command**: `npm run deploy`

## 🛠️ **Setup Instructions**

### **Step 1: Build Portfolio**
```bash
npm run build
```
- **Result**: `dist/` folder dengan static files
- **Assets**: Optimized images, CSS, JS

### **Step 2: GitHub Settings**
1. **Push ke GitHub**
   ```bash
   git add .
   git commit -m "Add GitHub Pages deployment"
   git push
   ```

2. **Enable GitHub Pages**
   - Buka repository settings
   - Scroll ke "Pages" section
   - Source: "Deploy from a branch"
   - Branch: "main"
   - Folder: "/root" (atau "/Portofolio")

### **Step 3: Automatic Deployment**
```bash
npm run deploy
```
- **Build**: Otomatis generate `dist/`
- **Commit**: Add `dist/` ke git
- **Push**: Deploy ke GitHub Pages

## 🌐 **Live URL**

Setelah deploy:
- **URL**: `https://username.github.io/Portofolio/`
- **Available**: 1-2 menit setelah deployment

## 🔧 **Configuration Details**

### **Vite Build Config**
```javascript
build: {
  outDir: 'dist',        // Output folder
  assetsDir: 'assets',     // Asset optimization
  sourcemap: true,        // Debug maps
}
```

### **GitHub Actions Workflow**
```yaml
- Build dengan Node.js 18
- Generate static files
- Deploy ke GitHub Pages
- Auto-trigger on push
```

## 📱 **Testing Locally**

### **Preview Build**
```bash
npm run build && npm run preview
```
- **URL**: `http://localhost:4173`
- **Test**: Semua fitur sebelum deploy

## 🎯 **Benefits**

✅ **No Server Required** - Pure static hosting
✅ **Free Hosting** - GitHub Pages gratis
✅ **Auto Deployment** - GitHub Actions otomatis
✅ **Fast Loading** - Optimized static files
✅ **HTTPS Ready** - Secure default dari GitHub
✅ **Custom Domain** - Bisa setup custom domain

## 🚨 **Important Notes**

### **Firebase vs Static**
- ❌ **Firebase**: Perlu server untuk upload
- ✅ **Static**: Tidak perlu server, files langsung di-host

### **Image Upload**
- **Development**: Upload server masih bisa untuk local development
- **Production**: Images di-include di build folder
- **Alternative**: Upload ke GitHub Releases atau CDN

## 🔄 **Next Steps**

1. **Build dan test** lokal
2. **Push ke GitHub**
3. **Enable GitHub Pages**
4. **Test live deployment**
5. **Setup custom domain** (optional)

---

*Portfolio siap untuk GitHub Pages hosting!* 🚀
