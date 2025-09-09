export function generateSliceImageURLArray(
  image,
  aspectRatio,
  fillColor,
  padding
) {
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

  // Full panorama slide
  ctx.fillStyle = fillColor;
  ctx.fillRect(0, 0, frame_width, frame_height);
  ctx.fill();

  let paddingAdjustedFrameWidth = frame_width - padding * 2;
  let scaledImageHeight =
    (paddingAdjustedFrameWidth / image.width) * frame_height;

  ctx.drawImage(
    image,
    padding,
    (frame_height - scaledImageHeight) / 2,
    frame_width - padding * 2,
    scaledImageHeight
  );

  imageSources = [...imageSources, canvas.toDataURL()];

  return imageSources;
}

export function generateCroppedCanvas(image, cropData) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = cropData.width;
  canvas.height = cropData.height;

  ctx.drawImage(
    image,
    cropData.x,
    cropData.y,
    cropData.width,
    cropData.height,
    0,
    0,
    cropData.width,
    cropData.height
  );

  return canvas;
}

export function croppedCanvasToImage(croppedCanvas) {
  return new Promise((resolve) => {
    const dataURL = croppedCanvas.toDataURL();
    const img = new Image();
    img.onload = () => resolve(img);
    img.src = dataURL;
  });
}
