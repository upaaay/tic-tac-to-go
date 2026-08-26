// =====================================
// DATA GAME
// =====================================

let board = [
    "", "", "",
    "", "", "",
    "", "", ""
];

let currentPlayer = "X";
let gameActive = false;
let selectedTeam = "X";

let scoreX = 0;
let scoreO = 0;


// =====================================
// MODE GAME
// =====================================

let gameMode = "friend";
let humanPlayer = "X";
let computerPlayer = "O";


// =====================================
// AUDIO
// =====================================

let audioCtx = null;
let musicInterval = null;
let musicOn = false;

function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }

    if (audioCtx.state === "suspended") {
        audioCtx.resume();
    }
}

function sound(freq, duration, type = "sine", volume = 0.08) {
    initAudio();

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = type;
    osc.frequency.value = freq;

    gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(
        volume,
        audioCtx.currentTime + 0.01
    );

    gain.gain.exponentialRampToValueAtTime(
        0.001,
        audioCtx.currentTime + duration
    );

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + duration);
}


// Suara tombol
function buttonSound() {
    sound(600, 0.08, "triangle", 0.07);
}


// Suara klik kotak
function clickSound() {
    sound(450, 0.08, "sine", 0.08);
}


// Suara menang
function winSound() {
    sound(523, 0.15, "sine", 0.10);

    setTimeout(() => {
        sound(659, 0.15, "sine", 0.10);
    }, 150);

    setTimeout(() => {
        sound(784, 0.30, "sine", 0.12);
    }, 300);
}


// Suara kalah
function loseSound() {
    sound(330, 0.18, "sine", 0.08);

    setTimeout(() => {
        sound(220, 0.35, "sine", 0.08);
    }, 180);
}


// Suara seri
function drawSound() {
    sound(440, 0.15, "triangle", 0.08);

    setTimeout(() => {
        sound(440, 0.15, "triangle", 0.08);
    }, 180);
}


// =====================================
// MUSIK LATAR SEDERHANA
// =====================================

const musicNotes = [
    261.63,
    329.63,
    392.00,
    329.63,
    293.66,
    349.23,
    440.00,
    349.23
];

let musicIndex = 0;

function musicNote() {
    if (!musicOn) return;

    sound(
        musicNotes[musicIndex],
        0.28,
        "sine",
        0.018
    );

    musicIndex++;

    if (musicIndex >= musicNotes.length) {
        musicIndex = 0;
    }
}

function startMusic() {
    initAudio();

    if (musicOn) return;

    musicOn = true;
    musicIndex = 0;

    musicNote();

    musicInterval = setInterval(() => {
        musicNote();
    }, 400);
}

function stopMusic() {
    musicOn = false;

    if (musicInterval) {
        clearInterval(musicInterval);
        musicInterval = null;
    }
}


// =====================================
// ELEMENT
// =====================================

const splashScreen =
    document.getElementById("splashScreen");

const goBtn =
    document.getElementById("goBtn");

const menu =
    document.getElementById("menu");

const game =
    document.getElementById("game");

const startBtn =
    document.getElementById("startBtn");

const backBtn =
    document.getElementById("backBtn");

const resetScoreBtn =
    document.getElementById("resetScoreBtn");

const newGameBtn =
    document.getElementById("newGameBtn");

const playAgainBtn =
    document.getElementById("playAgainBtn");

const menuBtn =
    document.getElementById("menuBtn");

const cells =
    document.querySelectorAll(".cell");

const teamButtons =
    document.querySelectorAll(".team-btn");

const modeButtons =
    document.querySelectorAll(".mode-btn");

const turnSymbol =
    document.getElementById("turnSymbol");

const turnText =
    document.getElementById("turnText");

const scoreXElement =
    document.getElementById("scoreX");

const scoreOElement =
    document.getElementById("scoreO");

const scoreXLabel =
    document.getElementById("scoreXLabel");

