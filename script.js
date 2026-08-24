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


const turnSymbol =
    document.getElementById("turnSymbol");

const turnText =
    document.getElementById("turnText");


const scoreXElement =
    document.getElementById("scoreX");

const scoreOElement =
    document.getElementById("scoreO");


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


    // Dalam Tic Tac Toe X selalu mulai

    currentPlayer = "X";


    cells.forEach(cell => {

        cell.textContent = "";

        cell.className = "cell";

    });


    updateTurn();

}


// =====================================
// KLIK KOTAK
// =====================================

cells.forEach(cell => {

    cell.addEventListener("click", () => {

        const index =
            cell.dataset.index;


        // Jangan bisa klik jika
        // kotak sudah terisi
        // atau game selesai

        if (
            board[index] !== "" ||
            !gameActive
        ) {

            return;

        }


        // Simpan pemain

        board[index] =
            currentPlayer;


        // Tampilkan X atau O

        if (currentPlayer === "X") {

            cell.textContent = "✕";

            cell.classList.add("x");

        } else {

            cell.textContent = "○";

            cell.classList.add("o");

        }


        // Animasi kecil ke besar

        cell.classList.remove("pop");

        void cell.offsetWidth;

        cell.classList.add("pop");


        // Cek hasil

        checkWinner();

    });

});


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


    // Cek semua kemungkinan menang

    for (let pattern of winningPatterns) {

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


    // =================================
    // JIKA MENANG
    // =================================

    if (winningPattern) {

        gameActive = false;


        // Beri animasi kotak pemenang

        winningPattern.forEach(index => {

            cells[index].classList.add("win");

        });


        // Tambah skor

        if (currentPlayer === "X") {

            scoreX++;

        } else {

            scoreO++;

        }


        updateScore();


        // Tunggu sedikit supaya
        // pemain melihat kemenangan

        setTimeout(() => {

            showWinner();

        }, 500);


        return;

    }


    // =================================
    // JIKA SERI
    // =================================

    if (!board.includes("")) {

        gameActive = false;


        setTimeout(() => {

            showDraw();

        }, 400);


        return;

    }


    // =================================
    // GANTI GILIRAN
    // =================================

    currentPlayer =
        currentPlayer === "X"
            ? "O"
            : "X";


    updateTurn();

}


// =====================================
// UPDATE GILIRAN
// =====================================

function updateTurn() {

    turnText.textContent =
        currentPlayer;


    if (currentPlayer === "X") {

        turnSymbol.textContent = "✕";

        turnSymbol.style.color =
            "#818cf8";

    } else {

        turnSymbol.textContent = "○";

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

    resultIcon.textContent = "🏆";


    resultTitle.textContent =
        `TEAM ${currentPlayer} MENANG!`;


    resultText.textContent =
        `Selamat! Team ${currentPlayer} berhasil memenangkan permainan.`;


    finalScoreX.textContent =
        scoreX;

    finalScoreO.textContent =
        scoreO;


    resultModal.classList.add("show");

}


// =====================================
// TAMPILKAN HASIL SERI
// =====================================

function showDraw() {

    resultIcon.textContent = "🤝";


    resultTitle.textContent =
        "HASIL SERI!";


    resultText.textContent =
        "Tidak ada pemenang. Coba lagi dan kalahkan temanmu!";


    finalScoreX.textContent =
        scoreX;

    finalScoreO.textContent =
        scoreO;


    resultModal.classList.add("show");

}


// =====================================
// MAIN LAGI DARI MODAL
// =====================================

playAgainBtn.addEventListener("click", () => {

    resultModal.classList.remove("show");


    startGame();

});


// =====================================
// MAIN LAGI DARI GAME
// =====================================

newGameBtn.addEventListener("click", () => {

    startGame();

});


// =====================================
// RESET SKOR
// =====================================

resetScoreBtn.addEventListener("click", () => {

    scoreX = 0;

    scoreO = 0;


    updateScore();


    startGame();

});


// =====================================
// KEMBALI KE MENU
// =====================================

backBtn.addEventListener("click", () => {

    gameActive = false;


    game.classList.remove("active");

    menu.classList.add("active");

});


// =====================================
// MENU UTAMA DARI MODAL
// =====================================

menuBtn.addEventListener("click", () => {

    resultModal.classList.remove("show");

    game.classList.remove("active");

    menu.classList.add("active");

});