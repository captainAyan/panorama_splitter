import { useEffect, useState } from "react";

import "./App.css";
import Uploader from "./Uploader";
import Viewer from "./Viewer";
import Details from "./Details";

const AspectRatio = Object.freeze({
  FourToFive: {
    label: "4:5",
    numerator: 4,
    denominator: 5,
  },
  Square: {
    label: "1:1",
    numerator: 1,
    denominator: 1,
  },
});

function App() {
  const [file, setFile] = useState();
  const [slices, setSlices] = useState([]);
  const [image, setImage] = useState();
  const [aspectRatio, setAspectRatio] = useState(AspectRatio.FourToFive);

  const handleImageRemoval = (e) => {
    setFile(null);
  };

  const handleAspectRatioChange = (e) => {
    if (e.target.value === AspectRatio.FourToFive.label)
      setAspectRatio(AspectRatio.FourToFive);
    else if (e.target.value === AspectRatio.Square.label)
      setAspectRatio(AspectRatio.Square);
  };

  useEffect(() => {
    if (file) {
      const img = new Image();
      img.src = URL.createObjectURL(file);

      img.onload = () => {
        setImage(img);
      };
    } else {
      setImage(null);
    }
  }, [file]);

  const handleGenerate = () => {
    if (!file) {
      console.log("no files selected");
      return;
    }

    console.log("width: ", image.width, "height: ", image.height);

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const frame_height = image.height;
    const frame_width = parseInt(
      (frame_height * aspectRatio.numerator) / aspectRatio.denominator
    );

    canvas.width = frame_width;
    canvas.height = frame_height;

    let imageSources = [];

    for (let i = 0; i < Math.ceil(image.width / frame_width); i++) {
      ctx.fillStyle = "black";
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

              {!file && <Uploader setFile={setFile} />}

              {/* FILE ADDED view */}
              {file && (
                <>
                  <Viewer imageLink={URL.createObjectURL(file)} />

                  <img
                    src={URL.createObjectURL(file)}
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
              <h2 className="card-header">Choose aspect ratio</h2>

              <div className="radio-group">
                <label className="radio-option">
                  <input
                    type="radio"
                    name="aspectRatio"
                    value={AspectRatio.FourToFive.label}
                    checked={aspectRatio.label == AspectRatio.FourToFive.label}
                    onChange={handleAspectRatioChange}
                  />
                  <span className="custom-radio-label">4:5 ratio</span>
                </label>

                <label className="radio-option">
                  <input
                    type="radio"
                    name="aspectRatio"
                    value={AspectRatio.Square.label}
                    checked={aspectRatio.label == AspectRatio.Square.label}
                    onChange={handleAspectRatioChange}
                  />
                  <span className="custom-radio-label">Square</span>
                </label>
              </div>

              {image && <Details image={image} aspectRatio={aspectRatio} />}
            </div>
          </div>

          {slices.length !== 0 && (
            <div className="card" style={{ marginTop: "32px" }}>
              <h2 className="card-header">Create your panorama slides</h2>
              <div className="image-grid">
                {slices?.map((s, i) => (
                  <a href={s} target="_blank" download>
                    <img src={s} alt="" className="sliced-image" key={i} />
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
