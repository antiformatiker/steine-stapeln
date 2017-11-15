import { CLASS } from './constants/class.constants';
import { DATA } from './constants/data.constants';
import { ELEMENT } from './constants/element.constants';
import { GameStateChangeEvent } from './events/game-state-change-event';
import { GameStateChangeObserver } from './events/game-state-change-observer';
import { GameStateEnum } from './events/game-state.enum';
import { StoneThrownEvent } from './events/stone-thrown-event';
import { StoneThrownObservable } from './events/stone-thrown-observable';
import { StoneThrownObserver } from './events/stone-thrown-observer';
import { Cell } from './interfaces/cell';
import './scss/board.scss';

/**
 * Blueprint for the game board. Fires an event which indicates that a stone is beeing thrown.
 * Observes the state of the game.
 */
export class Board implements StoneThrownObservable, GameStateChangeObserver {

  private readonly rows: number = 8;
  private readonly columns: number = 8;

  private htmlElement: HTMLDivElement;
  private grid: Cell[][];
  private state: GameStateEnum;
  private stoneThrownObservers: StoneThrownObserver[];

  /**
   * Get the html element based on the given id and creates a new grid.
   * @param {string} id the identifier for the html element
   */
  constructor(private id: string) {
    this.stoneThrownObservers = [];
    this.htmlElement = document.getElementById(this.id) as HTMLDivElement;
    this.grid = new Array(this.rows);
  }

  /**
   * Initialize the board:
   * Remove the content of the board and create new content.
   */
  public init(): void {
    this.htmlElement.innerHTML = '';
    for (let i = 0; i < this.rows; i++) {
      this.grid[i] = new Array(this.columns);
      const row = this.createRow();
      for (let j = 0; j < this.columns; j++) {
        const cell = this.createCell(i, j);
        row.appendChild(cell);
        this.grid[i][j] = {
          htmlObject: cell,
          player: 0,
        };
      }
      if (this.htmlElement) {
        this.htmlElement.appendChild(row);
      }
    }
  }

  /**
   * Checks if the game has been won.
   * @returns {boolean}
   */
  public checkGameIsDone(): boolean {
    return this.horizontalWin()
      || this.verticalWin()
      || this.diagonalDownWin()
      || this.diagonalUpWin();
  }

  /**
   * On GameStateChangeEvent has been fired.
   * @param {GameStateChangeEvent} event
   */
  public onGameStateChanged(event: GameStateChangeEvent): void {
    this.state = event.state;
  }

  /**
   * Adds a new StoneThrownObserver to the collection.
   * @param {StoneThrownObserver} observer
   */
  public addStoneThrownObserver(observer: StoneThrownObserver): void {
    if (observer) {
      this.stoneThrownObservers.push(observer);
    }
  }

  /**
   * Removes a StoneThrownObserver from the collection.
   * @param {StoneThrownObserver} observer
   */
  public removeStoneThrownObserver(observer: StoneThrownObserver): void {
    if (observer) {
      this.stoneThrownObservers.forEach(
        (_observer: StoneThrownObserver, index: number, observers: StoneThrownObserver[]) => {
          if (observer === _observer) {
            observers.slice(index, 1);
          }
        }
      );
    }
  }

  /**
   * Notifies all StoneThrownObserver that a StoneThrownEvent has been fired.
   * @param {StoneThrownEvent} event
   */
  public notifyStoneThrownObservers(event: StoneThrownEvent): void {
    this.stoneThrownObservers.forEach((observer: StoneThrownObserver) => observer.onStoneThrown(event));
  }

  /**
   * Creates a row in form of a div element.
   * @returns {HTMLDivElement}
   */
  private createRow(): HTMLDivElement {
    const row = document.createElement(ELEMENT.DIV) as HTMLDivElement;
    row.className = CLASS.ROW;

    return row;
  }

  /**
   * Creates a cell in form of a div element.
   * @param {number} rowIndex
   * @param {number} columnIndex
   * @returns {HTMLDivElement}
   */
  private createCell(rowIndex: number, columnIndex: number): HTMLDivElement {
    const cell = document.createElement(ELEMENT.DIV) as HTMLDivElement;
    cell.className = CLASS.CELL;
    cell.setAttribute(DATA.ROW, rowIndex.toString());
    cell.setAttribute(DATA.COLUMN, columnIndex.toString());
    cell.onclick = (event: MouseEvent) => {
      const div = event.target as HTMLDivElement;
      if (GameStateEnum.END !== this.state) {
        const row = div.getAttribute(DATA.ROW);
        const column = div.getAttribute(DATA.COLUMN);
        if (this.throwStone(row, column)) {
          this.notifyStoneThrownObservers(new StoneThrownEvent(this));
        }
      }
    };

    return cell;
  }

  /**
   * Throws a stone into the grid.
   * @param {string|null} row
   * @param {string|null} column
   * @returns {boolean}
   * @throws {Error}
   */
  private throwStone(row: string | null, column: string | null): boolean {
    if (null === row || null === column) {
      throw Error('Oops, i ... think i am null');
    }
    for (let k = this.grid[+row].length - 1; k >= 0; k--) {
      if (0 === this.grid[k][+column].player) {
        this.grid[k][+column].player = (GameStateEnum.PLAYER1 === this.state)
          ? GameStateEnum.PLAYER1 : GameStateEnum.PLAYER2;
        this.grid[k][+column].htmlObject.className += (GameStateEnum.PLAYER1 === this.state)
          ? ` ${CLASS.PLAYER1}` : ` ${CLASS.PLAYER2}`;

        return true;
      }
    }

    return false;
  }

