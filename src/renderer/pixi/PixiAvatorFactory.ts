import { Pose } from '../../PoseNetInterface';
import { PixiAvator } from './PixiAvator';
import { PoseFaceAvator } from './PoseFaceAvator';
import { PoseGraphics } from './PoseGraphics';
import { PoseGloves } from './PoseGloves';
import { PosePartTextGroup } from './PosePartTextGroup';

export class PixiAvatorFactory {
  private static classes: {
    [string]: PixiAvator
  } = {
    face:     PoseFaceAvator,
    graphics: PoseGraphics,
    gloves:   PoseGloves,
    text:     PosePartTextGroup,
  };

  public static create(name: string, scoreThreshold: number, pose: Pose = null): PixiAvator {
    const klass = PixiAvatorFactory.classes[name];
    if (!klass) {
      return null;
    }

    return new klass(pose, scoreThreshold);
  }
}
