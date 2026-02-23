import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  getStorage,
} from "firebase/storage";
import { storage } from "./config";

const storageService = {
  /**
   * Upload image to Firebase Storage
   * @param {File} file - File to upload
   * @param {string} folder - Folder path (default: 'img')
   * @returns {Promise<{url: string, path: string, name: string}>}
   */
  uploadImage: async (file, folder = "img") => {
    try {
      if (!file) throw new Error("No file provided");

      // Validasi ukuran (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error("File size too large (max 5MB)");
      }

      // Validasi tipe file
      if (!file.type.startsWith("image/")) {
        throw new Error("Only image files allowed");
      }

      // Buat nama file unik
      const timestamp = Date.now();
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.]/g, "_");
      const filename = `${timestamp}_${sanitizedName}`;

      // Path: img/skills/namafile.png atau img/projects/namafile.png
      const fullPath = `${folder}/${filename}`;
      const storageRef = ref(storage, fullPath);

      // Upload
      const snapshot = await uploadBytes(storageRef, file);

      // Get URL
      const downloadURL = await getDownloadURL(snapshot.ref);

      return {
        url: downloadURL,
        path: fullPath,
        name: filename,
      };
    } catch (error) {
      console.error("Storage upload error:", error);
      throw new Error(error.message || "Failed to upload image");
    }
  },

  /**
   * Delete image from storage
   * @param {string} path - Full path to file
   */
  deleteImage: async (path) => {
    try {
      if (!path) return;
      const imageRef = ref(storage, path);
      await deleteObject(imageRef);
      console.log("Image deleted:", path);
    } catch (error) {
      console.error("Delete error:", error);
      // Jangan throw error kalau file sudah tidak ada
      if (error.code !== "storage/object-not-found") {
        throw error;
      }
    }
  },

  /**
   * Get download URL from path
   * @param {string} path
   * @returns {Promise<string>}
   */
  getImageUrl: async (path) => {
    try {
      const imageRef = ref(storage, path);
      return await getDownloadURL(imageRef);
    } catch (error) {
      console.error("Get URL error:", error);
      throw error;
    }
  },
};

export default storageService;
