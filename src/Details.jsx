import { CroppingSettings } from "./constants";
import { useStore } from "./store";

export default function Details({ image, cropData }) {
  const aspectRatio = useStore((store) => store.aspectRatio);
  const allowCropping = useStore((store) => store.allowCropping);

  return (
    <>
      <h2 className="card-header">Image details</h2>

      <table style={{ width: "100%" }}>
        <tbody>
          <tr>
            <td>Original Size: </td>
            <td style={{ textAlign: "right" }}>
              {image.width}px x{image.height}px
            </td>
          </tr>
          <tr>
            <td>Number of Slices: </td>
            <td style={{ textAlign: "right" }}>
              {allowCropping === CroppingSettings.ALLOW_CROPPING
                ? cropData
                  ? Math.ceil(cropData.width / (cropData.height * aspectRatio))
                  : "-"
                : Math.ceil(image.width / (image.height * aspectRatio))}
            </td>
          </tr>
          <tr>
            <td>Slice Resolution: </td>
            <td style={{ textAlign: "right" }}>
              {allowCropping === CroppingSettings.ALLOW_CROPPING
                ? cropData
                  ? Math.floor(cropData.height * aspectRatio)
                  : "-"
                : Math.floor(image.height * aspectRatio)}
              px x{" "}
              {allowCropping === CroppingSettings.ALLOW_CROPPING
                ? cropData
                  ? cropData.height
                  : "-"
                : image.height}
              px
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
}
