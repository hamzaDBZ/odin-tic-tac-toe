const Gameboard = (function () {
    const gameboard = [];
    const rows = 3;
    const columns = 3;
    
    for (let i = 0; i < rows; i++) {
        gameboard[i] = []
        for (let j = 0; j < columns; j++) {
            gameboard[i].push("");
        }
    }

    const getBoard = () => gameboard;
    const printBoard = () => gameboard.forEach((row) => console.log(row));

    return {
        getBoard,
        printBoard,
    }
})()

const Player = function (name, token) {
    const playerName = name;
    const playerToken = token;

    const getName = () => playerName;
    const getToken = () => playerToken;

    return { getName, getToken }
}

const GameController = (function () {
    const players = [
        Player(prompt("Enter Player One Name"), "X"),
        Player(prompt("Enter Player Two Name"), "O")
    ]

    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };
    const getActivePlayer = () => activePlayer;

    const playNewRound = () => {
        console.log(`${getActivePlayer().getName()}'s turn`);
        Gameboard.printBoard();
    }

    const playRound = (cellNumber) => {
        cellNumber--;
        const board = Gameboard.getBoard();

        if (board.flat()[cellNumber] !== '' || cellNumber > board.flat().length) return;

        cellNumber++;
        let count = 1;
        breaker:
        for (let i = 0; board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                if (count === cellNumber) {
                    board[i][j] = getActivePlayer().getToken();
                    break breaker;
                }
                count++;
            }
        }

        function checkWinner() {
            flatBoard = board.flat();
        
            if (flatBoard[0] === flatBoard[1] && flatBoard[1] === flatBoard[2] && flatBoard[0] !== '') return true;
            if (flatBoard[3] === flatBoard[4] && flatBoard[4] === flatBoard[5] && flatBoard[3] !== '') return true;
            if (flatBoard[6] === flatBoard[7] && flatBoard[7] === flatBoard[8] && flatBoard[6] !== '') return true;
            if (flatBoard[0] === flatBoard[3] && flatBoard[3] === flatBoard[6] && flatBoard[0] !== '') return true;
            if (flatBoard[1] === flatBoard[4] && flatBoard[4] === flatBoard[7] && flatBoard[1] !== '') return true;
            if (flatBoard[2] === flatBoard[5] && flatBoard[5] === flatBoard[8] && flatBoard[2] !== '') return true;
            if (flatBoard[0] === flatBoard[4] && flatBoard[4] === flatBoard[8] && flatBoard[0] !== '') return true;
            if (flatBoard[2] === flatBoard[4] && flatBoard[4] === flatBoard[6] && flatBoard[2] !== '') return true;
            
            let count = 1;
            for (const cell of flatBoard) {
                if (cell === '') return false;
                else count++;
            }

            return 'Draw';
        }

            let isGameOver = checkWinner();
        if (isGameOver === 'Draw') {
            return `It's a Draw`;
        } else if (isGameOver) {
            return `${getActivePlayer().getName()}'s the WINNER!`
        }


        switchPlayerTurn();
        playNewRound();
    }

    playNewRound();

    return {playRound};

})()