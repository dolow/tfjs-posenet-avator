import { Container, Sprite, Loader, resources } from 'pixi.js';
import { Pose, KeyPoint, KeyPointNames } from '../PoseNetInterface';

export class PoseAvator extends Container {
  private pose: Pose = null;
  private sprites: { [string]: Sprite } = {};

  constructor(pose: Pose) {
    super()
    this.setPose(pose);

    Loader.shared
      .add(KeyPointNames.LeftEye,  '/resources/eye_left.png')
      .add(KeyPointNames.RightEye, '/resources/eye_right.png')
      .load((_, res) => {
        this.sprites[KeyPointNames.LeftEye]  = new Sprite(res[KeyPointNames.LeftEye].texture);
        this.sprites[KeyPointNames.RightEye] = new Sprite(res[KeyPointNames.RightEye].texture);
      });
  }

  public setPose(pose: Pose): void {
    this.pose = pose;
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
        this.addChild(sprite);
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
