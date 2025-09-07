import React, { useRef, useEffect, useState } from "react";

export default function Canvas() {
  const canvasRef = useRef(null);
  const [block, setBlock] = useState({
    x: 100,
    y: 100,
    width: 10,
    height: 10,
  });
  const [isDragging, setIsDragging] = useState(false);
  const offsetRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "blue";
      ctx.fillRect(block.x, block.y, block.width, block.height);
      requestAnimationFrame(draw);
    };

    draw();
  }, [block]);

  const getMousePos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const handleMouseDown = (e) => {
    const mouse = getMousePos(e);

    // Check if inside block
    if (
      mouse.x >= block.x &&
      mouse.x <= block.x + block.width &&
      mouse.y >= block.y &&
      mouse.y <= block.y + block.height
    ) {
      setIsDragging(true);
      offsetRef.current = {
        x: mouse.x - block.x,
        y: mouse.y - block.y,
      };
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const mouse = getMousePos(e);

    setBlock((prev) => ({
      ...prev,
      x: mouse.x - offsetRef.current.x,
      y: mouse.y - offsetRef.current.y,
    }));
  };

  const stopDragging = () => {
    setIsDragging(false);
  };

  return (
    <canvas
      ref={canvasRef}
      width={500}
      height={500}
      style={{
        border: "1px solid black",
        cursor: isDragging ? "grabbing" : "grab",
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={stopDragging}
      onMouseLeave={stopDragging}
    />
  );
}
