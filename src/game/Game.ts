export interface GameResult {
  score: number;
  time: number;
}

export interface Player {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface GameEntity {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export class Game {
  public setOption(option: any): void;
  public setPlayers(players: Player[]): void;
  public getEntities(): GameEntity[];
  public update(dt: number): GameResult;
  public finish(): Promise<GameResult>;
}
