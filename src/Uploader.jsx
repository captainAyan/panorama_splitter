import { useState, useRef } from "react";

export default function Uploader({ setImage }) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState();
  const fileInputRef = useRef(null);

  const setImageFromFile = (file) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
      setImage(img);
    };

    img.onerror = () => {
      setError("Image failed to load");
    };
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setImageFromFile(e.target.files[0]);
    }
  };

  const handleUploadClick = (e) => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Required to allow drop
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (isDragging) {
      setIsDragging(false);
      setImageFromFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <>
      <button
        className="upload-button"
        onClick={handleUploadClick}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {!isDragging ? (
          <>
            <span role="img" className="emoji no-drag">
              📷
            </span>
            <h3 className="upload-title no-drag">Panorama Image</h3>
            <div className="upload-subtitle no-drag">
              Click or Drag to upload your original image
            </div>

            <div className="upload-subtitle no-drag" style={{ color: "red" }}>
              {error}
            </div>
          </>
        ) : (
          <>
            <h3
              className="upload-title no-drag"
              style={{ padding: "32px 0px" }}
            >
              Drop Your Panorama Image Here
            </h3>
          </>
        )}
      </button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: "none" }}
      />
    </>
  );
}
