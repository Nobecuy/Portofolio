---
description: Workflow untuk menambahkan fitur baru ke portfolio
---

# Workflow: Add New Feature

Workflow ini digunakan untuk menambahkan fitur baru ke portfolio website dengan struktur yang terorganisir.

## Pre-requisites
- Pastikan sedang di branch yang benar
- Firebase sudah terkonfigurasi
- Struktur folder sudah sesuai standar

## Steps

### 1. Planning
- Identifikasi fitur yang akan ditambahkan
- Tentukan apakah perlu backend (Firebase) atau frontend only
- Buat daftar komponen/halaman yang perlu dibuat/diubah

### 2. Backend Setup (jika diperlukan)
- Tambahkan service di `src/firebase.js` jika perlu CRUD
- Update collection structure di Firestore
- Pastikan security rules sudah sesuai

### 3. Admin Dashboard
- Tambahkan tab/section baru di Dashboard.jsx jika perlu admin control
- Buat handlers untuk CRUD operations
- Tambahkan UI components (forms, tables, cards)

### 4. User-facing Pages
- Update/create pages di `src/pages/user/`
- Integrasikan dengan data dari Firebase
- Tambahkan animations dengan GSAP
- Pastikan responsive design

### 5. Routing
- Update `src/routes/AppRoutes.jsx` jika ada halaman baru
- Pastikan route protection sudah benar

### 6. Testing
- Test dari admin dashboard
- Test di halaman user
- Cek mobile responsiveness
- Verifikasi data tersimpan di Firebase

### 7. Polish
- Tambahkan loading states
- Error handling
- Success notifications
- GSAP animations

## Common Patterns

### Adding Image Upload Support
```javascript
// 1. Add to firebase.js
export const storageService = {
  uploadImage: async (file, path) => {
    const storageRef = ref(storage, `${path}/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  },
};

// 2. Add handler in Dashboard
const handleImageUpload = async (index, file) => {
  const imageUrl = await storageService.uploadImage(file, 'folder');
  updateField(index, 'image', imageUrl);
};

// 3. Update UI to show image
{image ? <img src={image} /> : <div>Fallback</div>}
```

### Adding New Section to OnePage
1. Add default content structure
2. Fetch data in useEffect
3. Create section JSX with animations
4. Update navigation items

### Adding Admin Controls
1. Add state handlers
2. Create form UI
3. Integrate with Firebase service
4. Add confirmation dialogs
5. Show success/error messages

## File Structure
```
src/
├── firebase.js           # Add services here
├── pages/
│   ├── user/
│   │   └── OnePage.jsx   # User-facing page
│   └── admin/
│       └── Dashboard.jsx # Admin controls
└── routes/
    └── AppRoutes.jsx     # Add routes here
```

## Checklist
- [ ] Feature works in admin dashboard
- [ ] Feature displays correctly on user page
- [ ] Images upload correctly (if applicable)
- [ ] Data saves to Firebase
- [ ] Mobile responsive
- [ ] GSAP animations smooth
- [ ] No console errors
- [ ] Loading states added
