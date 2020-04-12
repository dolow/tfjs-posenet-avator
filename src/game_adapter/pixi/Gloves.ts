import { Container, Texture, Loader, Sprite, Graphics } from 'pixi.js';
import { GameAdapter } from '../GameAdapter';
import { Player, GameEntity } from '../game/Game';
import { PixiAvator } from '../renderer/pixi/PixiAvator';

const debug: bool = false;

export class GloveEnemy extends Sprite {
  private entity: GameEntity = null;

  constructor(texture: Texture, entity: GameEntity) {
    super(texture);
    this.entity = entity;
  }

  public setEntityPosition(pos: { x:number, y:number }): void {
    this.entity.x = pos.x;
    this.entity.y = pos.y;
    this.x = pos.x;
    this.y = pos.y;
  }
}

export class Gloves extends GameAdapter {
  private enemyTexture: Texture = null;
  private currentEntities: { [number]: GameEntity } = {};
  private ready: bool = false;

  public get resourceList() {
    return [{name: 'bug', url: './resources/bug.png'}];
  }

  public onResourceLoaded(): void {
    const texture = Loader.shared.resources['bug'].texture;
    this.enemyTexture = texture;
    this.ready = true;
    if (debug) {
      this.graphics = new Graphics();
      this.avator.getContainer().addChild(this.graphics);
    }
  }

  public update(dt: number): void {
    if (!this.ready) return;

    const players = [];
    if (this.avator.gloveSprites.left.visible && this.avator.gloveSprites.left.alpha > 0.0) {
      players.push(this.createGamePlayer(this.avator.gloveSprites.left));
    }
    if (this.avator.gloveSprites.right.visible && this.avator.gloveSprites.right.alpha > 0.0) {
      players.push(this.createGamePlayer(this.avator.gloveSprites.right));
    }

    this.game.setPlayers(players);

    const entities = this.game.getEntities();
    const removedIds = this.removeCollaptedEnemies(entities);
    this.addSpawnedEnemies(entities, removedIds);
    this.updateEnemiesPosition(entities);

    if (debug) {
      this.drawOutline();
    }
  }

  private removeCollaptedEnemies(entities: GameEntity[]): number[] {
    const collaptedEnemyIds = [];
    const currentEntityIds = Object.keys(this.currentEntities);
    for (let i = 0; i < currentEntityIds.length; i++) {
      const id = parseInt(currentEntityIds[i]);
      const alive = entities.some((entity) => entity.id === id);
      if (alive) continue;

      collaptedEnemyIds.push(id);
      const entity = this.currentEntities[id];
      entity.parent.removeChild(entity);
      delete this.currentEntities[id];
    }

    return collaptedEnemyIds;
  }

  private addSpawnedEnemies(entities: GameEntity[], ignoreIds: number[]): void {
    for (let i = 0; i < entities.length; i++) {
      const entity = entities[i];
      if (this.currentEntities[entity.id]) continue;
      if (ignoreIds.includes(entity.id)) continue;

      const enemy = this.createEnemy(entity);
      this.avator.getContainer().addChild(enemy);
      this.currentEntities[entity.id] = enemy;
    }
  }

  private updateEnemiesPosition(entities: GameEntity[]): void {
    for (let i = 0; i < entities.length; i++) {
      const entity = entities[i];
      this.currentEntities[entity.id].setEntityPosition(entity);
    }
  }

  private createEnemy(entity: GameEntity): GloveEnemy {
    const enemy = new GloveEnemy(this.enemyTexture, entity);
    const ratioW = entity.width / this.enemyTexture.width;
    const ratioH = entity.height / this.enemyTexture.height;
    let baseScale = (ratioW < ratioH) ? ratioW : ratioH;
    enemy.scale.x = baseScale;
    enemy.scale.y = baseScale;
    return enemy;
  }

  private createGamePlayer(container: Container): Player {
    return {
      x: container.position.x - container.anchor.x * container.width,
      y: container.position.y - container.anchor.y * container.height,
      width: container.width,
      height: container.height,
    };
  }

  private drawOutline() {
    if (!this.graphics) return;

    this.graphics.clear();

    for (let i = 0; i < players.length; i++) {
      const player = players[i];

      this.graphics.lineStyle(1, 0x00ddee, 1);
      this.graphics.drawRect(player.x, player.y, player.width, player.height);
      this.graphics.endFill();
    }

    for (let i = 0; i < entities.length; i++) {
      const entity = entities[i];

      this.graphics.lineStyle(1, 0x00ddee, 1);
      this.graphics.drawRect(entity.x, entity.y, entity.width, entity.height);
      this.graphics.endFill();
    }
  }
}
