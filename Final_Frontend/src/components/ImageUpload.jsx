import { useState, useEffect, useRef } from 'react';

export const ImageUpload = ({ label, image, onChange }) => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (image) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(image);
    } else {
      setPreviewUrl(null);
    }
  }, [image]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    onChange(file);
  };

  const handleRemove = () => {
    onChange(null);
    fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-2">
      <label className="block text-gray-700">{label}</label>

      {/* Hidden native input */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        id="customFileInput"
      />

      {/* Custom trigger button */}
      <label
        htmlFor="customFileInput"
        className="inline-block px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-md cursor-pointer hover:bg-blue-600"
      >
        {image ? 'Replace Image' : 'Upload Image'}
      </label>

      {/* Preview & File Name */}
      {image && (
        <div className="flex items-start gap-4 mt-2">
          <img
            src={previewUrl}
            alt="Preview"
            className="h-24 w-24 object-cover rounded shadow"
          />
          <div className="flex-1">
            <p className="text-sm text-gray-700">{image.name}</p>
            <button
              type="button"
              onClick={handleRemove}
              className="text-red-500 text-sm mt-1 hover:underline"
            >
              Remove Image
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
