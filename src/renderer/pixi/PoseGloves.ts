import { Container, Sprite, Loader, Point } from 'pixi.js';
import { Pose, KeyPoint, KeyPointNames } from '../../PoseNetInterface';
import { PixiAvator } from './PixiAvator';

class Glove extends Sprite {
  public static readonly maxPostponeFrames = 3;
  private hidePostponedFrames: number = 0;
  private lastPosition: { x: number, y: number } = { x: 0, y: 0 }

  public getLastPosition(): { x: number, y: number } {
    return { x: this.lastPosition.x, y: this.lastPosition.y };
  }

  public saveLastPosition(): void {
    this.lastPosition.x = this.x;
    this.lastPosition.y = this.y;
  }

  public show() {
    this.alpha = 1.0;
    this.hidePostponedFrames = 0;
  }

  public hide() {
    if (this.hidePostponedFrames >= Glove.maxPostponeFrames) {
      this.alpha = 0.0;
    }
    this.hidePostponedFrames++;
  }

  public adjustFringeTransform(root: KeyPoint, edge: KeyPoint, eyesDistance: number): void {
    const diffX = edge.position.x - root.position.x;
    const diffY = edge.position.y - root.position.y;

    this.position.x = edge.position.x + (diffX * 0.4);
    this.position.y = edge.position.y + (diffY * 0.4);

    const ratio = ((this.texture.width + this.texture.height) / 2) / eyesDistance;
    const scale = PoseGloves.handsScaleRatioToEyesDistance / ratio;
    if (scale > PoseGloves.handsScaleThreshold) {
      scale = PoseGloves.handsScaleThreshold;
    }
    this.scale.x = scale;
    this.scale.y = scale;

    if (root.score >= PoseGloves.validEstimateScoreThreashold) {
      this.rotation = -Math.atan2(
        diffX,
        diffY,
      );
    }

    this.rotation += Math.PI;
    if (this.scale.x >= 0) {
      if (PoseGloves.leftGloveFlipped) {
        this.scale.x = this.scale.x * -1;
      }
    }
  }
}

export class PoseGloves extends PixiAvator {

  public gloveSprites: {
    left:  Sprite;
    right: Sprite;
  } = {
    left:  null,
    right: null
  };

  public static readonly handsScaleThreshold = 0.5;
  public static readonly handsScaleRatioToEyesDistance = 2.5;
  public static readonly validEstimateScoreThreashold = 0.5;
  public static readonly leftGloveFlipped  = true;
  public static readonly rightGloveFlipped = false;

  public get name(): string {
    return 'gloves';
  }

  public get resourceList() {
    return [{name: 'glove', url: './resources/glove.png'}];
  }

  public onResourceLoaded(): void {
    const resources = Loader.shared.resources;
    const texture = resources['glove'].texture;
    this.gloveSprites.left  = new Glove(texture);
    this.gloveSprites.right = new Glove(texture);
    this.gloveSprites.left.anchor.x = 0.5;
    this.gloveSprites.left.anchor.y = 0.5;
    this.gloveSprites.right.anchor.x = 0.5;
    this.gloveSprites.right.anchor.y = 0.5;
    this.container.addChild(this.gloveSprites.left);
    this.container.addChild(this.gloveSprites.right);
  }

  public update(dt: number): void {
    if (!this.pose) {
      return;
    }

    if (!this.gloveSprites.left) {
      return;
    }

    const map = this.poseToArmsMap(this.pose);
    const leftEye  = map[KeyPointNames.LeftEye];
    const rightEye = map[KeyPointNames.RightEye];
    const leftWrist = map[KeyPointNames.LeftWrist];
    const rightWrist = map[KeyPointNames.RightWrist];

    const xDiff = leftEye.position.x - rightEye.position.x;
    const yDiff = leftEye.position.y - rightEye.position.y;

    const eyesDistance = this.calcDistance(leftEye.position, rightEye.position);

    if (leftWrist.score >= PoseGloves.validEstimateScoreThreashold) {
      this.gloveSprites.left.adjustFringeTransform(map[KeyPointNames.LeftElbow],  leftWrist,  eyesDistance)
      this.gloveSprites.left.show();
    } else {
      this.gloveSprites.left.hide();
    }
    if (rightWrist.score >= PoseGloves.validEstimateScoreThreashold) {
      this.gloveSprites.right.adjustFringeTransform(map[KeyPointNames.RightElbow], rightWrist, eyesDistance)
      this.gloveSprites.right.show();
    } else {
      this.gloveSprites.right.hide();
    }

    this.resolveSideConfusion();

    this.gloveSprites.left.saveLastPosition();
    this.gloveSprites.right.saveLastPosition();
  }

  private resolveSideConfusion(): void {
    const left  = this.gloveSprites.left;
    const right = this.gloveSprites.right;

    if (this.calcDistance(right.position, left.position) > 10.0) {
      return;
    }

    const leftDistance  = this.calcDistance(left.getLastPosition(), left.position);
    const rightDistance = this.calcDistance(right.getLastPosition(), right.position);

    let oldPosition, warpedSide;

    if (rightDistance > leftDistance) {
      oldPosition = right.getLastPosition();
      warpedSide = right;
    } else {
      oldPosition = left.getLastPosition();
      warpedSide = left;
    }

    warpedSide.position.x = oldPosition.x;
    warpedSide.position.y = oldPosition.y;
  }

  private poseToArmsMap(pose: Pose) {
    const map: { [string]: KeyPoint } = {};

    for (let i = 0; i < this.pose.keypoints.length; i++) {
      const keypoint = this.pose.keypoints[i];
      const part = keypoint.part;
      switch (part) {
        case KeyPointNames.LeftEye:
        case KeyPointNames.RightEye:
        case KeyPointNames.LeftWrist:
        case KeyPointNames.RightWrist:
        case KeyPointNames.LeftElbow:
        case KeyPointNames.RightElbow: map[part] = keypoint;
      }
    }

    return map;
  }

  private calcDistance(pos1: { x: number, y: number }, pos2: { x: number, y: number }): number {
    const xDiff = pos1.x - pos2.x;
    const yDiff = pos1.y - pos2.y;

    return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
  }
}
