// statusPromptElement stores the last action that was visible to the player/client as the current state the game was left in
const statusPromptElement = document.querySelector('.statusPrompt');

// currentPlayer is the current player's turn which is first declared as 'X' everytime at the start of the game and will later change to 'O' or stay as/back to 'X' using a function which decides whats appropriate 
let currentPlayer = 'X';

// I declared these messages that will show-up for the player once they input something to inform them of the state of the match
// They're declared as functions so that the messages appear depending on the most current data modifications
const winStatusPrompt = () => `${currentPlayer} won!`;
const drawStatusPrompt = () => `Its a draw!`;
const currentPlayerTurn = () => `It's ${currentPlayer} turn!`;

// As long as gameActive is true then the game will go onabort, once its false it will be paused
let gameActive = true;

// The array of empty strings will store all the inputs from the players clicking on the cells to be used later for determining if it meets any winning combination or a match draw condition
let gameStatus = ['','','','','','','','',''];

// The arrays in winCombinations here determine which indexes have the right values (aka cells clicked) to form a victory for the player who achieved one of these results
const winCombinations = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
];

// Using innerHTML and the statusPromptElement we declared earlier we present to the players whose turn it is
statusPromptElement.innerHTML = currentPlayerTurn();

// cellClick function checks if one of our cells have been clicked and if it has been clicked before at all.
// If its a cell that has already been clicked, then it won't accept any new user inputs into that same cell unless game is restarted which would clear up all the cells anyway.
function cellClick(cellClickEvent) {

    // Saves the HTML clicked cell as a variable to be used in our script
    const clickedCell = cellClickEvent.target;

    // Using parseInt and the previously declared 'data-cell-index' attribute which we used in the HTML the latest clicked cell will be indentified within the index we created.
    // parseInt is used here because getAttribute will return a string value and we need a number/integer to use in our functions
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index'));

    // The if condition here checks if the cell is already full and wether the game is active or paused. If any of these conditions are true then the player's click won't be registered
    if (gameStatus[clickedCellIndex] !== "" || !gameActive) {
        return;
    }

    // If the if condition clears out then these two functions which we'll define soon and are necessary for the game to go on will be activated
    checkCell(clickedCell, clickedCellIndex);
    gameEndCondition();
}

// changeCurrentPlayer function takes care of changing the currentPlayer turn based on the ternary operator condition we provided
function changeCurrentPlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusPromptElement.innerHTML = currentPlayerTurn();
}

// In this function gameStatus is updated to reflect the recently stored cells based on the clickedCellIndex element, along with which player's turn it currently is
// The next line informs the player on the front-end
function checkCell(clickedCell, clickedCellIndex) {
    gameStatus[clickedCellIndex] = currentPlayer;
    clickedCell.innerHTML = currentPlayer;
}

// gameRestart is the function we wrote for our Restart button which we set in the HTML.
// All the game tracking elements will be set back into their default state when this function is activated, and the gameStatus array will be empty of any values again which will remove any previously input Xs and Os
// And of course the innerHTML message will reflect that the game is restarted into default state to the player
function gameRestart() {
    gameActive = true
    currentPlayer = 'X';
    gameStatus = ['','','','','','','','',''];
    statusPromptElement.innerHTML = currentPlayerTurn();
    document.querySelectorAll('.cell').forEach(cell => cell.innerHTML = '');
}

// this is our main function for this game and it checks wether the game ends in a win, a draw, or if its still ongoing.
function gameEndCondition() {

    // As long as this element has a false value the game won't end as a result of a winCondition
    let matchVictory = false;

    // The for loop checks if the gameStatus array numbers match with the winCombinations we set earlier
    for (let i = 0; i <= 7; i++) {
        const winCondition = winCombinations[i];
        let a = gameStatus[winCondition[0]];
        let b = gameStatus[winCondition[1]];
        let c = gameStatus[winCondition[2]];

        // The if condition checks if any of the 3 instances of an array are empty and if so the game continues without a match victory 
        if (a === '' || b === '' || c === '') {
            continue;
        }

        // When this if condition which checks if the three stored integer values match one of the winCombinations is true the matchVictory is set to true and the game logic is broken
        if (a === b && b == c) {
            matchVictory = true;
            break;
        }
    }
    
    // This simply displays that the game ended with a victoty to the player when matchVictory is confirmed and gameActive is set to false meaning the match functions are off unless restarted
    if (matchVictory) {
        statusPromptElement.innerHTML = winStatusPrompt();
        gameActive = false;
        return;
    }

    // This element can be used when all the cells are full for the draw condition later on
    let matchDraw = !gameStatus.includes('');

    // If the draw condition rule in matchDraw is satisfied then game will end and status that the game ended in a draw will be displayed to the player
    if (matchDraw) {
        statusPromptElement.innerHTML = drawStatusPrompt();
        gameActive = false;
        return;
    }

    // Executing this function after a game ends ensures that the game doesn't always start with X player 
    changeCurrentPlayer();
}

// This activates the event listener so that that the user's clicks register as inputting values into the cells
document.querySelectorAll('.cell').forEach( cell => cell.addEventListener('click', cellClick));

// This activates the event listener so that the Restart button executes the gameRestart function
document.querySelector('.restartGame').addEventListener('click', gameRestart);
