import { useState } from "react";

import "./App.css";
import Uploader from "./Uploader";
import Viewer from "./Viewer";
import Details from "./Details";
import Settings from "./Settings";
import { AspectRatio, FillColor } from "./constants";

function App() {
  const [slices, setSlices] = useState([]);
  const [image, setImage] = useState();
  const [aspectRatio, setAspectRatio] = useState(AspectRatio.FourToFive);
  const [fillColor, setFillColor] = useState(FillColor.BLACK);

  const handleImageRemoval = () => {
    setImage(null);
  };

  const handleGenerate = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const frame_height = image.height;
    const frame_width = parseInt(frame_height * aspectRatio);

    canvas.width = frame_width;
    canvas.height = frame_height;

    let imageSources = [];

    for (let i = 0; i < Math.ceil(image.width / frame_width); i++) {
      ctx.fillStyle = fillColor;
      ctx.fillRect(0, 0, frame_width, frame_height);
      ctx.fill();

      ctx.drawImage(
        image,
        frame_width * i,
        0,
        frame_width,
        frame_height,
        0,
        0,
        frame_width,
        frame_height
      );

      imageSources = [...imageSources, canvas.toDataURL()];
    }

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
                  <Viewer imageLink={image.src} />

                  <img
                    src={image.src}
                    style={{ width: "100%", borderRadius: "16px" }}
                  />

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
              <Settings
                aspectRatio={aspectRatio}
                setAspectRatio={setAspectRatio}
                fillColor={fillColor}
                setFillColor={setFillColor}
              />

              {image && <Details image={image} aspectRatio={aspectRatio} />}
            </div>
          </div>

          {slices.length !== 0 && (
            <div className="card" style={{ marginTop: "32px" }}>
              <h2 className="card-header">Create your panorama slides</h2>
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
