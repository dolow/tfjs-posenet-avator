import { Application, Container } from 'pixi.js';
import { Pose } from '../PoseNetInterface';
import { Renderer } from './Renderer';
import { PoseGraphics } from './PoseGraphics';
import { PosePartTextGroup } from './PosePartTextGroup';
import { PoseAvator } from './PoseAvator';

export class Pixi implements Renderer {
  public static readonly DefaultOption = {
    width: 256,
    hight: 256,
    transparent: true
  };

  private app: Application = null;
  private rootContainer: Container = new Container();

  private graphics: PoseGraphics      = null;
  private texts:    PosePartTextGroup = null;
  private avator:   PoseAvator        = null;

  constructor(dom: HTMLElement) {
    this.app = new Application(Object.assign(Pixi.DefaultOption, {
      width:  parseInt(dom.style.width),
      height: parseInt(dom.style.height)
    });
    this.rootContainer = new Container();

    this.app.ticker.add(delta => this.update(delta));
    this.app.stage.addChild(this.rootContainer);

    dom.appendChild(this.app.view);

    this.app.ticker.add(delta => this.update(delta));

    this.graphics = new PoseGraphics();
    this.texts    = new PosePartTextGroup();
    this.avator   = new PoseAvator();
  }

  public update(dt: number): void {
    const children = this.rootContainer.children;
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      if (child.update) {
        child.update(dt);
      }
    }
  }

  public drawPose(pose: Pose): void {
    this.clear();

    this.graphics.setPose(pose);
    this.texts.setPose(pose);
    this.avator.setPose(pose);

    this.rootContainer.addChild(this.graphics);
    this.rootContainer.addChild(this.texts);
    this.rootContainer.addChild(this.avator);
  }

  public clear(): void {
    this.rootContainer.removeChildren();
  }

  public addUpdate(fx: Function, context: any): void {
    this.app.ticker.add(fx, context);
  }
  public removeUpdate(fx: Function, context: any): void {
    this.app.ticker.remove(fx, context);
  }
}
