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
// TAMBAHAN MODE GAME
// =====================================

let gameMode = "friend";

let humanPlayer = "X";

let computerPlayer = "O";


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


// TAMBAHAN
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


// TAMBAHAN
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

    splashScreen.classList.add("hide");

});


// =====================================
// TAMBAHAN: PILIH MODE
// =====================================

modeButtons.forEach(button => {

    button.addEventListener("click", () => {

        modeButtons.forEach(btn => {

            btn.classList.remove("selected");

        });


        button.classList.add("selected");


        gameMode =
            button.dataset.mode;

    });

});


// =====================================
// PILIH TEAM X / O
// =====================================

teamButtons.forEach(button => {

    button.addEventListener("click", () => {

        teamButtons.forEach(btn => {

            btn.classList.remove("selected");

        });


        button.classList.add("selected");


        selectedTeam =
            button.dataset.team;

    });

});


// =====================================
// MULAI GAME
// =====================================

startBtn.addEventListener("click", () => {

    menu.classList.remove("active");

    game.classList.add("active");

    startGame();

});


// =====================================
// MULAI / RESET BOARD
// =====================================

function startGame() {

    board = [
        "", "", "",
        "", "", "",
        "", "", ""
    ];


    gameActive = true;


    // X selalu mulai
    currentPlayer = "X";


    // =================================
    // MODE KOMPUTER
    // =================================

    if (gameMode === "computer") {

        humanPlayer =
            selectedTeam;


        computerPlayer =
            humanPlayer === "X"
                ? "O"
                : "X";

    }


    // Bersihkan papan

    cells.forEach(cell => {

        cell.textContent = "";

        cell.className = "cell";

    });


    updateGameLabels();

    updateTurn();


    // =================================
    // JIKA PLAYER PILIH O
    // KOMPUTER X MULAI
    // =================================

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


        // Kotak sudah terisi
        // atau game selesai

        if (
            board[index] !== "" ||
            !gameActive
        ) {

            return;

        }


        // =================================
        // JIKA MODE KOMPUTER
        // JANGAN BIARKAN PLAYER KLIK
        // SAAT GILIRAN KOMPUTER
        // =================================

        if (
            gameMode === "computer" &&
            currentPlayer === computerPlayer
        ) {

            return;

        }


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


    // Simpan pemain

    board[index] =
        player;


    const cell =
        cells[index];


    // Tampilkan X

    if (player === "X") {

        cell.textContent = "✕";

        cell.classList.add("x");

    }

    // Tampilkan O

    else {

        cell.textContent = "○";

        cell.classList.add("o");

    }


    // Animasi asli

    cell.classList.remove("pop");

    void cell.offsetWidth;

    cell.classList.add("pop");


    // Cek hasil

    const finished =
        checkWinner();


    if (finished) {

        return;

    }


    // Ganti giliran

    currentPlayer =
        currentPlayer === "X"
            ? "O"
            : "X";


    updateTurn();


    // =================================
    // JIKA GILIRAN KOMPUTER
    // =================================

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
// KOMPUTER / AI
// =====================================

function computerMove() {

    if (
        !gameActive ||
        gameMode !== "computer" ||
        currentPlayer !== computerPlayer
    ) {

        return;

    }


    const bestMove =
        getBestMove();


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

    const emptyCells =
        getEmptyCells();


    if (emptyCells.length === 0) {

        return -1;

    }


    let bestScore =
        -Infinity;

    let bestMove =
        emptyCells[0];


    for (
        const index of emptyCells
    ) {

        board[index] =
            computerPlayer;


        const score =
            minimax(
                board,
                0,
                false
            );


        board[index] =
            "";


        if (score > bestScore) {

            bestScore =
                score;

            bestMove =
                index;

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


    // Komputer menang

    if (
        result === computerPlayer
    ) {

        return 10 - depth;

    }


    // Player menang

    if (
        result === humanPlayer
    ) {

        return depth - 10;

    }


    // Seri

    if (
        result === "draw"
    ) {

        return 0;

    }


    // =================================
    // KOMPUTER MAKSIMALKAN SKOR
    // =================================

    if (isMaximizing) {

        let bestScore =
            -Infinity;


        for (
            let i = 0;
            i < 9;
            i++
        ) {

            if (
                position[i] === ""
            ) {

                position[i] =
                    computerPlayer;


                const score =
                    minimax(
                        position,
                        depth + 1,
                        false
                    );


                position[i] =
                    "";


                bestScore =
                    Math.max(
                        bestScore,
                        score
                    );

            }

        }


        return bestScore;

    }


    // =================================
    // PLAYER MEMINIMALKAN SKOR
    // =================================

    else {

        let bestScore =
            Infinity;


        for (
            let i = 0;
            i < 9;
            i++
        ) {

            if (
                position[i] === ""
            ) {

                position[i] =
                    humanPlayer;


                const score =
                    minimax(
                        position,
                        depth + 1,
                        true
                    );


                position[i] =
                    "";


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


    for (
        let i = 0;
        i < 9;
        i++
    ) {

        if (
            board[i] === ""
        ) {

            empty.push(i);

        }

    }


    return empty;

}


// =====================================
// CEK BOARD UNTUK AI
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


    for (
        const pattern
        of winningPatterns
    ) {

        const [a, b, c] =
            pattern;


        if (
            position[a] !== "" &&
            position[a] === position[b] &&
            position[a] === position[c]
        ) {

            return position[a];

        }

    }


    if (
        !position.includes("")
    ) {

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


    let winningPattern =
        null;


    // Cek semua kemungkinan menang

    for (
        let pattern
        of winningPatterns
    ) {

        const [a, b, c] =
            pattern;


        if (
            board[a] !== "" &&
            board[a] === board[b] &&
            board[a] === board[c]
        ) {

            winningPattern =
                pattern;

            break;

        }

    }


    // =================================
    // JIKA MENANG
    // =================================

    if (winningPattern) {

        gameActive = false;


        // Animasi kotak pemenang

        winningPattern.forEach(index => {

            cells[index]
                .classList
                .add("win");

        });


        // Tambah skor

        if (
            currentPlayer === "X"
        ) {

            scoreX++;

        }

        else {

            scoreO++;

        }


        updateScore();


        setTimeout(() => {

            showWinner();

        }, 500);


        return true;

    }


    // =================================
    // JIKA SERI
    // =================================

    if (
        !board.includes("")
    ) {

        gameActive = false;


        setTimeout(() => {

            showDraw();

        }, 400);


        return true;

    }


    return false;

}


// =====================================
// UPDATE LABEL GAME
// =====================================

function updateGameLabels() {

    if (
        gameMode === "computer"
    ) {

        gameModeText.textContent =
            "PLAYER VS COMPUTER";


        if (
            humanPlayer === "X"
        ) {

            scoreXLabel.textContent =
                "KAMU";

            scoreOLabel.textContent =
                "COMPUTER";

        }

        else {

            scoreXLabel.textContent =
                "COMPUTER";

            scoreOLabel.textContent =
                "KAMU";

        }

    }

    else {

        gameModeText.textContent =
            "PLAY TOGETHER";


        scoreXLabel.textContent =
            "TEAM X";

        scoreOLabel.textContent =
            "TEAM O";

    }


    updateScore();

}


// =====================================
// UPDATE GILIRAN
// =====================================

function updateTurn() {

    if (
        gameMode === "computer"
    ) {

        if (
            currentPlayer === humanPlayer
        ) {

            turnText.textContent =
                `${currentPlayer} • KAMU`;

        }

        else {

            turnText.textContent =
                `${currentPlayer} • COMPUTER`;

        }

    }

    else {

        turnText.textContent =
            currentPlayer;

    }


    if (
        currentPlayer === "X"
    ) {

        turnSymbol.textContent =
            "✕";

        turnSymbol.style.color =
            "#818cf8";

    }

    else {

        turnSymbol.textContent =
            "○";

        turnSymbol.style.color =
            "#f472b6";

    }

}


// =====================================
// UPDATE SKOR
// =====================================

function updateScore() {

    scoreXElement.textContent =
        scoreX;

    scoreOElement.textContent =
        scoreO;


    finalScoreX.textContent =
        scoreX;

    finalScoreO.textContent =
        scoreO;

}


// =====================================
// TAMPILKAN PEMENANG
// =====================================

function showWinner() {

    resultIcon.textContent =
        "🏆";


    if (
        gameMode === "computer"
    ) {

        if (
            currentPlayer === humanPlayer
        ) {

            resultTitle.textContent =
                "KAMU MENANG!";


            resultText.textContent =
                "Hebat! Kamu berhasil mengalahkan komputer.";

        }

        else {

            resultTitle.textContent =
                "COMPUTER MENANG!";


            resultText.textContent =
                "Komputer berhasil memenangkan permainan.";

        }

    }

    else {

        resultTitle.textContent =
            `TEAM ${currentPlayer} MENANG!`;


        resultText.textContent =
            `Selamat! Team ${currentPlayer} berhasil memenangkan permainan.`;

    }


    finalScoreX.textContent =
        scoreX;

    finalScoreO.textContent =
        scoreO;


    resultModal.classList.add(
        "show"
    );

}


// =====================================
// TAMPILKAN HASIL SERI
// =====================================

function showDraw() {

    resultIcon.textContent =
        "🤝";


    resultTitle.textContent =
        "HASIL SERI!";


    if (
        gameMode === "computer"
    ) {

        resultText.textContent =
            "Permainan berakhir seri. Coba lagi melawan komputer!";

    }

    else {

        resultText.textContent =
            "Tidak ada pemenang. Coba lagi dan kalahkan temanmu!";

    }


    finalScoreX.textContent =
        scoreX;

    finalScoreO.textContent =
        scoreO;


    resultModal.classList.add(
        "show"
    );

}


// =====================================
// MAIN LAGI DARI MODAL
// =====================================

playAgainBtn.addEventListener(
    "click",
    () => {

        resultModal.classList.remove(
            "show"
        );


        startGame();

    }
);


// =====================================
// MAIN LAGI DARI GAME
// =====================================

newGameBtn.addEventListener(
    "click",
    () => {

        startGame();

    }
);


// =====================================
// RESET SKOR
// =====================================

resetScoreBtn.addEventListener(
    "click",
    () => {

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

        gameActive = false;


        game.classList.remove(
            "active"
        );


        menu.classList.add(
            "active"
        );

    }
);


// =====================================
// MENU UTAMA DARI MODAL
// =====================================

menuBtn.addEventListener(
    "click",
    () => {

        resultModal.classList.remove(
            "show"
        );


        game.classList.remove(
            "active"
        );


        menu.classList.add(
            "active"
        );

    }
);