import { useState } from "react";
import { useStore } from "./store";

import "./App.css";
import Uploader from "./Uploader";
import Details from "./Details";
import Settings from "./Settings";
import Cropper from "./Cropper";
import {
  generateSliceImageURLArray,
  generateCroppedCanvas,
  croppedCanvasToImage,
} from "./util";

function App() {
  const [slices, setSlices] = useState([]);
  const [image, setImage] = useState();
  const [cropData, setCropData] = useState(); // {x, y, width, height}

  const aspectRatio = useStore((state) => state.aspectRatio);
  const fillColor = useStore((state) => state.fillColor);
  const padding = useStore((state) => state.padding);
  const isCroppingEnabled = useStore((state) => state.isCroppingEnabled);

  const handleImageRemoval = () => {
    setImage(null);
  };

  const handleGenerate = async () => {
    let img = image;

    if (isCroppingEnabled && cropData) {
      const croppedImg = generateCroppedCanvas(img, cropData);
      img = await croppedCanvasToImage(croppedImg);
    }

    setSlices(generateSliceImageURLArray(img, aspectRatio, fillColor, padding));
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
            <div className="card-left">
              <div className="card">
                <h2 className="card-header">Create your panorama slides</h2>

                {!image && <Uploader setImage={setImage} />}

                {image && (
                  <>
                    {isCroppingEnabled && (
                      <Cropper image={image} setCropData={setCropData} />
                    )}
                    {!isCroppingEnabled && (
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
            </div>

            <div className="card-right">
              <div className="card">
                <Settings />

                {image && <Details image={image} cropData={cropData} />}
              </div>
            </div>
          </div>

          <footer>
            &copy; {new Date().getFullYear()} Insta Panorama Splitter
          </footer>
        </div>
      </div>
    </div>
  );
}

export default App;
