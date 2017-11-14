import { Board } from './board';
import { Messenger } from './messenger';
import { Resetter } from './resetter';
import { SteineStapeln } from './steine-stapeln';
import './styles.scss';

class Main {
  constructor() {
    const resetter = new Resetter('game-reset');
    const board = new Board('game-board');
    const messenger = new Messenger('game-msg-box');
    const game = new SteineStapeln(board, messenger);

    resetter.addResetObserver(game);

    game.start();
  }
}

const main = new Main();
