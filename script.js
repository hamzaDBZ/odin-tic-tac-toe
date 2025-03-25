const Gameboard = (function () {
    const gameboard = [];
    
    for (let i = 0; i < 9; i++) {
        gameboard.push("");
    }

    const getBoard = () => gameboard;

    return {
        getBoard,
    }
})()

const Player = function (name, token) {
    const playerName = name;
    const playerToken = token;
    let score = 0;

    const getName = () => playerName;
    const getToken = () => playerToken;
    const getScore = () => score;
    const increaseScore = () => ++score;

    return { getName, getToken, getScore, increaseScore };
}


const GameController = (function () {
    const players = [
        Player("", "X"),
        Player("", "O")
    ]

    const getPlayers = () => players; 

    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };
    const getActivePlayer = () => activePlayer;

    const playRound = (cellNumber) => {
        const board = Gameboard.getBoard();
        if (board[cellNumber] !== '') return;

        for (let i = 0; i < board.length; i++) {
            if (i === cellNumber) {
                board[i] = getActivePlayer().getToken();
                break;
            }
        }

        const checkWinner = () => {
            if (board[0] === board[1] && board[1] === board[2] && board[0] !== '') return true;
            if (board[3] === board[4] && board[4] === board[5] && board[3] !== '') return true;
            if (board[6] === board[7] && board[7] === board[8] && board[6] !== '') return true;
            if (board[0] === board[3] && board[3] === board[6] && board[0] !== '') return true;
            if (board[1] === board[4] && board[4] === board[7] && board[1] !== '') return true;
            if (board[2] === board[5] && board[5] === board[8] && board[2] !== '') return true;
            if (board[0] === board[4] && board[4] === board[8] && board[0] !== '') return true;
            if (board[2] === board[4] && board[4] === board[6] && board[2] !== '') return true;
            
            let count = 1;
            for (const cell of board) {
                if (cell === '') return false;
                else count++;
            }

            return 'Draw';
        }

        let isGameOver = checkWinner();
        if (isGameOver === 'Draw') {
            switchPlayerTurn();
            return `It's a Draw`;
        } else if (isGameOver) {
            activePlayer.increaseScore();
            let name = activePlayer.getName();
            switchPlayerTurn();
            return `Winner is ${name}`
        }

        switchPlayerTurn();
    }

    return {playRound, getActivePlayer, switchPlayerTurn , getPlayers};

})()


const DisplayController = (function () {
    const playerTurnDiv = document.querySelector('.player-turn');
    const container = document.querySelector('.container');

    const fillPlayerName = (function () {
        const dialog = document.querySelector('dialog');
        window.addEventListener('load', () => dialog.showModal());

        const fillPlayerNameHandler = () => {
            let playerXvalue = dialog.querySelectorAll('input')[0].value;
            let playerOvalue = dialog.querySelectorAll('input')[1].value;
            const scoreBoard = document.querySelector('.score-board');
            if (playerXvalue === '' || playerOvalue === '') return;
            scoreBoard.querySelectorAll('div')[0].querySelector('span').textContent += " " + playerXvalue;
            scoreBoard.querySelectorAll('div')[2].querySelector('span').textContent += " " + playerOvalue;
            
            GameController.getPlayers()[0] = Player(playerXvalue, 'X');
            GameController.getPlayers()[1] = Player(playerOvalue, 'O');

            updateScreen();
        }
        const playBtn = dialog.querySelector('button');
        playBtn.addEventListener('click', fillPlayerNameHandler);
    })()

    const updateScreen = (thisRound) => {
        const board = Gameboard.getBoard();

        const renderplayerTurn = (function () {
            let playerName = GameController.getActivePlayer().getName();
            if (playerName === "") {
                playerName = document.querySelectorAll('.score-board div')[0].querySelector('span').textContent;
                GameController.switchPlayerTurn();
            }
            playerTurnDiv.textContent = `It's ${playerName}'s Turn`;
        })()

        const renderContainer = (function () {
            container.textContent = "";
            board.forEach((cell, index) => {
                const button = document.createElement('button');
                button.textContent = cell;
                button.dataset.cell = index;                
                container.appendChild(button);
            })
        })()

        const renderGameResult = (function () {
            const gameOverDialog = document.querySelector('.winner-wrapper dialog');
            if (thisRound !== undefined) {

                const winnerDiv = gameOverDialog.querySelector('.winner');
                winnerDiv.textContent = thisRound;

                const newGamebtn = document.querySelector('button.new-game');
                newGamebtn.addEventListener('click', () => location.reload())

                const clickRemachHandler = () => {
                    board.forEach((cell, index) => board[index] = '');
                    const playerXscore = document.querySelector('.score span:first-child');
                    const playerOscore = document.querySelector('.score span:last-child');
                    playerXscore.textContent = GameController.getPlayers()[0].getScore();
                    playerOscore.textContent = GameController.getPlayers()[1].getScore();
                    updateScreen();
                    gameOverDialog.close();
                }
                const rematchbtn = document.querySelector('button.rematch');
                rematchbtn.addEventListener('click', clickRemachHandler)

                gameOverDialog.showModal();
            }
        })()
    }
    
    const cellClickHandler = (event) => {
        const cellNumber = +event.target.dataset.cell;
        const thisRound = GameController.playRound(cellNumber);
        updateScreen(thisRound);
    }
    container.addEventListener('click', cellClickHandler);

    updateScreen();
})()