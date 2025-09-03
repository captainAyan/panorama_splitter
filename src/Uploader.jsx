import { useState, useRef } from "react";

export default function Uploader({ setFile }) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files[0]) setFile(e.target.files[0]);
  };

  const handleUploadClick = (e) => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Required to allow drop
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    console.log("enter");
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    if (isDragging) {
      console.log("exit");
      setIsDragging(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (isDragging) {
      setIsDragging(false);
      console.log("drop");
      setFile(e.dataTransfer.files[0]);
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
              Click to upload your original image
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
