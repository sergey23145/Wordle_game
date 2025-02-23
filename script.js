const WORD_LIST = ["apple", "grape", "melon", "lemon", "peach", "plum"];
const WORD_LENGTH = 5;
const MAX_ATTEMPTS = 6;

let secretWord = chooseWord();
let attempts = 0;
let guesses = [];
let currentGuess = ""; // Store the current guess being typed
let gameOver = false;

const grid = document.getElementById("grid");
const message = document.getElementById("message");
const submitButton = document.getElementById("submitButton");
const keyboard = document.getElementById("keyboard");
const resetButton = document.getElementById("resetButton");

// Create grid
function createGrid() {
    for (let i = 0; i < MAX_ATTEMPTS; i++) {
        const row = document.createElement("div");
        row.classList.add("row");
        for (let j = 0; j < WORD_LENGTH; j++) {
            const square = document.createElement("div");
            square.classList.add("square");
            row.appendChild(square);
        }
        grid.appendChild(row);
    }
}

// Create keyboard
function createKeyboard() {
  const keyboardRows = [
    "QWERTYUIOP",
    "ASDFGHJKL",
    "⌫ZXCVBNM↵",
  ];

  for (const row of keyboardRows) {
    const rowDiv = document.createElement("div");
    rowDiv.classList.add("keyboard-row");

    for (const letter of row) {
      const key = document.createElement("button");
      key.classList.add("key");

      //Special characters:
      if (letter === "⌫") {
        key.textContent = "⌫";  // Backspace
      } else if (letter === "↵") {
        key.textContent = "↵"; //Enter
        key.textContent = "↵"
      } else {
        key.textContent = letter;
      }

      key.addEventListener("click", () => {
        if (!gameOver) {
            if (letter === "⌫") {
                removeLetterFromGrid();
            } else if (letter === "↵") {
                handleSubmit();
            }
            else if (currentGuess.length < WORD_LENGTH) {
                addLetterToGrid(letter);
            }
        }
      });
      rowDiv.appendChild(key);
    }

    keyboard.appendChild(rowDiv);
  }
}

// Choose a word
function chooseWord() {
    return WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)].toUpperCase();
}

// Check the guess
function checkGuess(guess) {
    const result = new Array(WORD_LENGTH).fill("grey");
    const secretWordList = secretWord.split("");

    // Find greens
    for (let i = 0; i < WORD_LENGTH; i++) {
        if (guess[i] === secretWord[i]) {
            result[i] = "green";
            secretWordList[i] = null;
        }
    }

    // Find yellows
    for (let i = 0; i < WORD_LENGTH; i++) {
        if (result[i] === "grey") {
            const index = secretWordList.indexOf(guess[i]);
            if (index !== -1) {
                result[i] = "yellow";
                secretWordList[index] = null;
            }
        }
    }

    return result;
}

// Update grid
function updateGrid() {
    const rows = document.querySelectorAll(".row");
    for (let i = 0; i < guesses.length; i++) {
        const guess = guesses[i].word;
        const result = guesses[i].result;
        for (let j = 0; j < WORD_LENGTH; j++) {
            const square = rows[i].children[j];
            square.textContent = guess[j];
            square.classList.add(result[j]);
        }
    }

     // Clear remaining squares in current row
    if (guesses.length < MAX_ATTEMPTS && currentGuess.length < WORD_LENGTH) {
        const currentRow = rows[guesses.length];
        for (let j = currentGuess.length; j < WORD_LENGTH; j++) {
            const square = currentRow.children[j];
            square.textContent = "";
        }
    }
}
function addLetterToGrid(letter) {
    if (currentGuess.length < WORD_LENGTH) {
        currentGuess += letter;
        updateCurrentGrid();
    }
}

function removeLetterFromGrid() {
    if (currentGuess.length > 0) {
        currentGuess = currentGuess.slice(0, -1);
        updateCurrentGrid();
    }
}
function updateCurrentGrid() {
    const rows = document.querySelectorAll(".row");
    const currentRow = rows[attempts];  // Use 'attempts' instead of guesses.length
    for (let j = 0; j < WORD_LENGTH; j++) {
        const square = currentRow.children[j];
        square.textContent = j < currentGuess.length ? currentGuess[j] : "";
    }
}
// Update keyboard
function updateKeyboard() {
    const keys = document.querySelectorAll(".key");
    for (const key of keys) {
        const letter = key.textContent;
        let keyColor = "white";

        for (const guess of guesses) {
            const word = guess.word;
            const result = guess.result;
            for (let i = 0; i < WORD_LENGTH; i++) {
                if (word[i] === letter) {
                    if (result[i] === "green") {
                        keyColor = "green";
                        break;
                    } else if (result[i] === "yellow" && keyColor !== "green") {
                        keyColor = "yellow";
                    } else if (keyColor !== "green" && keyColor !== "yellow") {
                        keyColor = "grey";
                    }
                }
            }
            if (keyColor === "green") {
                break;
            }
        }

        key.classList.add(keyColor);
    }
}

// Handle submit
function handleSubmit() {
    if (gameOver) return;

    if (currentGuess.length !== WORD_LENGTH) {
        message.textContent = `Пожалуйста, введите слово из ${WORD_LENGTH} букв.`;
        return;
    }

    const result = checkGuess(currentGuess);
    guesses.push({ word: currentGuess, result: result });
    attempts++; // Changed from attempts to guesses

    updateGrid();
    updateKeyboard();
    currentGuess = "";
    updateCurrentGrid()

    if (currentGuess === secretWord) {
        message.textContent = "Поздравляем! Вы угадали слово!";
        gameOver = true;
    } else if (attempts === MAX_ATTEMPTS) {
        message.textContent = `Вы проиграли. Загаданное слово было: ${secretWord}`;
        gameOver = true;
    } else {
        message.textContent = "";
    }
}

// Handle reset
function handleReset() {
    secretWord = chooseWord();
    attempts = 0;
    guesses = [];
    currentGuess = "";
    gameOver = false;
    message.textContent = "";

    // Clear the grid
    while (grid.firstChild) {
        grid.removeChild(grid.firstChild);
    }

    // Recreate the grid
    createGrid();

    // Reset keyboard
    const keys = document.querySelectorAll(".key");
    for (const key of keys) {
        key.classList.remove("green", "yellow", "grey");
    }
      updateCurrentGrid()
    guessInput.focus();
}

// Event listeners

//submitButton.addEventListener("click", handleSubmit);   <--- Delete this line
resetButton.addEventListener("click", handleReset);

// Keyboard support
document.addEventListener("keydown", (event) => {
    if (!gameOver) {
        if (/^[A-Z]$/.test(event.key.toUpperCase())) {
            addLetterToGrid(event.key.toUpperCase());
        } else if (event.key === "Enter") {
            handleSubmit();
        } else if (event.key === "Backspace") {
            removeLetterFromGrid();
        }
    }
});

// Initialize
createGrid();
createKeyboard();
updateCurrentGrid()