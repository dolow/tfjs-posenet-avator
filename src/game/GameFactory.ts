import { Game } from './Game';
import { GameTouch } from './GameTouch';

export class GameFactory {
  private static classes: {
    [string]: Game
  } = {
    touch: GameTouch
  };

  public static create(name: string, option: any = null): Game {
    const klass = GameFactory.classes[name];
    if (!klass) {
      return null;
    }

    const game = new klass();
    if (option) {
      game.setOption(option);
    }
    return game;
  }
}
