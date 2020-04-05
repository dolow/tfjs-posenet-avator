interface KeyPoint {
  score: number;
  part: string;
  position: {
    x: number;
    y: number;
  }
}

interface Pose {
  score: number;
  keypoints: KeyPoint[];
}

type PoseNetSrc = ImageData|HTMLImageElement|HTMLCanvasElement|HTMLVideoElement;

const KeyPointNames = Object.freeze({
  LeftEye:  'leftEye',
  RightEye: 'rightEye',
  LeftEar:  'leftEar',
  RightEar: 'rightEar',
  Node:     'nose',
  // TODO:
});

export {
  KeyPoint,
  Pose,
  PoseNetSrc,
  KeyPointNames
}
