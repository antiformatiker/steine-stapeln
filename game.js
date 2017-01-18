/* ***** BEGIN LICENSE BLOCK *****
* MIT License
*
* Copyright (c) 2017 antiformatiker
*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
*
*
* ***** END LICENSE BLOCK ***** */


/**
 * @author antiformatiker <lowbrow.coder@gmail.com>
 * @version 1.0.0
 */

(function (document) {

    'use strict';

    var Game = (function () {

        /** @const {number} */ var ROWS = 8;
        /** @const {number} */ var COLUMNS = 8;
        /** @const {number} */ var STONES_TO_WIN = 4;
        /** @const {number} */ var PLAYERS = 2;
        /** @const {HTMLDivElement} */ var BOARD = document.getElementById('game-board');
        /** @const {HTMLTextAreaElement} */ var MSGBOX = document.getElementById('game-msg-box');

        /**
         * @enum {string}
         */
        var AttrDataEnum = Object.freeze({ ROW: 'data-row', COLUMN: 'data-column' });

        /**
         * @enum {number}
         */
        var StateEnum = Object.freeze({ START: 0, PLAYER1: 1, PLAYER2: 2, END: 3 });

        /**
         * Constructor of game class
         *
         * @this {Game}
         * @constructor
         */
        function Game() {
            /** @private */ this.state = StateEnum.START;
            /** @private */ this.grid = new Array(ROWS);
            this.initBoard();
        }

        /**
         * @public
         * @this {Game}
         */
        Game.prototype.start = function () {
            MSGBOX.value = '';
            this.writeMsg('Lasset die Spiele beginnen!');
            this.changeState();
        }

        /**
         * Initialisation of the game board
         *
         * @private
         * @this {Game}
         */
        Game.prototype.initBoard = function () {
            for (var i = 0; i < ROWS; i++) {
                this.grid[i] = new Array(COLUMNS);
                var row = this.createRow();
                for (var j = 0; j < COLUMNS; j++) {
                    var cell = this.createCell(i, j);
                    row.appendChild(cell);
                    this.grid[i][j] = {
                        htmlObject: cell,
                        player: null
                    };
                }
                BOARD.appendChild(row);
            }
        }

        /**
         * @private
         * @this {Game}
         * @return {HTMLDivElement}
         */
        Game.prototype.createRow = function () {
            var row = document.createElement('div');
            row.className = 'row';
            return row;
        }

        /**
         * @private
         * @this {Game}
         * @param {number} rowIndex
         * @param {number} columnIndex
         * @return {HTMLDivElement}
         */
        Game.prototype.createCell = function (rowIndex, columnIndex) {
            var cell = document.createElement('div');
            cell.className = 'cell';
            cell.setAttribute(AttrDataEnum.ROW, rowIndex);
            cell.setAttribute(AttrDataEnum.COLUMN, columnIndex);
            cell.onclick = function (e) {
                if (this.state !== StateEnum.END) {
                    if (this.putStone(e.target.getAttribute(AttrDataEnum.ROW), e.target.getAttribute(AttrDataEnum.COLUMN))) {
                        this.changeState();
                    } else {
                        this.writeMsg('Ungültig, hier konnte kein Stein gelegt werden, versuchen Sie es woanders.');
                    }
                }
            }.bind(this);
            return cell;
        }

        /**
         * @private
         * @this {Game}
         * @param {number} row
         * @param {number} column
         * @return {boolean}
         */
        Game.prototype.putStone = function (row, column) {
            for (var k = this.grid[row].length - 1; k >= 0; k--) {
                if (this.grid[k][column].player === null) {
                    this.grid[k][column].player = (this.state === StateEnum.PLAYER1) ? StateEnum.PLAYER1 : StateEnum.PLAYER2;
                    this.grid[k][column].htmlObject.className += (this.state === StateEnum.PLAYER1) ? ' p1' : ' p2';
                    return true;
                }
            }
            return false;
        }

        /**
         * @private
         * @this {Game}
         */
        Game.prototype.changeState = function () {
            if (this.state === StateEnum.START) {
                this.setState(StateEnum.PLAYER1);
                this.writeMsg('Spieler 1 ist nun an der Reihe');
                return;
            } else if (this.gameIsDone()) {
                this.writeMsg('Herzlichen Glückwunsch! Das Spiel ist zuende');
                var winner = (this.state === StateEnum.PLAYER1) ? '1' : '2';
                this.writeMsg('Spieler ' + winner + ' hat gewonnen');
                this.setState(StateEnum.END);
                return;
            } else if (this.state === StateEnum.PLAYER1) {
                this.setState(StateEnum.PLAYER2);
                this.writeMsg('Spieler 2 ist nun an der Reihe!');
                return;
            } else if (this.state === StateEnum.PLAYER2) {
                this.setState(StateEnum.PLAYER1);
                this.writeMsg('Spieler 1 ist nun an der Reihe!');
                return;
            }
        }

        /**
         * @private
         * @this {Game}
         */
        Game.prototype.setState = function (state) {
            this.state = state;
        }

        /**
         * @private
         * @this {Game}
         * @reutrn {boolean}
         */
        Game.prototype.gameIsDone = function () {
            if (this.horizontalWin()
                || this.verticalWin()
                || this.diagonalDownWin()
                || this.diagonalUpWin()) {
                return true
            }
            return false;
        }

        /**
         * @private
         * @this {Game}
         * @return {boolean}
         */
        Game.prototype.horizontalWin = function () {
            var stein1 = [],
                stein2 = [],
                stein3 = [],
                stein4 = [];

            for (var i = 0; i < ROWS; i++) {
                for (var j = 0; j < COLUMNS - 3; j++) {
                    stein1.push(this.grid[i][j]);
                }
            }

            for (var k = 0; k < ROWS; k++) {
                for (var l = 1; l < COLUMNS - 2; l++) {
                    stein2.push(this.grid[k][l]);
                }
            }

            for (var m = 0; m < ROWS; m++) {
                for (var n = 2; n < COLUMNS - 1; n++) {
                    stein3.push(this.grid[m][n]);
                }
            }

            for (var o = 0; o < ROWS; o++) {
                for (var p = 3; p < COLUMNS; p++) {
                    stein4.push(this.grid[o][p]);
                }
            }

            for (var q = 0; q < stein1.length; q++) {
                if (stein1[q].player === this.state
                    && stein2[q].player === this.state
                    && stein3[q].player === this.state
                    && stein4[q].player === this.state) {
                    stein1[q].htmlObject.className += ' wl';
                    stein2[q].htmlObject.className += ' wl';
                    stein3[q].htmlObject.className += ' wl';
                    stein4[q].htmlObject.className += ' wl';
                    return true;
                }
            }

            return false;
        }

        /**
         * @private
         * @this {Game}
         * @return {boolean}
         */
        Game.prototype.verticalWin = function () {
            var stein1 = [],
                stein2 = [],
                stein3 = [],
                stein4 = [];

            for (var i = 0; i < ROWS - 3; i++) {
                for (var j = 0; j < COLUMNS; j++) {
                    stein1.push(this.grid[i][j]);
                }
            }

            for (var k = 1; k < ROWS - 2; k++) {
                for (var l = 0; l < COLUMNS; l++) {
                    stein2.push(this.grid[k][l]);
                }
            }

            for (var m = 2; m < ROWS - 1; m++) {
                for (var n = 0; n < COLUMNS; n++) {
                    stein3.push(this.grid[m][n]);
                }
            }

            for (var o = 3; o < ROWS; o++) {
                for (var p = 0; p < COLUMNS; p++) {
                    stein4.push(this.grid[o][p]);
                }
            }

            for (var q = 0; q < stein1.length; q++) {
                if (stein1[q].player === this.state
                    && stein2[q].player === this.state
                    && stein3[q].player === this.state
                    && stein4[q].player === this.state) {
                    stein1[q].htmlObject.className += ' wl';
                    stein2[q].htmlObject.className += ' wl';
                    stein3[q].htmlObject.className += ' wl';
                    stein4[q].htmlObject.className += ' wl';
                    return true;
                }
            }

            return false;
        }

        /**
         * @private
         * @this {Game}
         * @return {boolean}
         */
        Game.prototype.diagonalDownWin = function () {
            var stein1 = [],
                stein2 = [],
                stein3 = [],
                stein4 = [];

            for (var i = 0; i < ROWS - 3; i++) {
                for (var j = 0; j < COLUMNS - 3; j++) {
                    stein1.push(this.grid[i][j]);
                }
            }

            for (var k = 1; k < ROWS - 2; k++) {
                for (var l = 1; l < COLUMNS - 2; l++) {
                    stein2.push(this.grid[k][l]);
                }
            }

            for (var m = 2; m < ROWS - 1; m++) {
                for (var n = 2; n < COLUMNS - 1; n++) {
                    stein3.push(this.grid[m][n]);
                }
            }

            for (var o = 3; o < ROWS; o++) {
                for (var p = 3; p < COLUMNS; p++) {
                    stein4.push(this.grid[o][p]);
                }
            }

            for (var q = 0; q < stein1.length; q++) {
                if (stein1[q].player === this.state
                    && stein2[q].player === this.state
                    && stein3[q].player === this.state
                    && stein4[q].player === this.state) {
                    stein1[q].htmlObject.className += ' wl';
                    stein2[q].htmlObject.className += ' wl';
                    stein3[q].htmlObject.className += ' wl';
                    stein4[q].htmlObject.className += ' wl';
                    return true;
                }
            }

            return false;
        }

        /**
         * @private
         * @this {Game}
         * @return {boolean}
         */
        Game.prototype.diagonalUpWin = function () {
            var stein1 = [],
                stein2 = [],
                stein3 = [],
                stein4 = [];

            for (var i = 0; i < ROWS - 3; i++) {
                for (var j = 3; j < COLUMNS; j++) {
                    stein1.push(this.grid[i][j]);
                }
            }

            for (var k = 1; k < ROWS - 2; k++) {
                for (var l = 2; l < COLUMNS - 1; l++) {
                    stein2.push(this.grid[k][l]);
                }
            }

            for (var m = 2; m < ROWS - 1; m++) {
                for (var n = 1; n < COLUMNS - 2; n++) {
                    stein3.push(this.grid[m][n]);
                }
            }

            for (var o = 3; o < ROWS; o++) {
                for (var p = 0; p < COLUMNS - 3; p++) {
                    stein4.push(this.grid[o][p]);
                }
            }

            for (var q = 0; q < stein1.length; q++) {
                if (stein1[q].player === this.state
                    && stein2[q].player === this.state
                    && stein3[q].player === this.state
                    && stein4[q].player === this.state) {
                    stein1[q].htmlObject.className += ' wl';
                    stein2[q].htmlObject.className += ' wl';
                    stein3[q].htmlObject.className += ' wl';
                    stein4[q].htmlObject.className += ' wl';
                    return true;
                }
            }

            return false;
        }

        /**
         * @private
         * @this {Game}
         * @param {string} msg the message which will be displayed in the textarea
         */
        Game.prototype.writeMsg = function (msg) {
            MSGBOX.value += msg + "\n";
            MSGBOX.scrollTop = MSGBOX.scrollHeight;
        }

        return Game;

    })();

    var g = new Game();
    g.start();

})(document);