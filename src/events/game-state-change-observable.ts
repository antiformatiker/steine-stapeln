import { GameStateChangeEvent } from './game-state-change-event';
import { GameStateChangeObserver } from './game-state-change-observer';

export interface GameStateChangeObservable {

  /**
   * @param {GameStateChangeObserver} observer
   */
  addGameStateChangeObserver(observer: GameStateChangeObserver): void;

  /**
   * @param {GameStateChangeObserver} observer
   */
  removeGameStateChangeObserver(observer: GameStateChangeObserver): void;

  /**
   * @param {GameStateChangeEvent} event
   */
  notifyGameStateChangeObservers(event: GameStateChangeEvent): void;

}
