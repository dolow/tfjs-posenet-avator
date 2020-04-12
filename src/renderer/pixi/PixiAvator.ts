import { Container } from 'pixi.js';
import { Avator } from './../Avator';

export class PixiAvator extends Avator {
  protected container: Container = new Container();
  public getContainer(): Container {
    return this.container;
  }
}
