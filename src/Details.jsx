export default function Details({ image, aspectRatio: ratio }) {
  return (
    <>
      <h2 className="card-header">Image Details</h2>

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
              {Math.ceil(
                image?.width /
                  ((image?.height / ratio.denominator) * ratio.numerator)
              )}
            </td>
          </tr>
          <tr>
            <td>Slice Resolution: </td>
            <td style={{ textAlign: "right" }}>
              {Math.floor(
                (image?.height / ratio.denominator) * ratio.numerator
              )}
              px x {image?.height}px
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
}
