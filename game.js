(function (document) {

    'use strict';

    var Game = (function () {

        var ROWS = 8;
        var CELLS = 8;
        var PLAYERS = 2;
        var BOARD = document.getElementById('game-board');

        function Game() {
            this.grid = new Array(ROWS);
            this.initBoard();
        }

        Game.prototype.initBoard = function () {
            for (var i = 0; i < ROWS; i++) {
                this.grid[i] = new Array(CELLS);
                var row = document.createElement('div');
                row.className = 'row';
                for (var j = 0; j < CELLS; j++) {
                    var cell = document.createElement('div');
                    cell.className = 'cell';
                    cell.setAttribute('data-row', i);
                    cell.setAttribute('data-column', j);
                    cell.onclick = function (event) {
                        this.putStoneOn(event.target.getAttribute('data-row'), event.target.getAttribute('data-column'));
                    }.bind(this);
                    row.appendChild(cell);
                    this.grid[i][j] = cell;
                }
                BOARD.appendChild(row);
            }
        }

        Game.prototype.putStoneOn = function (row, column) {
            for (var k = this.grid[row].length - 1; k >= 0; k--) {
                if (!this.grid[row][k].style.backgroundColor && this.grid[row][k].style.backgroundColor !== 'rgb(255, 0, 0)') {
                    this.grid[row][k].style.backgroundColor = 'red';
                    return;
                }
            }
        }

        return Game;
    })();

    var g = new Game();

})(document);