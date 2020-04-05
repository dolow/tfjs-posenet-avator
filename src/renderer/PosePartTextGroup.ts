import { Container, Text, TextStyle } from 'pixi.js';
import { Pose, KeyPoint } from '../PoseNetInterface';

export class PosePartTextGroup extends Container {
  private pose: Pose = null;
  private texts: { [string]: Text } = {};

  private textStyle = new TextStyle({
    fontFamily: 'Arial',
    fontSize: 10,
    fill: 0x00ddee,
  });

  constructor(pose: Pose) {
    super()

    this.setPose(pose);
  }

  public setPose(pose: Pose): void {
    this.pose = pose;
  }

  public update(dt: number) {
    if (!this.pose) {
      return;
    }

    const partCollection = [];

    // create texts
    for (let i = 0; i < this.pose.keypoints.length; i++) {
      const keypoint = this.pose.keypoints[i];
      const part = keypoint.part;

      partCollection.push(part);

      let text = this.texts[part];
      if (!text) {
        text = new Text(keypoint.part, this.textStyle);
        this.addChild(text);
        this.texts[part] = text;
      }

      text.x = keypoint.position.x + 8;
      text.y = keypoint.position.y - text.height * 0.5;
    }

    // delete not existing texts
    const keys = Object.keys(this.texts);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (!partCollection.includes(key)) {
        delete this.texts[key];
      }
    }
  }
}
