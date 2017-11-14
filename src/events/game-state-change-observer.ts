import { GameStateChangeEvent } from './game-state-change-event';

export interface GameStateChangeObserver {
  onGameStateChanged(event: GameStateChangeEvent);
}
