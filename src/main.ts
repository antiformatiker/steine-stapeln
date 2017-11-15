import { Board } from './board';
import { Messenger } from './messenger';
import { Resetter } from './resetter';
import './scss/styles.scss';
import { SteineStapeln } from './steine-stapeln';

/**
 * Main class loads game
 */
class Main {

  /**
   * Creates all neccessary dependencies for playing this game.
   */
  constructor() {
    const resetter = new Resetter('game-reset');
    const board = new Board('game-board');
    const messenger = new Messenger('game-msg-box');
    const game = new SteineStapeln(board, messenger);

    // game observes if someone wants to reset the game
    resetter.addResetObserver(game);

    // start the game
    game.start();
  }
}

// Load game to stack
const main = new Main();
