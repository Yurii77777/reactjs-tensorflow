import { useRef, useEffect } from "react";
import { Box, Alert } from "@mui/material";
import * as faceapi from "face-api.js";

import useCamera from "../../hooks/useCamera";
import useLoadModels from "../../hooks/useLoadModels";

import { VIDEO_SIZES } from "../../constants/common";

const FaceDetection = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Активуємо веб-камеру, передаємо відео потік із веб-камери в елемент video
  // Activate the webcam, transfer the video stream from the webcam to the video element
  const { videoStream, error: errorCameraEnable } = useCamera({
    videoRef,
    width: VIDEO_SIZES.WIDTH,
    height: VIDEO_SIZES.HEIGHT,
  });

  // Завантажуємо моделі, якщо веб-камера успішнр активована
  // Uploading models if the webcam is successfully activated
  const { isModelsPrepared, isErrorOnModelsLoading } = useLoadModels(videoStream);

  useEffect(() => {
    const faceMyDetect = () => {
      setInterval(async () => {
        if (!videoStream) {
          return;
        }

        const detections = await faceapi.detectAllFaces(videoStream, new faceapi.TinyFaceDetectorOptions());
        // .withFaceLandmarks()
        // .withFaceExpressions();
        console.log("detections", detections);

        if (!canvasRef.current) {
          return;
        }

        let canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }

        canvas = faceapi.createCanvasFromMedia(videoStream);
        faceapi.matchDimensions(canvasRef.current, {
          width: videoStream.width,
          height: videoStream.height,
        });

        const resized = faceapi.resizeResults(detections, {
          width: videoStream.width,
          height: videoStream.height,
        });

        faceapi.draw.drawDetections(canvasRef.current, resized);
        // faceapi.draw.drawFaceLandmarks(canvasRef.current, resized);
        // faceapi.draw.drawFaceExpressions(canvasRef.current, resized);
      }, 1000);
    };

    if (isModelsPrepared) {
      faceMyDetect();
    }
  }, [isModelsPrepared, videoStream]);

  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
      {errorCameraEnable && <Alert severity="error">{errorCameraEnable}</Alert>}

      {isErrorOnModelsLoading && (
        <Alert severity="error">
          Помилка завантаження моделей! Спробуйте перезавантажити сторінку! Model loading error! Try reloading the page!
        </Alert>
      )}

      <Box sx={{ position: "relative" }}>
        <video ref={videoRef} id="camera" autoPlay muted playsInline></video>
        <canvas ref={canvasRef} style={{ position: "absolute", top: 0, left: 0 }}></canvas>
      </Box>
    </Box>
  );
};

export default FaceDetection;
