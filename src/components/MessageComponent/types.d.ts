export interface IProps {
  errorCameraEnable: string | null;
  isErrorOnModelsLoading: boolean;
  isModelsPrepared: boolean;
  videoStream: HTMLVideoElement | null;
  expressionMessage: string | null;
  ageAndGenderMessage: string | null;
}
