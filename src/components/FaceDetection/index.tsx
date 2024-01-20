import { useRef, useEffect, useState } from "react";
import { Box, Alert, Button } from "@mui/material";

import useCamera from "../../hooks/useCamera";
import useLoadModels from "../../hooks/useLoadModels";
import useFaceDetection from "../../hooks/useFaceDetection";
import useFormatExpression from "../../hooks/useFormatExpression";

import { VIDEO_SIZES, CANVAS_SIZES, GENDER } from "../../constants/common";

import { controlsState } from "./controlsState";

import { AgeAndGenderState } from "../../models/ageAndGenderState";

import { styles } from "./styles";

const FaceDetection = () => {
  const [controls, setControls] = useState(controlsState);
  const [ageAndGenderMessage, setAgeAndGenderMessage] = useState<string | null>(null);

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
  const { detectAllFaces, handleFaceLandmarks, handleFaceExpressions, handleAgeAndGender, expressions, genderAndAge } =
    useFaceDetection({
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
      case "handleAgeAndGender":
        interval = setInterval(handleAgeAndGender, 1000);
        break;
    }

    return () => clearInterval(interval);
  }, [controls, detectAllFaces, handleFaceLandmarks, handleFaceExpressions, handleAgeAndGender]);

  useEffect(() => {
    const handleAgeAndGenderMessage = () => {
      const { gender, age } = genderAndAge as AgeAndGenderState;

      let genderMessage = "";

      switch (gender) {
        case GENDER.male.eng:
          genderMessage = `Схоже тут у нас ${GENDER.male.ua}. `;
          break;
        case GENDER.female.eng:
          genderMessage = `Схоже тут у нас ${GENDER.female.ua}. `;
          break;
        default:
          console.log(`Who is this ${gender}?`);
      }

      if (age < 10) {
        genderMessage += `О, сцикопіхота на місці! Тобі ${age} рочків.`;
      } else if (age < 20) {
        genderMessage += `Ще трішки і будуть півчик продавати. Тобі ${age} рочків.`;
      } else if (age < 30) {
        genderMessage += `Входиш у доросле життя. Тобі ${age} рочків.`;
      } else if (age < 40) {
        genderMessage += `Вже пора ставати розсудливим. Тобі ${age} рочків.`;
      } else if (age < 50) {
        genderMessage += `Як там, 45-ть баба ягідка опять. Тобі ${age} рочків.`;
      } else if (age < 60) {
        genderMessage += `Ще є порох у порохівницях. Тобі ${age} рочків.`;
      } else if (age < 70) {
        genderMessage += `В принципі, вже можна і місце спочивання підбирати. Тобі ${age} рочків.`;
      } else if (age > 70.01) {
        genderMessage += `Це вже клініка. Тобі ${age} рочків.`;
      }

      setAgeAndGenderMessage(genderMessage || "");
    };

    if (genderAndAge) {
      handleAgeAndGenderMessage();
    }
  }, [genderAndAge]);

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

          {isModelsPrepared && !expressionMessage && !ageAndGenderMessage && (
            <Alert severity="info" sx={styles.alert}>
              Здається, я тебе бачу 😅 I think I see you 😅
            </Alert>
          )}

          {expressionMessage && (
            <Alert severity="info" sx={styles.alert}>
              {expressionMessage}
            </Alert>
          )}

          {ageAndGenderMessage && (
            <Alert severity="info" sx={styles.alert}>
              {ageAndGenderMessage}
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
