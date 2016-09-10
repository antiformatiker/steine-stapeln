/* ***** BEGIN LICENSE BLOCK *****
* MIT License
* 
* Copyright (c) 2016 antiformatiker
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
 * @version 0.0.1-alpha
 */

(function (document) {

    'use strict';

    var Game = (function () {

        /** @const {number} */ var ROWS = 8;
        /** @const {number} */ var COLUMNS = 8;
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
                    this.grid[i][j] = cell;
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
                this.putStoneOn(e.target.getAttribute(AttrDataEnum.ROW), e.target.getAttribute(AttrDataEnum.COLUMN));
                this.changeState();
            }.bind(this);
            return cell;
        }

        /**
         * @private
         * @this {Game}
         */
        Game.prototype.putStoneOn = function (row, column) {
            for (var k = this.grid[row].length - 1; k >= 0; k--) {
                if (!this.grid[row][k].style.backgroundColor && this.grid[row][k].style.backgroundColor !== 'rgb(255, 0, 0)') {
                    this.grid[row][k].style.backgroundColor = 'red';
                    return;
                }
            }
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
            }
            if (this.hasWon()) {
                this.setState(StateEnum.END);
                this.writeMsg('Herzlichen Glückwunsch! Das Spiel ist zuende');
                return;
            }
            if (this.state === StateEnum.PLAYER1) {
                this.setState(StateEnum.PLAYER2);
                this.writeMsg('Spieler 2 ist nun an der Reihe!');
                return;
            }
            if (this.state === StateEnum.PLAYER2) {
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
         */
        Game.prototype.hasWon = function () {
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