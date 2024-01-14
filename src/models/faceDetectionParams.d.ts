export interface FaceDetectionParams {
  videoStream: HTMLVideoElement | null;
  canvasRef: React.RefObject<HTMLCanvasElement> | null;
  width: number;
  height: number;
}
