import { GameStateEnum } from './game-state.enum';

export class GameStateChangeEvent {

  /**
   * @param {GameStateEnum} state
   */
  constructor(public state: GameStateEnum) { }

}
