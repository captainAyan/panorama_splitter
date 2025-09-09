import { useRef, useState, useEffect } from "react";
import { useStore } from "./store";

const Cropper = ({ image, setCropData }) => {
  const maxResolution = 650;

  let [canvasWidth, setCanvasWidth] = useState(maxResolution);
  let [canvasHeight, setCanvasHeight] = useState(
    (maxResolution / image.width) * image.height
  );

  const initialCropMargin = 50;
  const dragBoundaryTolerance = 50;
  const cropControllerGrabThreshold = 10;
  const cropControllerWidth = 10;

  const cropControllerColor = "#00ff00";
  const croppedAreaColor = "#000000aa";
  const cropLineColor = "#ff00ff";

  const canvasRef = useRef(null);

  const [topLeftCropController, setTopLeftCropController] = useState({
    x: initialCropMargin,
    y: initialCropMargin,
  });
  const [bottomRightCropController, setBottomRightCropController] = useState({
    x: canvasWidth - initialCropMargin,
    y: canvasHeight - initialCropMargin,
  });

  const [draggingCropController, setDraggingCropController] = useState(null); // 'topLeft' or 'bottomRight'

  const aspectRatio = useStore((store) => store.aspectRatio);

  useEffect(() => {
    updateCropData();

    const canvas = canvasRef.current;
    const resizeCanvas = () => {
      console.log("resizing");
      const rect = canvas.getBoundingClientRect();
      setCanvasWidth(parseInt(rect.width));
      setCanvasHeight(parseInt(rect.height));

      setTopLeftCropController({ x: initialCropMargin, y: initialCropMargin });
      setBottomRightCropController({
        x: parseInt(rect.width) - initialCropMargin,
        y: parseInt(rect.height) - initialCropMargin,
      });
    };

    resizeCanvas(); // Initial resize
    window.addEventListener("resize", resizeCanvas);

    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  // Handling mouse down events
  const startDrag = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Check if the mouse is near the top-left or bottom-right nodes
    if (isNearNode(mouseX, mouseY, topLeftCropController)) {
      setDraggingCropController("topLeft");
    } else if (isNearNode(mouseX, mouseY, bottomRightCropController)) {
      setDraggingCropController("bottomRight");
    }

    canvas.style.cursor = "grabbing";
  };

  const isNearNode = (mouseX, mouseY, cropController) => {
    return (
      mouseX >= cropController.x - cropControllerGrabThreshold &&
      mouseX <=
        cropController.x + cropControllerWidth + cropControllerGrabThreshold &&
      mouseY >= cropController.y - cropControllerGrabThreshold &&
      mouseY <=
        cropController.y + cropControllerWidth + cropControllerGrabThreshold
    );
  };

  const drag = (e) => {
    if (!draggingCropController) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    if (draggingCropController === "topLeft") {
      let newTopLeftCropController = {
        x: mouseX,
        y: mouseY,
      };

      newTopLeftCropController.x = Math.max(
        0,
        Math.min(
          newTopLeftCropController.x,
          bottomRightCropController.x - dragBoundaryTolerance
        )
      );
      newTopLeftCropController.y = Math.max(
        0,
        Math.min(
          newTopLeftCropController.y,
          bottomRightCropController.y - dragBoundaryTolerance
        )
      );

      setTopLeftCropController(newTopLeftCropController);

      setBottomRightCropController((prev) => ({
        x: Math.max(prev.x, newTopLeftCropController.x + dragBoundaryTolerance),
        y: Math.max(prev.y, newTopLeftCropController.y + dragBoundaryTolerance),
      }));
    } else if (draggingCropController === "bottomRight") {
      let newBottomRight = {
        x: mouseX,
        y: mouseY,
      };

      newBottomRight.x = Math.min(
        canvasWidth,
        Math.max(
          newBottomRight.x,
          topLeftCropController.x + dragBoundaryTolerance
        )
      );
      newBottomRight.y = Math.min(
        canvasHeight,
        Math.max(
          newBottomRight.y,
          topLeftCropController.y + dragBoundaryTolerance
        )
      );

      setBottomRightCropController(newBottomRight);

      setTopLeftCropController((prev) => ({
        x: Math.min(prev.x, newBottomRight.x - dragBoundaryTolerance),
        y: Math.min(prev.y, newBottomRight.y - dragBoundaryTolerance),
      }));
    }
  };

  const stopDrag = () => {
    const canvas = canvasRef.current;
    canvas.style.cursor = "grab";
    if (draggingCropController) {
      setDraggingCropController(null);

      updateCropData();
    }
  };

  const updateCropData = () => {
    const realImageCropX = parseInt(
      (topLeftCropController.x / canvasWidth) * image.width
    );
    const realImageCropY = parseInt(
      (topLeftCropController.y / canvasHeight) * image.height
    );
    const realImageCropWidth = parseInt(
      ((bottomRightCropController.x - topLeftCropController.x) / canvasWidth) *
        image.width
    );
    const realImageCropHeight = parseInt(
      ((bottomRightCropController.y - topLeftCropController.y) / canvasHeight) *
        image.height
    );

    setCropData({
      x: realImageCropX,
      y: realImageCropY,
      width: realImageCropWidth,
      height: realImageCropHeight,
    });
  };

  // Draw the canvas on each render
  const drawCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Clear the canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // draw the image
    ctx.drawImage(image, 0, 0, canvasWidth, canvasHeight);

    // cover up cropped out areas
    ctx.fillStyle = croppedAreaColor;
    ctx.fillRect(0, 0, topLeftCropController.x, canvas.height); // left
    ctx.fillRect(
      topLeftCropController.x,
      0,
      bottomRightCropController.x - topLeftCropController.x,
      topLeftCropController.y
    ); // top
    ctx.fillRect(
      bottomRightCropController.x,
      0,
      canvas.width - bottomRightCropController.x,
      canvas.height
    ); // right
    ctx.fillRect(
      topLeftCropController.x,
      bottomRightCropController.y,
      bottomRightCropController.x - topLeftCropController.x,
      canvas.height - bottomRightCropController.y
    ); // bottom

    // Draw the square outline (top-left to bottom-right)
    ctx.beginPath();
    ctx.rect(
      topLeftCropController.x,
      topLeftCropController.y,
      bottomRightCropController.x - topLeftCropController.x,
      bottomRightCropController.y - topLeftCropController.y
    );
    ctx.lineWidth = 2;
    ctx.strokeStyle = cropLineColor;
    ctx.setLineDash([4, 8]); // Dashed outline
    ctx.stroke();

    // Draw the draggable crop controllers
    ctx.fillStyle = cropControllerColor;
    ctx.fillRect(
      topLeftCropController.x - cropControllerWidth / 2,
      topLeftCropController.y - cropControllerWidth / 2,
      cropControllerWidth,
      cropControllerWidth
    );
    ctx.fillRect(
      bottomRightCropController.x - cropControllerWidth / 2,
      bottomRightCropController.y - cropControllerWidth / 2,
      cropControllerWidth,
      cropControllerWidth
    );

    // panorama splitting reference lines
    let cropWidth = bottomRightCropController.x - topLeftCropController.x;
    let cropHeight = bottomRightCropController.y - topLeftCropController.y;

    let frameWidth = Math.abs(cropHeight * aspectRatio);
    let frameCount = Math.floor(cropWidth / frameWidth); // full frames, not partially filled ones

    for (let i = 1; i <= frameCount; i++) {
      ctx.beginPath();
      ctx.moveTo(
        i * frameWidth + topLeftCropController.x,
        topLeftCropController.y
      );
      ctx.lineTo(
        i * frameWidth + topLeftCropController.x,
        bottomRightCropController.y
      );
      ctx.closePath();
      ctx.stroke();
    }
  };

  // Hook to update the canvas every time the crop controllers change
  useEffect(() => {
    drawCanvas();
  }, [
    topLeftCropController,
    bottomRightCropController,
    aspectRatio,
    canvasWidth,
    canvasHeight,
  ]);

  return (
    <canvas
      ref={canvasRef}
      width={canvasWidth}
      height={canvasHeight}
      style={{
        // border: "1px solid #000",
        cursor: "grab",

        marginTop: "20px",
        width: "100%",
        height: "100%",
        display: "block",
        borderRadius: "8px",
      }}
      onMouseDown={startDrag}
      onMouseMove={drag}
      onMouseUp={stopDrag}
      onMouseLeave={stopDrag}
    />
  );
};

export default Cropper;
