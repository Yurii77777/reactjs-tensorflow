export const controlsState = [
  {
    id: 0,
    title: "Detect face",
    handler: "detectAllFaces",
    enabled: true,
  },
  {
    id: 1,
    title: "Face landmarks",
    handler: "handleFaceLandmarks",
    enabled: false,
  },
  {
    id: 2,
    title: "Face expressions",
    handler: "handleFaceExpressions",
    enabled: false,
  },
  {
    id: 3,
    title: "Age and Gender",
    handler: "handleAgeAndGender",
    enabled: false,
  },
];
