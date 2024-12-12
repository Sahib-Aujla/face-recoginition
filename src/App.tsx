import * as faceapi from "face-api.js";
import { useEffect } from "react";
import { Container } from "react-bootstrap";
import ControlBtns from "./components/ControlBtns";
function App() {
  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = process.env.PUBLIC_URL + "/models";
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      await faceapi.nets.ageGenderNet.loadFromUri(MODEL_URL);
      await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
      await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
    };
    loadModels();
  }, []);
  return (
    <Container fluid>
      <h1 className="my-3">Face Recognition App</h1>
      <div>
        <ControlBtns />
      </div>
    </Container>
  );
}

export default App;
