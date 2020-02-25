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
    return {
        getValue,
        changeValue,
        render,
        isWinner,
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
        let availTiles = [];
        for(let i =0; i<3;i++) {
            for(let j = 0; j<3; j++) {
                if(gameBoard.getValue(i,j) == '') {
                    availTiles.push([i,j]);

                };
            };
        };
        let choice = Math.floor(Math.random() * (availTiles.length - 0 + 1)) + 0;
        if (pc.play(availTiles[choice][0],availTiles[choice][1])) {
            gameBoard.render(boardLocation);
            nextTurn(pc);
            return true;
        };
    };

    const nextTurn = (currentPlayer) => {
        if(gameBoard.isWinner(currentPlayer)) {
            console.log(currentPlayer.getType() + ' wins!');
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
    const getGameResult = () => {
        //check 3 in a row
        //check 3 in a column
        //check diags
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
