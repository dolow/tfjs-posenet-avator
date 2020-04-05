import { Graphics } from 'pixi.js';
import { Pose, KeyPoint } from '../PoseNetInterface';

export class PoseGraphics extends Graphics {
  private pose: Pose = null;

  constructor(pose: Pose) {
    super()
    this.setPose(pose);
  }

  public setPose(pose: Pose): void {
    this.pose = pose;
  }

  public update(dt: number): void {
    if (!this.pose) {
      return;
    }

    this.clear();

    for (let i = 0; i < this.pose.keypoints.length; i++) {
      const keypoint = this.pose.keypoints[i];
      const pos = keypoint.position;

      this.lineStyle(1, 0x00ddee, 1);
      this.beginFill(0x00ddee);
      this.drawCircle(pos.x, pos.y, 4);
      this.endFill();
    }
  }
}
