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
  LeftEye:    'leftEye',
  RightEye:   'rightEye',
  LeftEar:    'leftEar',
  RightEar:   'rightEar',
  Node:       'nose',
  LeftWrist:  'leftWrist',
  LeftElbow:  'leftElbow',
  RightWrist: 'rightWrist',
  RightElbow: 'rightElbow',
  // TODO:
});

export {
  KeyPoint,
  Pose,
  PoseNetSrc,
  KeyPointNames
}
