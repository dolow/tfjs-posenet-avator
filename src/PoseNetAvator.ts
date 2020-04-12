import * as posenet from '@tensorflow-models/posenet';
import { Pose, PoseNetSrc } from './PoseNetInterface';
import { PoseNetDefaultOption } from './PoseNetDefaultOption';
import { Renderer } from './renderer/Renderer';
import { Pixi } from './renderer/pixi/Pixi';
import { Game, GameResult } from './game/Game';
import { GameFactory } from './game/GameFactory';
import { GameAdapterFactory } from './game_adapter/GameAdapterFactory';

export default class PoseNetAvator {
  private renderer: Renderer   = null;

  private src:      PoseNetSrc = null;
  private flipPose: bool       = false;

  private net: any = null;

  private currentGame: Game = null;
  private currentGameAdapters: GameAdapter[] = [];
  private onGameUpdate: (result GameResult) => void = (result) => {};

  public init(dom: HTMLElement, avators: string[], scoreThreshold: number = 0.3): Promise<PoseNetAvator> {
    this.renderer = new Pixi(dom, avators, scoreThreshold);

    return posenet.load(Object.assign({}, PoseNetDefaultOption)).then((net) => {
      this.net = net;
      return this;
    })
  }

  public estimate(src: PoseNetSrc): void {
    this.src = src;

    switch (this.src.constructor.name) {
      case 'HTMLCanvasElement':
      case 'HTMLVideoElement': {
        this.flipPose = true;
        this.renderer.addUpdate(this.estimateSingle, this);
        this.renderer.addUpdate(this.updateGameAdapters, this);
        this.renderer.addUpdate(this.updateGame, this);
        break;
      }
      case 'ImageData':
      case 'HTMLImageElement':
      default: {
        this.flipPose = false;
        this.renderer.removeUpdate(this.estimateSingle, this);
        this.renderer.removeUpdate(this.updateGame, this);
        this.estimateSingle();
        break;
      }
    }
  }

  public clear(src: PoseNetSrc): void {
    this.renderer.clear();
  }

  public async estimateSingle(): void {
    const pose = await this.net.estimateSinglePose(this.src, { flipHorizontal: this.flipPose });
    this.renderer.drawPose(pose);
  }

  public resize(w: number, h: number): void {
    this.renderer.app.renderer.resize(w, h);
  }

  public beginGame(config: {
    game: string,
    playerAvators: string[]
    updateCallback: (GameResult) => void,
    gameOption: any
  }) {
    this.currentGameAdapters = [];
    this.currentGame = new GameFactory.create(config.game, config.gameOption);

    const resources = [];
    for (let i = 0; i < config.playerAvators.length; i++) {
      const avator = this.renderer.getAvator(config.playerAvators[i]);
      if (!avator) continue;

      const adapter = GameAdapterFactory.create(avator, this.currentGame);
      resources = resources.concat(adapter.resourceList);
      this.currentGameAdapters.push(adapter);
    }

    this.renderer.loadResource(resources).then(() => {
      for (let i = 0; i < this.currentGameAdapters.length; i++) {
        this.currentGameAdapters[i].onResourceLoaded();
      }
      this.onGameUpdate = config.updateCallback || (() => {});
    });
  }

  public updateGameAdapters(dt: number): void {
    for (let i = 0; i < this.currentGameAdapters.length; i++) {
      const adapter = this.currentGameAdapters[i];
      adapter.update(dt);
    }
  }

  public updateGame(dt: number): void {
    if (!this.currentGame) return;

    const result = this.currentGame.update(dt);
    if (this.onGameUpdate) {
      this.onGameUpdate(result);
    }
  }

  public finishGame(): Promise<GameResult> {
    return this.currentGame.finish();
  }
}
