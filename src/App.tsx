import * as faceapi from "face-api.js";
import { useEffect } from "react";
import ControlBtns from "./components/ControlBtns";
import WebCamFeed from "./components/WebCamFeed";
import WebCamOverlay from "./components/WebCamOverlay";
import CapturedImageOverlay from "./components/CapturedImageOverlay";
import { Container } from "react-bootstrap";
function App() {
  useEffect(() => {
    async function init() {
      const loadModels = async () => {
        const MODEL_URL = "/models";
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        await faceapi.nets.ageGenderNet.loadFromUri(MODEL_URL);
        await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
        await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
      };
      await loadModels();
    }
    init();
  }, []);
  return (
    <Container
      fluid
      style={{
        width: "100%",
        backgroundImage: "url(./bg.webp)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
      }}
      className="m-0 p-0"
    >
      <h1 className="p-3 text-center fw-bold">Face Recognition App</h1>
      <h4 className="p-3 text-center">
        Click on start to see Real Time face detection.
      </h4>
      <ControlBtns />
      <div className="d-flex justify-content-center">
        <div style={{ position: "relative" }}>
          <WebCamFeed />
          <WebCamOverlay />
        </div>
      </div>
      <CapturedImageOverlay />
    </Container>
  );
}

export default App;
