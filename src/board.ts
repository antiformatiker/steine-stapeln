import './board.scss';
import { Cell } from './cell';
import { CLASS, DATA, ELEMENT } from './constants';
import { GameStateChangeEvent } from './events/game-state-change-event';
import { GameStateChangeObserver } from './events/game-state-change-observer';
import { GameStateEnum } from './events/game-state.enum';
import { StoneThrownEvent } from './events/stone-thrown-event';
import { StoneThrownObservable } from './events/stone-thrown-observable';
import { StoneThrownObserver } from './events/stone-thrown-observer';

export class Board implements StoneThrownObservable, GameStateChangeObserver {

  private readonly rows: number = 8;
  private readonly columns: number = 8;
  private htmlElement: HTMLDivElement;
  private grid: Cell[][];
  private state: GameStateEnum;
  private stoneThrownObservers: StoneThrownObserver[];

  constructor(private id: string) {
    this.stoneThrownObservers = [];
    this.htmlElement = document.getElementById(this.id) as HTMLDivElement;
    this.grid = new Array(this.rows);
  }

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

  public checkGameIsDone(): boolean {
    return this.horizontalWin()
      || this.verticalWin()
      || this.diagonalDownWin()
      || this.diagonalUpWin();
  }

  public onGameStateChanged(event: GameStateChangeEvent): void {
    this.state = event.state;
  }

  public addStoneThrownObserver(observer: StoneThrownObserver): void {
    if (observer) {
      this.stoneThrownObservers.push(observer);
    }
  }

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

  public notifyStoneThrownObservers(event: StoneThrownEvent): void {
    this.stoneThrownObservers.forEach((observer: StoneThrownObserver) => observer.onStoneThrown(event));
  }

  private createRow(): HTMLDivElement {
    const row = document.createElement(ELEMENT.DIV) as HTMLDivElement;
    row.className = CLASS.ROW;

    return row;
  }

  private createCell(rowIndex, columnIndex): HTMLDivElement {
    const cell = document.createElement(ELEMENT.DIV) as HTMLDivElement;
    cell.className = CLASS.CELL;
    cell.setAttribute(DATA.ROW, rowIndex);
    cell.setAttribute(DATA.COLUMN, columnIndex);
    cell.onclick = (event: MouseEvent) => {
      const div = event.target as HTMLDivElement;
      if (this.state !== GameStateEnum.END) {
        if (this.throwStone(div.getAttribute(DATA.ROW), div.getAttribute(DATA.COLUMN))) {
          this.notifyStoneThrownObservers(new StoneThrownEvent());
        }
      }
    };

    return cell;
  }

  private throwStone(row, column): boolean {
    for (let k = this.grid[row].length - 1; k >= 0; k--) {
      if (this.grid[k][column].player === 0) {
        this.grid[k][column].player = (this.state === GameStateEnum.PLAYER1)
          ? GameStateEnum.PLAYER1 : GameStateEnum.PLAYER2;
        this.grid[k][column].htmlObject.className += (this.state === GameStateEnum.PLAYER1)
          ? ` ${CLASS.PLAYER1}` : ` ${CLASS.PLAYER2}`;

        return true;
      }
    }

    return false;
  }

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
