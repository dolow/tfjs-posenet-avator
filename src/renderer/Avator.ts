import { Pose } from '../PoseNetInterface';

export abstract class Avator {
  protected pose:           Pose = null;
  protected scoreThreshold: number = 0.3;

  public get name(): string {
    return '';
  }

  constructor(pose: Pose, scoreThreshold: number) {
    this.setPose(pose);
    this.setScoreThreshold(scoreThreshold);
  }

  public setPose(pose: Pose): void {
    this.pose = pose;
  }

  public setScoreThreshold(threshold: number): void {
    this.scoreThreshold = threshold;
  }

  public update(dt: number): void {
  }

  public get resourceList() {
    return [];
  }

  public onResourceLoaded(): void {
  }
}
