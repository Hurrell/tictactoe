"use strict"

//gameboard array module
const gameBoard = (() => {
    let boardValues = [["","",""],["","",""],["","",""]];
    const getValue = (row,column) => boardValues[row][column];
    const changeValue = function (row,column,value) {
        if (boardValues[row][column] === ""){
            boardValues[row][column] = value;
            return true;
        } else {
            return false;
        };
    };
    const board = () => {
        let board = [["","",""],["","",""],["","",""]];
        for (let i in boardValues) {
            for (let j in boardValues) {
                board[i][j]=boardValues[i][j];
            };
        };
        return board;
    };
    const isWinner = (player) => {
        const isSame = (array,symbol) => {
            return !array.some(function(value){
                return value !== symbol;
            });
        }
        //check rows
        for (const row in boardValues) {
            if (isSame(boardValues[row],player.getType())) {
                return true;
            }
        }
        //check columns
        for (let i =0; i<boardValues[0].length;i++) {
            let column = []
            for (const row in boardValues) {
                column.push(boardValues[row][i]);
            }
            if (isSame(column,player.getType())) {
                return true;
            }
        }
        //check diags
        let diag1 = [boardValues[0][0],boardValues[1][1],boardValues[2][2]];
        let diag2 = [boardValues[2][0],boardValues[1][1],boardValues[0][2]];
        if (isSame(diag1,player.getType()) || isSame(diag2,player.getType())){
            return true;
        };
        return false;
    }

    //iterate through the board array and render on screen
    const render = function (target) {
        //first make sure main div is clear
        while(target.firstChild){
            target.removeChild(target.firstChild);
        };
        //then rebuild
        for (const row in boardValues) {
            for (const column in boardValues[row]) {
                let tileValue = getValue(row,column);
                let newTile = document.createElement('div');
                newTile.classList.add("tile");
                newTile.setAttribute("data-column",column);
                newTile.setAttribute("data-row",row);
                newTile.textContent = tileValue;
                target.appendChild(newTile);
            };
        };
    };
    const reset = () => {
        boardValues = [["","",""],["","",""],["","",""]];
    }
    return {
        getValue,
        changeValue,
        render,
        isWinner,
        reset,
        board,
    };
})();

//player factory
const Player = (type) => {
    let score = 0;
    const getType = () => type;
    const getScore = () => score;
    const addWinnings = () => ++score;
    const play = (row, column) => gameBoard.changeValue(row,column,type);
    return {
        getType,
        getScore,
        addWinnings,
        play,
    };
};

//game object
const game = (() => {
    //winner check
    //turn system
    const user = Player("x");
    const pc = Player("o");

    const reset = () => {
        let tiles = Array.from(document.querySelectorAll('.tile'));
        tiles.forEach((event)=>{event.textContent = ""});
        let status = document.querySelector('#status');
        while (status.firstChild) {
            status.removeChild(status.firstChild);
        }
        gameBoard.reset();
    }
    const addUserMove = (event) => {
        if (event.target.classList == "tile") {
            let column = event.target.dataset.column;
            let row = event.target.dataset.row;
            if (user.play(row,column)) {
                gameBoard.render(boardLocation);
                nextTurn(user);
            };
        };
    };

    const pcMove = () => {

        let board = gameBoard.board();
        let rows = [];
        let columns = [["","",""],["","",""],["","",""],];
        for (let i in board) {
            rows.push(board[i]);
        }
        for (let i in board) {
            for (let j in board[i]) {
                columns[j][i] = board[i][j];
            }
        }
        for (let i in rows) {
            let countX = (rows[i].filter((e) => e.includes('x'))).length;
            let countO = (rows[i].filter((e) => e.includes('o'))).length;
            if (countO >= 2) {
                for (let j in rows[i]) {
                    if (rows[i][j]==""){
                        pc.play(i,j);
                        gameBoard.render(boardLocation);
                        nextTurn(pc);
                        return true;
                    }
                }
            }
            if (countX >= 2) {
                for (let j in rows[i]) {
                    if (rows[i][j]==""){
                        pc.play(i,j);
                        gameBoard.render(boardLocation);
                        nextTurn(pc);
                        return true;
                    }
                }
            }
        }
        for (let j in columns) {
            let countX = (columns[j].filter((e) => e.includes('x'))).length;
            let countO = (columns[j].filter((e) => e.includes('o'))).length;

            if (countO >= 2) {
                for (let i in columns[j]) {
                    if (columns[j][i]==""){
                        pc.play(i,j);
                        gameBoard.render(boardLocation);
                        nextTurn(pc);
                        return true;
                    }
                }
            }
            if (countX >= 2) {
                for (let i in columns[j]) {
                    if (columns[j][i]==""){
                        pc.play(i,j);
                        gameBoard.render(boardLocation);
                        nextTurn(pc);
                        return true;
                    }
                }
            }
        }




        let availTiles = [];
        for(let i =0; i<3;i++) {
            for(let j = 0; j<3; j++) {
                if(gameBoard.getValue(i,j) == '') {
                    availTiles.push([i,j]);

                };
            };
        };
        let choice = Math.floor(Math.random() * availTiles.length);
        if (pc.play(availTiles[choice][0],availTiles[choice][1])) {
            gameBoard.render(boardLocation);
            nextTurn(pc);
            return true;
        };
    };

    const displayWinner = (winner) => {
        let display = document.querySelector("#status");
        let message = document.createElement('div');
        message.textContent = `${winner.getType()} Wins!`;
        display.appendChild(message);
        let resetButton = document.createElement("div");
        resetButton.setAttribute('id','reset');
        resetButton.textContent = "Reset";
        display.appendChild(resetButton);
        display.addEventListener('click',reset);
    }
    const nextTurn = (currentPlayer) => {
        if(gameBoard.isWinner(currentPlayer)) {
            displayWinner(currentPlayer);
        } else {
            switch(currentPlayer.getType()) {
                case user.getType():
                    pcMove();
                    break;
                case pc.getType():
                    break;
            }
        }
    }
    let boardLocation = document.querySelector("#board");
    gameBoard.render(boardLocation);
    window.addEventListener('click', addUserMove);
    return {
        pcMove,
        user,
        pc,
    }
})();
