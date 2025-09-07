import { useStore } from "./store";

export default function Details({ image }) {
  const aspectRatio = useStore((store) => store.aspectRatio);

  return (
    <>
      <h2 className="card-header">Image details</h2>

      <table style={{ width: "100%" }}>
        <tbody>
          <tr>
            <td>Original Size: </td>
            <td style={{ textAlign: "right" }}>
              {image?.width}px x{image?.height}px
            </td>
          </tr>
          <tr>
            <td>Number of Slices: </td>
            <td style={{ textAlign: "right" }}>
              {Math.ceil(image?.width / (image?.height * aspectRatio))}
            </td>
          </tr>
          <tr>
            <td>Slice Resolution: </td>
            <td style={{ textAlign: "right" }}>
              {Math.floor(image?.height * aspectRatio)}
              px x {image?.height}px
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
}
