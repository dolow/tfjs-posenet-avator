import { Game } from './../game/Game';
import { Avator } from './../renderer/Avator';
import { Gloves } from './pixi/Gloves';

export class GameAdapterFactory {
  private static classes: {
    [string]: GameAdapter
  } = {
    gloves: Gloves
  };

  public static create(avator: Avator, game: Game): GameAdapter {
    const klass = GameAdapterFactory.classes[avator.name];
    if (!klass) {
      return null;
    }

    return new klass(avator, game);
  }
}
