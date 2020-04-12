import { Container, Graphics } from 'pixi.js';
import { Pose, KeyPoint } from '../../PoseNetInterface';
import { PixiAvator } from './PixiAvator';

export class PoseGraphics extends PixiAvator {
  private graphics: Graphics = new Graphics();

  public get name(): string {
    return 'graphics';
  }

  constructor(pose: Pose, scoreThreshold: number) {
    super(pose, scoreThreshold)

    this.container.addChild(this.graphics);
  }

  public update(dt: number): void {
    if (!this.pose) {
      return;
    }

    this.graphics.clear();

    for (let i = 0; i < this.pose.keypoints.length; i++) {
      const keypoint = this.pose.keypoints[i];
      const pos = keypoint.position;

      this.graphics.lineStyle(1, 0x00ddee, 1);
      this.graphics.beginFill(0x00ddee);
      this.graphics.drawCircle(pos.x, pos.y, 4);
      this.graphics.endFill();
    }
  }
}
