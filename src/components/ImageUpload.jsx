import { useState, useCallback, memo } from "react";
import storageService from "../firebase/storageService";

const ImageUpload = memo(
  ({
    image,
    onUpload,
    onRemove,
    label = "Upload Image",
    folder = "img",
    className = "",
  }) => {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleFileChange = useCallback(
      async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validasi
        if (!file.type.startsWith("image/")) {
          alert("Please select an image file (PNG, JPG, JPEG)");
          return;
        }

        if (file.size > 5 * 1024 * 1024) {
          alert("File size must be less than 5MB");
          return;
        }

        setUploading(true);
        setProgress(0);

        try {
          // Simulate progress
          const progressInterval = setInterval(() => {
            setProgress((p) => Math.min(p + 15, 85));
          }, 100);

          const result = await storageService.uploadImage(file, folder);

          clearInterval(progressInterval);
          setProgress(100);

          onUpload(result.url);

          setTimeout(() => {
            setUploading(false);
            setProgress(0);
          }, 400);
        } catch (error) {
          alert("Upload failed: " + error.message);
          setUploading(false);
          setProgress(0);
        }
      },
      [folder, onUpload],
    );

    if (image) {
      return (
        <div className={`relative group ${className}`}>
          <img
            src={image}
            alt="Preview"
            className="w-full h-32 object-cover rounded-xl border border-gray-700 bg-gray-900"
          />
          <button
            onClick={onRemove}
            className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg"
            type="button"
            title="Remove image"
          >
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 rounded-b-xl">
            <p className="text-xs text-white truncate">
              {image.split("/").pop().split("?")[0].substring(0, 25)}...
            </p>
          </div>
        </div>
      );
    }

    return (
      <label
        className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-600 rounded-xl cursor-pointer hover:border-purple-500 hover:bg-purple-500/5 transition-all group ${className}`}
      >
        {uploading ? (
          <div className="text-center">
            <div className="w-10 h-10 border-3 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <span className="text-sm text-purple-400 font-medium">
              {progress}%
            </span>
          </div>
        ) : (
          <>
            <svg
              className="w-8 h-8 text-gray-500 group-hover:text-purple-400 transition-colors mb-2"
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
            <span className="text-sm text-gray-400 group-hover:text-gray-300 font-medium">
              {label}
            </span>
            <span className="text-xs text-gray-500 mt-1">
              PNG, JPG up to 5MB
            </span>
          </>
        )}
        <input
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/webp"
          className="hidden"
          onChange={handleFileChange}
          disabled={uploading}
        />
      </label>
    );
  },
);

export default ImageUpload;
