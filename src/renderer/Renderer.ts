import { Pose } from '../PoseNetInterface';

export interface Renderer {
  drawPose(pose: Pose): void;
  clear(): void;
  addUpdate(fx: Function, context: any): void;
  removeUpdate(fx: Function, context: any): void;
}
