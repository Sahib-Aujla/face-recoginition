import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";

const CapturedImageOverlay: React.FC = () => {
  const { imgUrl, faces } = useSelector(
    (state: RootState) => state.faceReducer
  );

  if (!imgUrl) {
    return <div>No image captured yet.</div>;
  }

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      {/* The captured image */}
      <img src={imgUrl} alt="Captured" style={{ display: "block" }} />

      {/* Overlays for each detected face */}
      {faces.map((face, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: face.y,
            left: face.x,
            width: face.width,
            height: face.height,
            border: "2px solid #0f0",
            boxSizing: "border-box",
            backgroundColor: "rgba(0,0,0,0.2)",
            color: "#fff",
            fontSize: "12px",
            pointerEvents: "none",
          }}
        >
          {/* You can show metadata inside the bounding box or above it */}
          <div style={{ backgroundColor: "rgba(0,0,0,0.5)", padding: "2px" }}>
            {face.age && <div>Age: {face.age.toFixed(0)}</div>}
            {face.gender && <div>Gender: {face.gender}</div>}
            {face.expression && <div>Expression: {face.expression}</div>}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CapturedImageOverlay;
