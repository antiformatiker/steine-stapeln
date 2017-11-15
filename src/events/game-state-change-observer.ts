import { GameStateChangeEvent } from './game-state-change-event';

export interface GameStateChangeObserver {

  /**
   * @param {GameStateChangeEvent} event
   */
  onGameStateChanged(event: GameStateChangeEvent);

}
