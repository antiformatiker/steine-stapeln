import { GameStateChangeEvent } from './events/game-state-change-event';
import { GameStateChangeObservable } from './events/game-state-change-observable';
import { GameStateChangeObserver } from './events/game-state-change-observer';
import { GameStateEnum } from './events/game-state.enum';
import { ResetEvent } from './events/reset-event';
import { ResetObserver } from './events/reset-observer';
import { Startable } from './startable';

export abstract class Game implements Startable, GameStateChangeObservable, ResetObserver {
  private _state: GameStateEnum;
  private gameStateChangeObservers: GameStateChangeObserver[];

  get state() {
    return this._state;
  }

  set state(state: GameStateEnum) {
    this._state = state;
    this.notifyGameStateChangeObservers(new GameStateChangeEvent(state));
  }

  constructor() {
    this.gameStateChangeObservers = [];
  }

  public abstract start(): void;

  public addGameStateChangeObserver(observer: GameStateChangeObserver): void {
    if (observer) {
      this.gameStateChangeObservers.push(observer);
    }
  }

  public removeGameStateChangeObserver(observer: GameStateChangeObserver): void {
    if (observer) {
      this.gameStateChangeObservers.forEach(
        (_observer: GameStateChangeObserver, index: number, observers: GameStateChangeObserver[]) => {
          if (observer === _observer) {
            observers.slice(index, 1);
          }
        }
      );
    }
  }

  public notifyGameStateChangeObservers(event: GameStateChangeEvent): void {
    this.gameStateChangeObservers.forEach((observer: GameStateChangeObserver) => {
      observer.onGameStateChanged(event);
    });
  }

  public onReset(event: ResetEvent): void {
    this.state = GameStateEnum.START;
    this.start();
  }

}