const scoreOLabel =
    document.getElementById("scoreOLabel");

const gameModeText =
    document.getElementById("gameModeText");

const resultModal =
    document.getElementById("resultModal");

const resultIcon =
    document.getElementById("resultIcon");

const resultTitle =
    document.getElementById("resultTitle");

const resultText =
    document.getElementById("resultText");

const finalScoreX =
    document.getElementById("finalScoreX");

const finalScoreO =
    document.getElementById("finalScoreO");


// =====================================
// SPLASH GO
// =====================================

goBtn.addEventListener("click", () => {

    initAudio();
    buttonSound();
    startMusic();

    splashScreen.classList.add("hide");

});


// =====================================
// PILIH MODE
// =====================================

modeButtons.forEach(button => {

    button.addEventListener("click", () => {

        buttonSound();

        modeButtons.forEach(btn => {
            btn.classList.remove("selected");
        });

        button.classList.add("selected");

        gameMode = button.dataset.mode;

    });

});


// =====================================
// PILIH TEAM
// =====================================

teamButtons.forEach(button => {

    button.addEventListener("click", () => {

        buttonSound();

        teamButtons.forEach(btn => {
            btn.classList.remove("selected");
        });

        button.classList.add("selected");

        selectedTeam = button.dataset.team;

    });

});


// =====================================
// MULAI GAME
// =====================================

startBtn.addEventListener("click", () => {

    buttonSound();

    menu.classList.remove("active");
    game.classList.add("active");

    startGame();

});


// =====================================
// MULAI GAME
// =====================================

function startGame() {

    board = [
        "", "", "",
        "", "", "",
        "", "", ""
    ];

    gameActive = true;
    currentPlayer = "X";

    if (gameMode === "computer") {

        humanPlayer = selectedTeam;

        computerPlayer =
            humanPlayer === "X"
                ? "O"
                : "X";
    }

    cells.forEach(cell => {

        cell.textContent = "";
        cell.className = "cell";

    });

    updateGameLabels();
    updateTurn();

    if (
        gameMode === "computer" &&
        currentPlayer === computerPlayer
    ) {

        setTimeout(() => {
            computerMove();
        }, 500);

    }

}


// =====================================
// KLIK KOTAK
// =====================================

cells.forEach(cell => {

    cell.addEventListener("click", () => {

        const index =
            Number(cell.dataset.index);

        if (
            board[index] !== "" ||
            !gameActive
        ) {
            return;
        }

        if (
            gameMode === "computer" &&
            currentPlayer === computerPlayer
        ) {
            return;
        }

        clickSound();

        makeMove(
            index,
            currentPlayer
        );

    });

});


// =====================================
// MAKE MOVE
// =====================================

function makeMove(index, player) {

    if (
        !gameActive ||
        board[index] !== ""
    ) {
        return;
    }

    board[index] = player;

    const cell = cells[index];

    if (player === "X") {

        cell.textContent = "✕";
        cell.classList.add("x");

    } else {

        cell.textContent = "○";
        cell.classList.add("o");

    }

    cell.classList.remove("pop");

    void cell.offsetWidth;

    cell.classList.add("pop");

    const finished = checkWinner();

    if (finished) {
        return;
    }

    currentPlayer =
        currentPlayer === "X"
            ? "O"
            : "X";

    updateTurn();

    if (
        gameMode === "computer" &&
        currentPlayer === computerPlayer &&
        gameActive
    ) {

        setTimeout(() => {
            computerMove();
        }, 500);

    }

}


// =====================================
// COMPUTER
// =====================================

function computerMove() {

    if (
        !gameActive ||
        gameMode !== "computer" ||
        currentPlayer !== computerPlayer
    ) {
        return;
    }

    const bestMove = getBestMove();

    if (bestMove !== -1) {

        makeMove(
            bestMove,
            computerPlayer
        );

    }

}


