import { Game } from './../game/Game';
import { Avator } from './../renderer/Avator';

export class GameAdapter {
  public get resourceList(): any[] {
    return [];
  }

  constructor(
    protected avator: Avator
    protected game: Game
  ) {}

  public loadResource(): Promise<void> {
    return Promise.resolve();
  }

  public onResourceLoaded(): void {
  }

  public update(dt: number): void {
  }
}
