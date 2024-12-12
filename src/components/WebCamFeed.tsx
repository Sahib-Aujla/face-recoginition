import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../store";
import { setWebCamError } from "../store/webcamSlice";
import * as faceapi from "face-api.js";
import { Button, Container } from "react-bootstrap";
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
  const handleImageCapture = async () => {
    console.log("here1");
    if (!isOn || !videoRef.current) return;
    const canvas = document.createElement("canvas");
    const width = videoRef.current.videoWidth;
    const height = videoRef.current.videoHeight;
    canvas.width = width;
    canvas.height = height;
    console.log("here2");

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    console.log("here3");

    ctx.drawImage(videoRef.current, 0, 0, width, height);
    const detections = await faceapi
      .detectAllFaces(canvas, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions()
      .withAgeAndGender();
    console.log(detections);
  };
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
      {isOn && (
        <Button variant="success" onClick={handleImageCapture}>
          Capture Image
        </Button>
      )}
    </>
  );
};

export default WebCamFeed;
