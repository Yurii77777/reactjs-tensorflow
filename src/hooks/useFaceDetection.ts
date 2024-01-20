import { useCallback, useState } from "react";
import * as faceapi from "face-api.js";
import { FaceExpressions } from "face-api.js";

import { FaceDetectionParams } from "../models/faceDetectionParams";
import { AgeAndGenderState } from "../models/ageAndGenderState";

const useFaceDetection = (options: FaceDetectionParams) => {
  const { videoStream, canvasRef, width, height } = options;
  const [expressions, setExpressions] = useState<FaceExpressions | null>(null);
  const [genderAndAge, setGenderAndAge] = useState<AgeAndGenderState | null>(null);

  const detectAllFaces = useCallback(async () => {
    const isEnoughData = videoStream && canvasRef && canvasRef.current;

    if (!isEnoughData) {
      return;
    }

    const detections = await faceapi.detectAllFaces(videoStream, new faceapi.TinyFaceDetectorOptions());

    const ctx = canvasRef.current.getContext("2d");

    if (!ctx) {
      return;
    }

    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    faceapi.matchDimensions(canvasRef.current, {
      width,
      height,
    });

    const resizedDetections = faceapi.resizeResults(detections, {
      width,
      height,
    });
    faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
  }, [canvasRef, videoStream, height, width]);

  const handleFaceLandmarks = useCallback(async () => {
    const isEnoughData = videoStream && canvasRef && canvasRef.current;

    if (!isEnoughData) {
      return;
    }

    const detections = await faceapi
      .detectAllFaces(videoStream, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks();

    const ctx = canvasRef.current.getContext("2d");

    if (!ctx) {
      return;
    }

    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    faceapi.matchDimensions(canvasRef.current, {
      width,
      height,
    });

    const resizedDetections = faceapi.resizeResults(detections, {
      width,
      height,
    });

    faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
    faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);
  }, [canvasRef, videoStream, height, width]);

  const handleFaceExpressions = useCallback(async () => {
    const isEnoughData = videoStream && canvasRef && canvasRef.current;

    if (!isEnoughData) {
      return;
    }

    if (genderAndAge) {
      setGenderAndAge(null);
    }

    const detections = await faceapi
      .detectAllFaces(videoStream, new faceapi.TinyFaceDetectorOptions())
      .withFaceExpressions();

    const isExpressions = detections && !!detections.length;

    if (isExpressions) {
      setExpressions(detections[0].expressions);
    }

    const ctx = canvasRef.current.getContext("2d");

    if (!ctx) {
      return;
    }

    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    faceapi.matchDimensions(canvasRef.current, {
      width,
      height,
    });

    const resizedDetections = faceapi.resizeResults(detections, {
      width,
      height,
    });

    faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
    faceapi.draw.drawFaceExpressions(canvasRef.current, resizedDetections);
  }, [canvasRef, videoStream, height, width, genderAndAge]);

  const handleAgeAndGender = useCallback(async () => {
    const isEnoughData = videoStream && canvasRef && canvasRef.current;

    if (!isEnoughData) {
      return;
    }

    if (expressions) {
      setExpressions(null);
    }

    const detections = await faceapi
      .detectAllFaces(videoStream, new faceapi.TinyFaceDetectorOptions())
      .withAgeAndGender();

    const isExpressions = detections && !!detections.length;

    if (isExpressions) {
      const age = Math.round(detections[0].age);

      setGenderAndAge({ gender: detections[0].gender, age });
    }

    const ctx = canvasRef.current.getContext("2d");

    if (!ctx) {
      return;
    }

    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    faceapi.matchDimensions(canvasRef.current, {
      width,
      height,
    });

    const resizedDetections = faceapi.resizeResults(detections, {
      width,
      height,
    });

    faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
  }, [canvasRef, videoStream, height, width, expressions]);

  return { detectAllFaces, handleFaceLandmarks, handleFaceExpressions, handleAgeAndGender, expressions, genderAndAge };
};

export default useFaceDetection;
