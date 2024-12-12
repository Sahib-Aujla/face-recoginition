import { useState, useRef } from "react";
import * as faceapi from "face-api.js";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Spinner,
  Alert,
} from "react-bootstrap";

interface FaceData {
  x: number;
  y: number;
  width: number;
  height: number;
  age?: number;
  gender?: string;
  expression?: string;
}

const CapturedImageOverlay = () => {
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [faces, setFaces] = useState<FaceData[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const imgRef = useRef<HTMLImageElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    setSelectedFile(file || null);
    setImgUrl(null);
    setFaces([]);
    setError(null);
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      setError("Please select an image first.");
      return;
    }

    setError(null);
    const reader = new FileReader();
    reader.onload = async (e) => {
      const result = e.target?.result;
      if (typeof result === "string") {
        setImgUrl(result);
        await detectFaces(result);
      }
    };
    reader.readAsDataURL(selectedFile);
  };

  const detectFaces = async (imageDataUrl: string) => {
    try {
      setLoading(true);

      const img = new Image();
      img.src = imageDataUrl;

      await new Promise((resolve) => {
        img.onload = () => resolve(null);
      });

      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Unable to get canvas context.");

      ctx.drawImage(img, 0, 0, img.width, img.height);

      const detections = await faceapi
        .detectAllFaces(canvas, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions()
        .withAgeAndGender();

      const detectedFaces: FaceData[] = detections.map((d) => {
        const expressionEntries = Object.entries(d.expressions) as [
          keyof faceapi.FaceExpressions,
          number
        ][];

        const [bestExpression] = expressionEntries.reduce((prev, curr) =>
          curr[1] > prev[1] ? curr : prev
        );

        return {
          x: d.detection.box.x,
          y: d.detection.box.y,
          width: d.detection.box.width,
          height: d.detection.box.height,
          age: d.age,
          gender: d.gender,
          expression: bestExpression,
        };
      });

      setFaces(detectedFaces);
      setLoading(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <Container className="my-4">
      <Row className="mb-4">
        <Col>
          <h2 className="text-center">Uplaod Image to detect Faces</h2>
        </Col>
      </Row>

      <Row className="align-items-center mb-3 ">
        <Col xs={12} className="d-flex justify-content-center">
          <Form.Group controlId="formFile" className="mb-3">
            <Form.Label>Select an image file</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </Form.Group>
        </Col>
        <Col xs={12} className="d-flex justify-content-center">
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={loading || !selectedFile}
          >
            {loading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Processing...
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </Col>
      </Row>

      {error && (
        <Row className="mb-3">
          <Col>
            <Alert variant="danger">{error}</Alert>
          </Col>
        </Row>
      )}

      {imgUrl && !error && (
        <Row>
          <Col>
            <div
              style={{
                position: "relative",
                display: "inline-block",
              }}
            >
              <img
                ref={imgRef}
                src={imgUrl}
                alt="Captured"
                style={{ display: "block", maxWidth: "100%" }}
              />

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
                  <div
                    style={{
                      backgroundColor: "rgba(0,0,0,0.5)",
                      padding: "2px",
                    }}
                  >
                    {face.age && <div>Age: {face.age.toFixed(0)}</div>}
                    {face.gender && <div>Gender: {face.gender}</div>}
                    {face.expression && (
                      <div>Expression: {face.expression}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default CapturedImageOverlay;
