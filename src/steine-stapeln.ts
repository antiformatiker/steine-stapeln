import { Board } from './board';
import { GameStateChangeEvent } from './events/game-state-change-event';
import { GameStateChangeObservable } from './events/game-state-change-observable';
import { GameStateChangeObserver } from './events/game-state-change-observer';
import { GameStateEnum } from './events/game-state.enum';
import { ResetEvent } from './events/reset-event';
import { StoneThrownEvent } from './events/stone-thrown-event';
import { StoneThrownObserver } from './events/stone-thrown-observer';
import { Game } from './game';
import { Messenger } from './messenger';

export class SteineStapeln extends Game implements StoneThrownObserver {

  /**
   * @param {Board} board
   * @param {Messenger} messenger
   */
  constructor(private board: Board, private messenger: Messenger) {
    super();
    this.addGameStateChangeObserver(this.board);
    this.state = GameStateEnum.START;
    this.board.addStoneThrownObserver(this);
    this.initBoard();
  }

  public start(): void {
    this.messenger.reset();
    this.messenger.print('Lasset die Spiele beginnen!');
    this.changeState();
  }

  /**
   * @param {StoneThrownEvent} event
   */
  public onStoneThrown(event: StoneThrownEvent): void {
    this.changeState();
  }

  /**
   * @param {ResetEvent} event
   */
  public onReset(event: ResetEvent): void {
    if (confirm('Sind Sie sich sicher?')) {
      this.initBoard();
      super.onReset(event);
    }
  }

  private initBoard(): void {
    this.board.init();
  }

  private changeState(): void {
    if (GameStateEnum.START === this.state) {
      this.state = GameStateEnum.PLAYER1;
      this.messenger.print('Spieler 1 ist nun an der Reihe');
    } else if (this.gameIsDone()) {
      this.finishGame();
    } else if (GameStateEnum.PLAYER1 === this.state) {
      this.state = GameStateEnum.PLAYER2;
      this.messenger.print('Spieler 2 ist nun an der Reihe!');
    } else if (GameStateEnum.PLAYER2 === this.state) {
      this.state = GameStateEnum.PLAYER1;
      this.messenger.print('Spieler 1 ist nun an der Reihe!');
    }
  }

  /**
   * @returns {boolean}
   */
  private gameIsDone(): boolean {
    return this.board.checkGameIsDone();
  }

  private finishGame(): void {
    this.messenger.print('Herzlichen Glückwunsch! Das Spiel ist zuende');
    const winner = (GameStateEnum.PLAYER1 === this.state) ? '1' : '2';
    this.messenger.print(`Spieler ${winner} hat gewonnen`);
    this.state = GameStateEnum.END;
  }

}
