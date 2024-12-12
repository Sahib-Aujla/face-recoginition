import { useSelector } from "react-redux";
import { RootState } from "../store";

const WebCamOverlay = () => {
  const faces = useSelector((state: RootState) => state.faceReducer.faces);
  const isOn = useSelector((state: RootState) => state.webcamReducer.isOn);
  if (!isOn) return;
  return (
    <div style={{ position: "absolute", top: 0, left: 0 }}>
      {faces.map((face, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            border: "2px solid green",
            left: face.x,
            top: face.y,
            width: face.width,
            height: face.height,
            pointerEvents: "none",
            color: "#fff",
            backgroundColor: "rgba(0,0,0,0.5)",
            fontSize: "12px",
          }}
        >
          <div>Age: {face.age?.toFixed(0)}</div>
          <div>Gender: {face.gender}</div>
          <div>Expression: {face.expression}</div>
        </div>
      ))}
    </div>
  );
};

export default WebCamOverlay;