// =====================================
// AI MINIMAX
// =====================================

function getBestMove() {

    const emptyCells = getEmptyCells();

    if (emptyCells.length === 0) {
        return -1;
    }

    let bestScore = -Infinity;
    let bestMove = emptyCells[0];

    for (const index of emptyCells) {

        board[index] = computerPlayer;

        const score =
            minimax(
                board,
                0,
                false
            );

        board[index] = "";

        if (score > bestScore) {

            bestScore = score;
            bestMove = index;

        }

    }

    return bestMove;

}


// =====================================
// MINIMAX
// =====================================

function minimax(
    position,
    depth,
    isMaximizing
) {

    const result =
        getBoardResult(position);

    if (result === computerPlayer) {
        return 10 - depth;
    }

    if (result === humanPlayer) {
        return depth - 10;
    }

    if (result === "draw") {
        return 0;
    }

    if (isMaximizing) {

        let bestScore = -Infinity;

        for (let i = 0; i < 9; i++) {

            if (position[i] === "") {

                position[i] = computerPlayer;

                const score =
                    minimax(
                        position,
                        depth + 1,
                        false
                    );

                position[i] = "";

                bestScore =
                    Math.max(
                        bestScore,
                        score
                    );
            }
        }

        return bestScore;

    } else {

        let bestScore = Infinity;

        for (let i = 0; i < 9; i++) {

            if (position[i] === "") {

                position[i] = humanPlayer;

                const score =
                    minimax(
                        position,
                        depth + 1,
                        true
                    );

                position[i] = "";

                bestScore =
                    Math.min(
                        bestScore,
                        score
                    );
            }
        }

        return bestScore;
    }

}


// =====================================
// KOTAK KOSONG
// =====================================

function getEmptyCells() {

    const empty = [];

    for (let i = 0; i < 9; i++) {

        if (board[i] === "") {
            empty.push(i);
        }

    }

    return empty;

}


// =====================================
// CEK BOARD AI
// =====================================

function getBoardResult(position) {

    const winningPatterns = [

        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],

        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],

        [0, 4, 8],
        [2, 4, 6]

    ];

    for (const pattern of winningPatterns) {

        const [a, b, c] = pattern;

        if (
            position[a] !== "" &&
            position[a] === position[b] &&
            position[a] === position[c]
        ) {

            return position[a];

        }

    }

    if (!position.includes("")) {
        return "draw";
    }

    return null;

}


// =====================================
// CEK PEMENANG
// =====================================

function checkWinner() {

    const winningPatterns = [

        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],

        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],

        [0, 4, 8],
        [2, 4, 6]

    ];

    let winningPattern = null;

    for (const pattern of winningPatterns) {

        const [a, b, c] = pattern;

        if (
            board[a] !== "" &&
            board[a] === board[b] &&
            board[a] === board[c]
        ) {

            winningPattern = pattern;
            break;

        }

    }


    // MENANG
    if (winningPattern) {

        gameActive = false;

        winningPattern.forEach(index => {

            cells[index]
                .classList
                .add("win");

        });

        if (currentPlayer === "X") {
            scoreX++;
        } else {
            scoreO++;
        }

        updateScore();


        // Audio menang / kalah
        if (gameMode === "computer") {

            if (currentPlayer === humanPlayer) {
                winSound();
            } else {
                loseSound();
            }

        } else {

            winSound();

        }


        setTimeout(() => {
            showWinner();
        }, 500);

        return true;

    }


    // SERI
    if (!board.includes("")) {

        gameActive = false;

        drawSound();

        setTimeout(() => {
            showDraw();
        }, 400);

        return true;

    }

    return false;

}


// =====================================
// UPDATE LABEL
// =====================================