  /**
   * @returns {boolean}
   */
  private horizontalWin(): boolean {
    const stein1: Cell[] = [];
    const stein2: Cell[] = [];
    const stein3: Cell[] = [];
    const stein4: Cell[] = [];

    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns - 3; j++) {
        stein1.push(this.grid[i][j]);
      }
    }

    for (let k = 0; k < this.rows; k++) {
      for (let l = 1; l < this.columns - 2; l++) {
        stein2.push(this.grid[k][l]);
      }
    }

    for (let m = 0; m < this.rows; m++) {
      for (let n = 2; n < this.columns - 1; n++) {
        stein3.push(this.grid[m][n]);
      }
    }

    for (let o = 0; o < this.rows; o++) {
      for (let p = 3; p < this.columns; p++) {
        stein4.push(this.grid[o][p]);
      }
    }

    for (let q = 0; q < stein1.length; q++) {
      if (stein1[q].player === this.state
        && stein2[q].player === this.state
        && stein3[q].player === this.state
        && stein4[q].player === this.state) {
        stein1[q].htmlObject.className += ` ${CLASS.WIN}`;
        stein2[q].htmlObject.className += ` ${CLASS.WIN}`;
        stein3[q].htmlObject.className += ` ${CLASS.WIN}`;
        stein4[q].htmlObject.className += ` ${CLASS.WIN}`;

        return true;
      }
    }

    return false;
  }

  /**
   * @returns {boolean}
   */
  private verticalWin(): boolean {
    const stein1: Cell[] = [];
    const stein2: Cell[] = [];
    const stein3: Cell[] = [];
    const stein4: Cell[] = [];

    for (let i = 0; i < this.rows - 3; i++) {
      for (let j = 0; j < this.columns; j++) {
        stein1.push(this.grid[i][j]);
      }
    }

    for (let k = 1; k < this.rows - 2; k++) {
      for (let l = 0; l < this.columns; l++) {
        stein2.push(this.grid[k][l]);
      }
    }

    for (let m = 2; m < this.rows - 1; m++) {
      for (let n = 0; n < this.columns; n++) {
        stein3.push(this.grid[m][n]);
      }
    }

    for (let o = 3; o < this.rows; o++) {
      for (let p = 0; p < this.columns; p++) {
        stein4.push(this.grid[o][p]);
      }
    }

    for (let q = 0; q < stein1.length; q++) {
      if (stein1[q].player === this.state
        && stein2[q].player === this.state
        && stein3[q].player === this.state
        && stein4[q].player === this.state) {
        stein1[q].htmlObject.className += ` ${CLASS.WIN}`;
        stein2[q].htmlObject.className += ` ${CLASS.WIN}`;
        stein3[q].htmlObject.className += ` ${CLASS.WIN}`;
        stein4[q].htmlObject.className += ` ${CLASS.WIN}`;

        return true;
      }
    }

    return false;
  }

  /**
   * @returns {boolean}
   */
  private diagonalDownWin(): boolean {
    const stein1: Cell[] = [];
    const stein2: Cell[] = [];
    const stein3: Cell[] = [];
    const stein4: Cell[] = [];

    for (let i = 0; i < this.rows - 3; i++) {
      for (let j = 0; j < this.columns - 3; j++) {
        stein1.push(this.grid[i][j]);
      }
    }

    for (let k = 1; k < this.rows - 2; k++) {
      for (let l = 1; l < this.columns - 2; l++) {
        stein2.push(this.grid[k][l]);
      }
    }

    for (let m = 2; m < this.rows - 1; m++) {
      for (let n = 2; n < this.columns - 1; n++) {
        stein3.push(this.grid[m][n]);
      }
    }

    for (let o = 3; o < this.rows; o++) {
      for (let p = 3; p < this.columns; p++) {
        stein4.push(this.grid[o][p]);
      }
    }

    for (let q = 0; q < stein1.length; q++) {
      if (stein1[q].player === this.state
        && stein2[q].player === this.state
        && stein3[q].player === this.state
        && stein4[q].player === this.state) {
        stein1[q].htmlObject.className += ` ${CLASS.WIN}`;
        stein2[q].htmlObject.className += ` ${CLASS.WIN}`;
        stein3[q].htmlObject.className += ` ${CLASS.WIN}`;
        stein4[q].htmlObject.className += ` ${CLASS.WIN}`;

        return true;
      }
    }

    return false;
  }

  /**
   * @returns {boolean}
   */
  private diagonalUpWin(): boolean {
    const stein1: Cell[] = [];
    const stein2: Cell[] = [];
    const stein3: Cell[] = [];
    const stein4: Cell[] = [];

    for (let i = 0; i < this.rows - 3; i++) {
      for (let j = 3; j < this.columns; j++) {
        stein1.push(this.grid[i][j]);
      }
    }

    for (let k = 1; k < this.rows - 2; k++) {
      for (let l = 2; l < this.columns - 1; l++) {
        stein2.push(this.grid[k][l]);
      }
    }

    for (let m = 2; m < this.rows - 1; m++) {
      for (let n = 1; n < this.columns - 2; n++) {
        stein3.push(this.grid[m][n]);
      }
    }

    for (let o = 3; o < this.rows; o++) {
      for (let p = 0; p < this.columns - 3; p++) {
        stein4.push(this.grid[o][p]);
      }
    }

    for (let q = 0; q < stein1.length; q++) {
      if (stein1[q].player === this.state
        && stein2[q].player === this.state
        && stein3[q].player === this.state
        && stein4[q].player === this.state) {
        stein1[q].htmlObject.className += ` ${CLASS.WIN}`;
        stein2[q].htmlObject.className += ` ${CLASS.WIN}`;
        stein3[q].htmlObject.className += ` ${CLASS.WIN}`;
        stein4[q].htmlObject.className += ` ${CLASS.WIN}`;

        return true;
      }
    }

    return false;
  }

}
