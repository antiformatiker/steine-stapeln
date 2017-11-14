import { GameStateEnum } from './game-state.enum';

export class GameStateChangeEvent {
  constructor(public state: GameStateEnum) {
  }
}
