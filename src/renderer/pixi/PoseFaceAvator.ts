import { Container, Sprite, Loader } from 'pixi.js';
import { Pose, KeyPoint, KeyPointNames } from '../../PoseNetInterface';
import { PixiAvator } from './PixiAvator';

export class PoseFaceAvator extends PixiAvator {
  private sprites: { [string]: Sprite } = {};

  public get name(): string {
    return 'face';
  }

  public get resourceList() {
    return [
      { name: KeyPointNames.LeftEye,  url: '/resources/eye_left.png'  },
      { name: KeyPointNames.RightEye, url: '/resources/eye_right.png' }
    ];
  }

  public onResourceLoaded(): void {
    const resources = Loader.shared.resources;
    this.sprites[KeyPointNames.LeftEye]  = new Sprite(resources[KeyPointNames.LeftEye].texture);
    this.sprites[KeyPointNames.RightEye] = new Sprite(resources[KeyPointNames.RightEye].texture);
  }

  public update(dt: number): void {
    if (!this.pose) {
      return;
    }

    if (!this.sprites[KeyPointNames.LeftEye] || !this.sprites[KeyPointNames.RightEye]) {
      return;
    }

    const partCollection = [];

    // create texts
    for (let i = 0; i < this.pose.keypoints.length; i++) {
      const keypoint = this.pose.keypoints[i];
      const part = keypoint.part;

      partCollection.push(part);

      let sprite = this.sprites[part];
      if (!sprite) {
        continue;
      }
      if (!sprite.parent) {
        this.container.addChild(sprite);
      }

      sprite.x = keypoint.position.x - sprite.width  * 0.5;
      sprite.y = keypoint.position.y - sprite.height * 0.5;
    }

    // delete not existing texts
    const keys = Object.keys(this.sprites);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (!partCollection.includes(key)) {
        const parent = this.sprites.parent;
        if (parent) {
          parent.removeChild(this.sprites);
        }
      }
    }
  }
}
