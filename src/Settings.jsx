import { AspectRatio, FillColor } from "./constants";

export default function Settings({
  aspectRatio,
  setAspectRatio,
  fillColor,
  setFillColor,
  padding,
  setPadding,
}) {
  const handleAspectRatioChange = (e) => {
    setAspectRatio(e.target.value);
  };

  const handleFillColorChange = (e) => {
    setFillColor(e.target.value);
  };

  const handlePaddingChange = (e) => {
    setPadding(parseInt(e.target.value) || 0);
  };

  return (
    <>
      <h2 className="card-header">Aspect ratio</h2>
      <div className="radio-group">
        <label className="radio-option">
          <input
            type="radio"
            name="aspectRatio"
            value={AspectRatio.FourToFive}
            checked={aspectRatio == AspectRatio.FourToFive}
            onChange={handleAspectRatioChange}
          />
          <span className="custom-radio-label">4:5 ratio</span>
        </label>

        <label className="radio-option">
          <input
            type="radio"
            name="aspectRatio"
            value={AspectRatio.Square}
            checked={aspectRatio == AspectRatio.Square}
            onChange={handleAspectRatioChange}
          />
          <span className="custom-radio-label">Square</span>
        </label>
      </div>

      <h2 className="card-header">Background color</h2>
      <div className="radio-group">
        <label className="radio-option">
          <input
            type="radio"
            name="Black"
            value={FillColor.BLACK}
            checked={fillColor === FillColor.BLACK}
            onChange={handleFillColorChange}
          />
          <span
            style={{
              marginRight: "8px",
              width: "16px",
              height: "16px",
              backgroundColor: "black",
            }}
          ></span>
          <span className="custom-radio-label">Black</span>
        </label>

        <label className="radio-option">
          <input
            type="radio"
            name="White"
            value={FillColor.WHITE}
            checked={fillColor === FillColor.WHITE}
            onChange={handleFillColorChange}
          />
          <span
            style={{
              marginRight: "8px",
              width: "15px",
              height: "15px",
              backgroundColor: "white",
              border: "solid black 1px",
            }}
          ></span>
          <span className="custom-radio-label">White</span>
        </label>
      </div>

      <h2 className="card-header">Full image padding</h2>
      <div>
        <input
          type="text"
          className="text-input"
          value={padding}
          onChange={handlePaddingChange}
        />
      </div>
    </>
  );
}
