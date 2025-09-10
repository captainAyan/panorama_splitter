export function generateSliceImageURLArray(
  image,
  aspectRatio,
  fillColor,
  padding
) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const frameHeight = image.height;
  const frameWidth = parseInt(frameHeight * aspectRatio);

  canvas.width = frameWidth;
  canvas.height = frameHeight;

  let imageSources = [];

  for (let i = 0; i < Math.ceil(image.width / frameWidth); i++) {
    ctx.fillStyle = fillColor;
    ctx.fillRect(0, 0, frameWidth, frameHeight);
    ctx.fill();

    ctx.drawImage(
      image,
      frameWidth * i,
      0,
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
  canvas.width = 1080; // frame width
  canvas.height = 1080 / aspectRatio; // frame height

  ctx.fillStyle = fillColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fill();

  let paddingAdjustedFrameWidth = canvas.width - padding * 2;
  let scaledImageHeight =
    (paddingAdjustedFrameWidth / canvas.width) * image.height;
  let topPadding = (canvas.height - scaledImageHeight) / 2;

  ctx.drawImage(
    image,
    padding,
    topPadding,
    paddingAdjustedFrameWidth,
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
