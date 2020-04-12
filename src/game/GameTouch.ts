import { Game, GameResult, Player, GameEntity } from './Game';

export interface GameTouchOption {
  rule: string;
  enemy: {
    width: number;
    height: number;
  };
  spawnArea: {
    x: number;
    y: number;
    width: number;
    height: number;
  }
}

export class GameTouch extends Game {
  public static readonly rules = {
    Single: 'single'
  };

  private players: Players[] = [];
  private enemies: GameEntity[] = [];
  private currentEnemyId = 1;
  private result: GameResult = { score: 0, time: 0 };

  private option: GameTouchOption = {};

  public get defaultOption(): GameTouchOption {
    return {
      rule: GameTouch.rules.Single,
      enemy: {
        width: 30,
        height: 30
      },
      spawnArea: {
        x: 0,
        y: 0,
        width: 320,
        height: 320
      }
    };
  }

  public setOption(option: GameTouchOption): void {
    const mergedOption = Object.assign(this.defaultOption, option);
    this.option = mergedOption;
  }

  public setPlayers(players: Player[]): void {
    this.players = players;
  }

  public update(dt: number): GameResult {
    switch (this.option.rule) {
      case GameTouch.rules.Single: {
        const enemies = this.detectIntersectingEnemies();
        for (let i = 0; i < enemies.length; i++) {
          this.collapse(enemies[i].id);
          this.result.score++;
        }
        if (this.enemies.length === 0) {
          this.spawn();
        }

        this.players = [];
        break;
      }
    }

    return this.result;
  }

  public finish(): Promise<GameResult> {
    return Promise.resolve(this.result);
  }

  public getEntities(): GameEntity[] {
    return this.enemies;
  }

  private detectIntersectingEnemies(): GameEntity[] {
    const result = [];

    for (let i = 0; i < this.players.length; i++) {
      const rect = this.players[i];
      let px1 = rect.x;
      let px2 = rect.x + rect.width;
      let py1 = rect.y;
      let py2 = rect.y + rect.height;

      for (let j = 0; j < this.enemies.length; j++) {
        const enemy = this.enemies[j];

        if (result.some((entity) => entity.id === enemy.id)) continue;

        let ex1 = enemy.x;
        let ex2 = enemy.x + enemy.width;
        let ey1 = enemy.y;
        let ey2 = enemy.y + enemy.height;

        if (px1 < ex2 && px2 > ex1 && py1 < ey2 && py2 > ey1) {
          // intersect
          result.push(enemy);
        } else if (px1 < ex1 && px2 > ex2 && py1 < ey1 && py2 > ey2) {
          // player contains enemy
          result.push(enemy);
        } else if (ex1 < px1 && ex2 > px2 && ey1 < py1 && ey2 > py2) {
          // enemy contains player
          result.push(enemy);
        }
      }
    }

    return result;
  }

  private spawn(): {
    x: number,
    y: number,
    width: number,
    height: number
  } {
    const id = this.currentEnemyId++;
    const enemy = {
      id: id,
      x: this.option.spawnArea.x + Math.random() * this.option.spawnArea.width,
      y: this.option.spawnArea.y + Math.random() * this.option.spawnArea.height,
      width: this.option.enemy.width,
      height: this.option.enemy.height
    }
    this.enemies.push(enemy);
    return enemy;
  }

  private collapse(id) {
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      if (this.enemies[i].id === id) {
        this.enemies.splice(i, 1);
        break;
      }
    }
  }
}
