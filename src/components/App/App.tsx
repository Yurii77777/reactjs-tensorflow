import { lazy } from "react";

const FaceDetection = lazy(() => import("../FaceDetection/index"));

const App = () => {
  return <FaceDetection />;
};

export default App;
