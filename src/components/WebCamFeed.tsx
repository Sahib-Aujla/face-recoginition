import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../store";
import { setWebCamError } from "../store/webcamSlice";
import * as faceapi from "face-api.js";
import { Container } from "react-bootstrap";
import { setDetectedFaces } from "../store/faceSlice";
const WebCamFeed = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const isOn = useSelector((state: RootState) => state.webcamReducer.isOn);
  const dispatch = useAppDispatch();
  useEffect(() => {
    let stream: MediaStream = new MediaStream();
    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        dispatch(setWebCamError(error.message));
      }
    };
    if (isOn) {
      startCamera();
    } else {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isOn, dispatch]);
  useEffect(() => {
    const handleImageCapture = async () => {
      if (!isOn || !videoRef.current) return;
      const canvas = document.createElement("canvas");
      const width = videoRef.current.videoWidth;
      const height = videoRef.current.videoHeight;
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(videoRef.current, 0, 0, width, height);
      const detections = await faceapi
        .detectAllFaces(canvas, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions()
        .withAgeAndGender();
      console.log(detections);
      const faces = detections.map((d) => {
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
      const imgUrl = canvas.toDataURL("image/png");
      console.log(imgUrl);
      console.log(faces);
      dispatch(setDetectedFaces({ faceData: faces, imgUrl }));
    };
    const timer = setInterval(handleImageCapture, 3000);

    return () => {
      clearInterval(timer);
    };
  });

  return (
    <>
      <Container fluid>
        <video
          ref={videoRef}
          style={{ width: "100%", maxWidth: "600px" }}
          autoPlay
          playsInline
          muted
        />
      </Container>
    </>
  );
};

export default WebCamFeed;
