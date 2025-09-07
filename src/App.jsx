import { useState } from "react";
import { useStore } from "./store";

import "./App.css";
import Uploader from "./Uploader";
import Details from "./Details";
import Settings from "./Settings";
import Cropper from "./Cropper";
import { CroppingSettings } from "./constants";

function App() {
  const [slices, setSlices] = useState([]);
  const [image, setImage] = useState();
  const [cropData, setCropData] = useState();

  const aspectRatio = useStore((state) => state.aspectRatio);
  const fillColor = useStore((state) => state.fillColor);
  const padding = useStore((state) => state.padding);
  const allowCropping = useStore((state) => state.allowCropping);

  const handleImageRemoval = () => {
    setImage(null);
  };

  const handleGenerate = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const frameHeight =
      cropData && allowCropping ? cropData.height : image.height;
    const frameWidth = parseInt(frameHeight * aspectRatio);

    canvas.width = frameWidth;
    canvas.height = frameHeight;

    let imageSources = [];

    let sliceCount =
      cropData && allowCropping
        ? Math.ceil(cropData.width / frameWidth)
        : Math.ceil(image.width / frameWidth);
    for (let i = 0; i < sliceCount; i++) {
      ctx.fillStyle = fillColor;
      ctx.fillRect(0, 0, frameWidth, frameHeight);
      ctx.fill();

      let startingPoint =
        cropData && allowCropping
          ? {
              x: frameWidth * i + cropData.x,
              y: cropData.y,
            }
          : {
              x: frameWidth * i,
              y: 0,
            };

      ctx.drawImage(
        image,
        startingPoint.x,
        startingPoint.y,
        frameWidth,
        frameHeight,
        0,
        0,
        frameWidth,
        frameHeight
      );

      imageSources = [...imageSources, canvas.toDataURL()];
    }

    // Full panorama slide
    ctx.fillStyle = fillColor;
    ctx.fillRect(0, 0, frameWidth, frameHeight);
    ctx.fill();

    let paddingAdjustedFrameWidth = frameWidth - padding * 2;
    let scaledImageHeight =
      (paddingAdjustedFrameWidth / image.width) * frameHeight;

    ctx.drawImage(
      image,
      padding,
      (frameHeight - scaledImageHeight) / 2,
      frameWidth - padding * 2,
      scaledImageHeight
    );

    imageSources = [...imageSources, canvas.toDataURL()];

    setSlices(imageSources);
  };

  return (
    <div className="app-wrapper">
      <div className="gradient-bg">
        <div className="container">
          <header className="main-header">
            <h1 className="title">Insta Panorama Splitter</h1>
            <p className="subtitle">
              Easily split your panoramic images into Instagram-ready slices
              with perfect proportions
            </p>
          </header>

          <div className="cards-row">
            <div className="card card-left">
              <h2 className="card-header">Create your panorama slides</h2>

              {!image && <Uploader setImage={setImage} />}

              {image && (
                <>
                  {allowCropping === CroppingSettings.ALLOW_CROPPING && (
                    <Cropper image={image} setCropData={setCropData} />
                  )}
                  {allowCropping === CroppingSettings.NO_CROPPING && (
                    <img
                      src={image.src}
                      style={{
                        width: "100%",
                        marginTop: "20px",
                        display: "block",
                        borderRadius: "8px",
                      }}
                    />
                  )}

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "24px",
                    }}
                  >
                    <button
                      onClick={handleImageRemoval}
                      className="button red-button"
                    >
                      Remove Image
                    </button>

                    <button
                      className="button generate-button"
                      onClick={handleGenerate}
                    >
                      Generate Slices
                    </button>
                  </div>
                </>
              )}
            </div>

            <div className="card card-right">
              <Settings />

              {image && <Details image={image} />}
            </div>
          </div>

          {slices.length !== 0 && (
            <div className="card" style={{ marginTop: "32px" }}>
              <h2 className="card-header">Panorama Slides</h2>
              <div className="image-grid">
                {slices?.map((s, i) => (
                  <a href={s} target="_blank" download key={i}>
                    <img src={s} alt="" className="sliced-image" />
                  </a>
                ))}
              </div>
            </div>
          )}

          <footer>
            &copy; {new Date().getFullYear()} Insta Panorama Splitter
          </footer>
        </div>
      </div>
    </div>
  );
}

export default App;
