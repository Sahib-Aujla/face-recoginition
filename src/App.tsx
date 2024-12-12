import * as faceapi from "face-api.js";
import { useEffect } from "react";
import { Container } from "react-bootstrap";
import ControlBtns from "./components/ControlBtns";
import WebCamFeed from "./components/WebCamFeed";
import FaceOverlay from "./components/FaceOverlay";
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
    <Container fluid>
      <h1 className="m-3 text-center">Face Recognition App</h1>
      <ControlBtns />

      <div style={{ position: "relative" }}>
        <WebCamFeed />
        <FaceOverlay />
      </div>
    </Container>
  );
}

export default App;
