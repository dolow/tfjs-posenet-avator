import { Application, Container, Loader } from 'pixi.js';
import { Pose } from '../../PoseNetInterface';
import { Renderer } from './../Renderer';
import { PixiAvator } from './PixiAvator';
import { PixiAvatorFactory } from './PixiAvatorFactory';

export class Pixi implements Renderer {
  public static readonly DefaultOption = {
    width: 256,
    hight: 256,
    transparent: true
  };

  private app: Application = null;
  private rootContainer: Container = new Container();

  private avators: PixiAvator[] = [];

  constructor(dom: HTMLElement, avatorNames: string[], scoreThreshold: number) {
    this.app = new Application(Object.assign(Pixi.DefaultOption, {
      width:  parseInt(dom.style.width),
      height: parseInt(dom.style.height)
    });
    this.rootContainer = new Container();

    this.app.ticker.add(delta => this.update(delta));
    this.app.stage.addChild(this.rootContainer);

    dom.appendChild(this.app.view);

    this.app.ticker.add(delta => this.update(delta));

    const resources = [];
    for (let i = 0; i < avatorNames.length; i++) {
      const avator = PixiAvatorFactory.create(avatorNames[i], scoreThreshold);
      this.avators.push(avator);
      resources = resources.concat(avator.resourceList);
    }

    this.loadResource(resources).then(() => {
      for (let i = 0; i < this.avators.length; i++) {
        this.avators[i].onResourceLoaded();
      }
    });
  }

  public loadResource(resources: any): Promise<Loader, any> {
    return new Promise((resolve) => {
      Loader.shared.add(resources).load(() => resolve());
    });
  }

  public update(dt: number): void {
    for (let i = 0; i < this.avators.length; i++) {
      const avator = this.avators[i]
      if (avator.update && avator.getContainer().parent) {
        avator.update(dt);
      }
    }
  }

  public drawPose(pose: Pose): void {
    this.clear();

    for (let i = 0; i < this.avators.length; i++) {
      const avator = this.avators[i];
      avator.setPose(pose);
      this.rootContainer.addChild(avator.getContainer());
    }
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

  public getAvator(name: string): Avator {
    for (let i = 0; i < this.avators.length; i++) {
      const avator = this.avators[i];
      if (avator.name === name) return avator;
    }

    return null;
  }
}
