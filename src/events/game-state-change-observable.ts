import { GameStateChangeEvent } from './game-state-change-event';
import { GameStateChangeObserver } from './game-state-change-observer';

export interface GameStateChangeObservable {
  addGameStateChangeObserver(observer: GameStateChangeObserver): void;
  removeGameStateChangeObserver(observer: GameStateChangeObserver): void;
  notifyGameStateChangeObservers(event: GameStateChangeEvent): void;
}
