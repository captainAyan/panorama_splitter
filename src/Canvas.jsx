import React, { useRef, useEffect } from "react";

function Canvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw a red rectangle
    ctx.fillStyle = "red";
    ctx.fillRect(20, 20, 150, 100);

    // Draw text
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText("Hello Canvas", 30, 150);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={300}
      height={200}
      style={{ border: "1px solid black" }}
    />
  );
}

export default Canvas;
