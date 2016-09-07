(function (document) {

    'use strict';

    var Game = (function () {

        var ROWS = 8;
        var COLUMNS = 8;
        var PLAYERS = 2;
        var BOARD = document.getElementById('game-board');
        var ATTR_DATA_ROW = 'data-row';
        var ATTR_DATA_COLUMN = 'data-column';
        var ELEM_DIV = 'div';

        function Game() {
            this.grid = new Array(ROWS);
            this.initBoard();
        }

        Game.prototype.initBoard = function () {
            for (var i = 0; i < ROWS; i++) {
                this.grid[i] = new Array(COLUMNS);
                var row = document.createElement(ELEM_DIV);
                row.className = 'row';
                for (var j = 0; j < COLUMNS; j++) {
                    var cell = document.createElement(ELEM_DIV);
                    cell.className = 'cell';
                    cell.setAttribute(ATTR_DATA_ROW, i);
                    cell.setAttribute(ATTR_DATA_COLUMN, j);
                    cell.onclick = function (e) {
                        this.putStoneOn(e.target.getAttribute(ATTR_DATA_ROW), e.target.getAttribute(ATTR_DATA_COLUMN));
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