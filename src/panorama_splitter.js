import { createCanvas, loadImage } from "canvas"


export default async function x() {
  const image = await loadImage("src/assets/image1.jpg")
  
  const frame_height = image.height
  const frame_width = parseInt(frame_height*4/5);

  console.log("ORIGINAL", image.width, image.height)
  console.log("FRAME", frame_width, frame_height)

  const canvas = createCanvas(frame_width, frame_height)

  const ctx = canvas.getContext("2d")
  
  ctx.drawImage(image, 0, 0)

  return canvas
}

//x()

