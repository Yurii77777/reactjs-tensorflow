import { useRef, useEffect, useState } from "react";
import { Box, Alert, Button } from "@mui/material";

import useCamera from "../../hooks/useCamera";
import useLoadModels from "../../hooks/useLoadModels";
import useFaceDetection from "../../hooks/useFaceDetection";
import useFormatExpression from "../../hooks/useFormatExpression";

import { VIDEO_SIZES, CANVAS_SIZES } from "../../constants/common";

import { controlsState } from "./controlsState";

import { styles } from "./styles";

const FaceDetection = () => {
  const [controls, setControls] = useState(controlsState);

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

  // Активуємо детекцію обличчя
  // Activate face detection
  const { detectAllFaces, handleFaceLandmarks, handleFaceExpressions, expressions } = useFaceDetection({
    videoStream,
    canvasRef,
    width: CANVAS_SIZES.WIDTH,
    height: CANVAS_SIZES.HEIGHT,
  });

  // Обробляємо вираз обличча, якщо обрана така опція
  // Process facial expressions if this option is selected
  const { expressionMessage } = useFormatExpression(expressions);

  useEffect(() => {
    const activeControl = controls.find((control) => control.enabled);
    if (!activeControl) return;

    const handlerName = activeControl.handler;
    let interval: any;

    switch (handlerName) {
      case "detectAllFaces":
        interval = setInterval(detectAllFaces, 1000);
        break;
      case "handleFaceLandmarks":
        interval = setInterval(handleFaceLandmarks, 1000);
        break;
      case "handleFaceExpressions":
        interval = setInterval(handleFaceExpressions, 1000);
        break;
    }

    return () => clearInterval(interval);
  }, [controls, detectAllFaces, handleFaceLandmarks, handleFaceExpressions]);

  const handleControlClick = (itemId: number) => {
    setControls(controls.map((control) => ({ ...control, enabled: control.id === itemId })));
  };

  return (
    <Box sx={styles.wrapper}>
      <Box sx={styles.contentContainer}>
        <Box>
          {errorCameraEnable && (
            <Alert severity="error" sx={styles.alert}>
              {errorCameraEnable}
            </Alert>
          )}
          {isErrorOnModelsLoading && (
            <Alert severity="error" sx={styles.alert}>
              Помилка завантаження моделей! Спробуйте перезавантажити сторінку! Model loading error! Try reloading the
              page!
            </Alert>
          )}

          {videoStream && !isErrorOnModelsLoading && !isModelsPrepared && (
            <Alert severity="info" sx={styles.alert}>
              Виконується підготовка програми! Program preparation is underway!
            </Alert>
          )}

          {isModelsPrepared && !expressionMessage && (
            <Alert severity="info" sx={styles.alert}>
              Здається, я тебе бачу 😅 I think I see you 😅
            </Alert>
          )}

          {expressionMessage && (
            <Alert severity="info" sx={styles.alert}>
              {expressionMessage}
            </Alert>
          )}
        </Box>

        <Box sx={styles.videoContainer}>
          <Box sx={styles.controls}>
            {controls.map(({ id, title, enabled }) => (
              <Button
                key={id}
                variant={enabled ? "contained" : "outlined"}
                onClick={() => handleControlClick(id)}
                sx={styles.button}
              >
                {title}
              </Button>
            ))}
          </Box>
          <Box sx={{ position: "relative" }}>
            <video ref={videoRef} id="camera" autoPlay muted playsInline></video>
            <canvas ref={canvasRef} style={{ position: "absolute", top: 0, left: 0 }}></canvas>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default FaceDetection;
