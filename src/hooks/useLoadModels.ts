import { useEffect, useState } from "react";
import * as faceapi from "face-api.js";

const useLoadModels = (videoStream: HTMLVideoElement | null) => {
  const [isModelsPrepared, setIsModelsPrepared] = useState(false);
  const [isErrorOnModelsLoading, setIsErrorOnModelsLoading] = useState(false);

  useEffect(() => {
    const loadModels = async () => {
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
        await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
        await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
        await faceapi.nets.faceExpressionNet.loadFromUri("/models");

        setIsModelsPrepared(true);
      } catch (error) {
        console.error("Error loading models:", error);
        setIsErrorOnModelsLoading(true);
      }
    };

    if (videoStream) {
      loadModels();
    }
  }, [videoStream]);

  return { isModelsPrepared, isErrorOnModelsLoading };
};

export default useLoadModels;