function updateGameLabels() {

    if (gameMode === "computer") {

        gameModeText.textContent =
            "PLAYER VS COMPUTER";

        if (humanPlayer === "X") {

            scoreXLabel.textContent = "KAMU";
            scoreOLabel.textContent = "COMPUTER";

        } else {

            scoreXLabel.textContent = "COMPUTER";
            scoreOLabel.textContent = "KAMU";

        }

    } else {

        gameModeText.textContent =
            "PLAY TOGETHER";

        scoreXLabel.textContent = "TEAM X";
        scoreOLabel.textContent = "TEAM O";

    }

    updateScore();

}


// =====================================
// UPDATE GILIRAN
// =====================================

function updateTurn() {

    if (gameMode === "computer") {

        if (currentPlayer === humanPlayer) {

            turnText.textContent =
                `${currentPlayer} • KAMU`;

        } else {

            turnText.textContent =
                `${currentPlayer} • COMPUTER`;

        }

    } else {

        turnText.textContent =
            currentPlayer;

    }

    if (currentPlayer === "X") {

        turnSymbol.textContent = "✕";
        turnSymbol.style.color = "#818cf8";

    } else {

        turnSymbol.textContent = "○";
        turnSymbol.style.color = "#f472b6";

    }

}


// =====================================
// UPDATE SKOR
// =====================================

function updateScore() {

    scoreXElement.textContent = scoreX;
    scoreOElement.textContent = scoreO;

    finalScoreX.textContent = scoreX;
    finalScoreO.textContent = scoreO;

}


// =====================================
// PEMENANG
// =====================================

function showWinner() {

    resultIcon.textContent = "🏆";

    if (gameMode === "computer") {

        if (currentPlayer === humanPlayer) {

            resultTitle.textContent =
                "KAMU MENANG!";

            resultText.textContent =
                "Hebat! Kamu berhasil mengalahkan komputer.";

        } else {

            resultTitle.textContent =
                "COMPUTER MENANG!";

            resultText.textContent =
                "Komputer berhasil memenangkan permainan.";

        }

    } else {

        resultTitle.textContent =
            `TEAM ${currentPlayer} MENANG!`;

        resultText.textContent =
            `Selamat! Team ${currentPlayer} berhasil memenangkan permainan.`;

    }

    finalScoreX.textContent = scoreX;
    finalScoreO.textContent = scoreO;

    resultModal.classList.add("show");

}


// =====================================
// SERI
// =====================================

function showDraw() {

    resultIcon.textContent = "🤝";

    resultTitle.textContent =
        "HASIL SERI!";

    if (gameMode === "computer") {

        resultText.textContent =
            "Permainan berakhir seri. Coba lagi melawan komputer!";

    } else {

        resultText.textContent =
            "Tidak ada pemenang. Coba lagi dan kalahkan temanmu!";

    }

    finalScoreX.textContent = scoreX;
    finalScoreO.textContent = scoreO;

    resultModal.classList.add("show");

}


// =====================================
// MAIN LAGI DARI MODAL
// =====================================

playAgainBtn.addEventListener(
    "click",
    () => {

        buttonSound();

        resultModal.classList.remove("show");

        startGame();

    }
);


// =====================================
// MAIN LAGI
// =====================================

newGameBtn.addEventListener(
    "click",
    () => {

        buttonSound();

        startGame();

    }
);


// =====================================
// RESET SKOR
// =====================================

resetScoreBtn.addEventListener(
    "click",
    () => {

        buttonSound();

        scoreX = 0;
        scoreO = 0;

        updateScore();
        startGame();

    }
);


// =====================================
// KEMBALI KE MENU
// =====================================

backBtn.addEventListener(
    "click",
    () => {

        buttonSound();

        gameActive = false;

        game.classList.remove("active");

        menu.classList.add("active");

    }
);


// =====================================
// MENU UTAMA
// =====================================

menuBtn.addEventListener(
    "click",
    () => {

        buttonSound();

        resultModal.classList.remove("show");

        game.classList.remove("active");

        menu.classList.add("active");

    }
);