import { useEffect, useState } from "react";

import { CameraResponse } from "../models/cameraResponse";
import { CameraParams } from "../models/cameraParams";

const useCamera = (options: CameraParams): CameraResponse => {
  const { videoRef, width, height } = options;

  const [videoStream, setVideoStream] = useState<HTMLVideoElement | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeCamera = async () => {
      if (!videoRef || !videoRef.current) {
        console.log("Video element not found!");
        setError("Video element not found!");
        return;
      }

      videoRef.current.width = width;
      videoRef.current.height = height;

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {
            facingMode: "user",
          },
        });

        videoRef.current.srcObject = stream;

        setVideoStream(videoRef.current);
      } catch (error) {
        if (error instanceof Error) {
          setError(error?.message || "Please, try to realod the browser!");
        } else {
          console.log("Please, try to realod the browser!");
        }
      }
    };

    if (videoRef && videoRef.current) {
      initializeCamera();
    }
  }, [videoRef, height, width]);

  return { videoStream, error };
};

export default useCamera;
