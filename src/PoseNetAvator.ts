import * as posenet from '@tensorflow-models/posenet';
import { Pose, PoseNetSrc } from './PoseNetInterface';
import { PoseNetDefaultOption } from './PoseNetDefaultOption';
import { Renderer } from './renderer/Renderer';
import { Pixi } from './renderer/Pixi';

export default class PoseNetAvator {
  private renderer:   Renderer   = null;

  private src:      PoseNetSrc = null;
  private flipPose: bool       = false;

  private net: any = null;

  public init(dom: HTMLElement): Promise<PoseNetAvator> {
    this.renderer   = new Pixi(dom);

    return posenet.load(Object.assign({}, PoseNetDefaultOption)).then((net) => {
      this.net = net;
      return this;
    })
  }

  public estimate(src: PoseNetSrc): void {
    this.src = src;

    switch (this.src.constructor.name) {
      case 'HTMLCanvasElement':
      case 'HTMLVideoElement': {
        this.flipPose = true;
        this.renderer.addUpdate(this.estimateSingle, this);
        break;
      }
      case 'ImageData':
      case 'HTMLImageElement':
      default: {
        this.flipPose = false;
        this.renderer.removeUpdate(this.estimateSingle, this);
        this.estimateSingle();
        break;
      }
    }
  }

  public clear(src: PoseNetSrc): void {
    this.renderer.clear();
  }

  public async estimateSingle(): void {
    const pose = await this.net.estimateSinglePose(this.src, { flipHorizontal: this.flipPose });
    this.renderer.drawPose(pose);
  }

  public resize(w: number, h: number): void {
    this.renderer.app.renderer.resize(w, h);
  }
}
