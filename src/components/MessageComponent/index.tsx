import { Alert } from "@mui/material";

import { IProps } from "./types";

import { styles } from "./styles";

const MessageComponent: React.FC<IProps> = ({
  errorCameraEnable,
  isErrorOnModelsLoading,
  isModelsPrepared,
  videoStream,
  expressionMessage,
  ageAndGenderMessage,
}) => {
  if (errorCameraEnable) {
    return (
      <Alert severity="error" sx={styles.alert}>
        {errorCameraEnable}
      </Alert>
    );
  } else if (isErrorOnModelsLoading) {
    return (
      <Alert severity="error" sx={styles.alert}>
        Помилка завантаження моделей! Спробуйте перезавантажити сторінку! Model loading error! Try reloading the page!
      </Alert>
    );
  } else if (videoStream && !isErrorOnModelsLoading && !isModelsPrepared) {
    return (
      <Alert severity="info" sx={styles.alert}>
        Виконується підготовка програми! Program preparation is underway!
      </Alert>
    );
  } else if (!expressionMessage && !ageAndGenderMessage && isModelsPrepared) {
    return (
      <Alert severity="info" sx={styles.alert}>
        Здається, я тебе бачу 😅 I think I see you 😅
      </Alert>
    );
  } else if (expressionMessage) {
    return (
      <Alert severity="info" sx={styles.alert}>
        {expressionMessage}
      </Alert>
    );
  } else if (ageAndGenderMessage) {
    return (
      <Alert severity="info" sx={styles.alert}>
        {ageAndGenderMessage}
      </Alert>
    );
  } else {
    return (
      <Alert severity="info" sx={styles.alert}>
        "Чекай, там якась не зрозуміла шляпа!"
      </Alert>
    );
  }
};

export default MessageComponent;
