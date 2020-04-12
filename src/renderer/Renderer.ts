import { Pose } from '../PoseNetInterface';

export interface Renderer {
  drawPose(pose: Pose): void;
  loadResource(resource: any): Promise<any>;
  clear(): void;
  addUpdate(fx: Function, context: any): void;
  removeUpdate(fx: Function, context: any): void;
  getAvator(name: string): any;
}
