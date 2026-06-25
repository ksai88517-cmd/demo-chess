document.addEventListener("DOMContentLoaded", () => {

    const board = document.getElementById("chessboard");

    const pieces = {
        r:"♜",
        n:"♞",
        b:"♝",
        q:"♛",
        k:"♚",
        p:"♟",

        R:"♖",
        N:"♘",
        B:"♗",
        Q:"♕",
        K:"♔",
        P:"♙"
    };

    const moveSound =
    new Audio("assets/sounds/move.mp3");

    const captureSound =
    new Audio("assets/sounds/captured.mp3");

    const checkSound =
    new Audio("assets/sounds/check.mp3");

    const castleSound =
    new Audio("assets/sounds/castle.mp3");

    const gameOverSound =
    new Audio("assets/sounds/gameover.mp3");

    let gameStates = [];

    let matchAlreadySaved = false;

    let whiteTime = 600;
    let blackTime = 600;

    let clockInterval;

    let moveHistory = [];

    let lastMove = null;

    let whiteCaptured = [];
    let blackCaptured = [];

    let whiteKingMoved = false;
    let blackKingMoved = false;

    let whiteLeftRookMoved = false;
    let whiteRightRookMoved = false;

    let blackLeftRookMoved = false;
    let blackRightRookMoved = false;

let currentPlayer = "white";

let gameMode = "player";
let aiColor = "black";

let selectedSquare = null;
let legalMoves = [];

    let gameBoard = [
        ["r","n","b","q","k","b","n","r"],
        ["p","p","p","p","p","p","p","p"],
        ["","","","","","","",""],
        ["","","","","","","",""],
        ["","","","","","","",""],
        ["","","","","","","",""],
        ["P","P","P","P","P","P","P","P"],
        ["R","N","B","Q","K","B","N","R"]
    ];

    function createBoard(){

        board.innerHTML = "";

        document.getElementById("turnDisplay")
        .textContent =
        currentPlayer === "white"
        ? "White's Turn"
        : "Black's Turn";

        for(let row=0; row<8; row++){

            for(let col=0; col<8; col++){

                const square = document.createElement("div");

                square.classList.add("square");

                if((row + col) % 2 === 0){
                    square.classList.add("light");
                }else{
                    square.classList.add("dark");
                }

                square.dataset.row = row;
                square.dataset.col = col;

                const piece = gameBoard[row][col];

                if(piece){
                    square.textContent = pieces[piece];
                }

                square.addEventListener("click", handleSquareClick);

                board.appendChild(square);
            }
        }

        highlightMoves();
    }


    function handleSquareClick(e){

        const row = parseInt(e.currentTarget.dataset.row);
        const col = parseInt(e.currentTarget.dataset.col);

        if(selectedSquare){

            const validMove = legalMoves.find(
                move => move.row === row && move.col === col
            );

            if(validMove){

                movePiece(
                    selectedSquare.row,
                    selectedSquare.col,
                    row,
                    col
                );

                currentPlayer =
                    currentPlayer === "white"
                    ? "black"
                    : "white";

                    saveGame();

                selectedSquare = null;
                legalMoves = [];

if(
    gameMode === "ai" &&
    currentPlayer === aiColor
){

    setTimeout(() => {

        makeAIMove();

    },500);

}

    if(isCheckmate(currentPlayer)){

    updateStats("win");

    gameOver(
        "🏆 CHECKMATE! " +
        (
            currentPlayer === "white"
            ? "Black"
            : "White"
        ) +
        " Wins!"
    );

    return;
}

if(isStalemate(currentPlayer)){

    updateStats("draw");

    gameOver("🤝 Stalemate!");

    return;
}

if(isKingInCheck(currentPlayer)){

    document.getElementById("turnDisplay")
        .textContent =
        currentPlayer +
        " KING IS IN CHECK!";

        checkSound.play();
}

createBoard();

return;
            }
        }

        const piece = gameBoard[row][col];

        if(piece === ""){
            selectedSquare = null;
            legalMoves = [];
            createBoard();
            return;
        }

        if(
            currentPlayer === "white" &&
            piece !== piece.toUpperCase()
        ){
            return;
        }

        if(
            currentPlayer === "black" &&
            piece !== piece.toLowerCase()
        ){
            return;
        }

selectedSquare = {row,col};

legalMoves = getLegalMoves(row,col)
    .filter(move =>
        !wouldLeaveKingInCheck(
            row,
            col,
            move.row,
            move.col
        )
    );

createBoard();

    }

    function saveState(){

    if(!gameStates){
        gameStates = [];
    }

    gameStates.push({

        gameBoard:
            JSON.parse(
                JSON.stringify(gameBoard)
            ),

        currentPlayer,

        moveHistory:
            [...moveHistory],

        whiteCaptured:
            [...whiteCaptured],

        blackCaptured:
            [...blackCaptured],

        whiteTime,

        blackTime,

        lastMove:
            lastMove
            ? {...lastMove}
            : null

    });

}

function movePiece(fromRow,fromCol,toRow,toCol){

    saveState();

    const piece =
    gameBoard[fromRow][fromCol];

    const capturedPiece =
    gameBoard[toRow][toCol];

    if(capturedPiece !== ""){

    captureSound.play();

}else{

    moveSound.play();

}

    recordMove(
    piece,
    fromRow,
    fromCol,
    toRow,
    toCol
);

    const move = legalMoves.find(
    m =>
        m.row === toRow &&
        m.col === toCol
);

if(move?.enPassant){

    if(piece === "P"){

        gameBoard[toRow + 1][toCol] = "";

    }else{

        gameBoard[toRow - 1][toCol] = "";

    }

}

if(capturedPiece !== ""){

    if(capturedPiece === capturedPiece.toUpperCase()){

        blackCaptured.push(capturedPiece);

    }else{

        whiteCaptured.push(capturedPiece);

    }

    updateCapturedPieces();

}

    gameBoard[toRow][toCol] =
        gameBoard[fromRow][fromCol];

    gameBoard[fromRow][fromCol] = "";

    // White kingside

if(
    piece === "K" &&
    fromRow === 7 &&
    fromCol === 4 &&
    toCol === 6
){

    gameBoard[7][5] =
        gameBoard[7][7];

    gameBoard[7][7] = "";

    castleSound.play();
}

// White queenside

if(
    piece === "K" &&
    fromRow === 7 &&
    fromCol === 4 &&
    toCol === 2
){

    gameBoard[7][3] =
        gameBoard[7][0];

    gameBoard[7][0] = "";

    castleSound.play();
}

// Black kingside

if(
    piece === "k" &&
    fromRow === 0 &&
    fromCol === 4 &&
    toCol === 6
){

    gameBoard[0][5] =
        gameBoard[0][7];

    gameBoard[0][7] = "";
    castleSound.play();
}

// Black queenside

if(
    piece === "k" &&
    fromRow === 0 &&
    fromCol === 4 &&
    toCol === 2
){

    gameBoard[0][3] =
        gameBoard[0][0];

    gameBoard[0][0] = "";
    castleSound.play();
}

    checkPromotion(
        toRow,
        toCol
    );

    const movedPiece =
    gameBoard[toRow][toCol];

if(movedPiece === "K")
    whiteKingMoved = true;

if(movedPiece === "k")
    blackKingMoved = true;
lastMove = {
    fromRow,
    fromCol,
    toRow,
    toCol,
    piece:
        gameBoard[toRow][toCol]
};

if(piece === "K"){
    whiteKingMoved = true;
}

if(piece === "k"){
    blackKingMoved = true;
}

if(piece === "R" && fromRow === 7 && fromCol === 0){
    whiteLeftRookMoved = true;
}

if(piece === "R" && fromRow === 7 && fromCol === 7){
    whiteRightRookMoved = true;
}

if(piece === "r" && fromRow === 0 && fromCol === 0){
    blackLeftRookMoved = true;
}

if(piece === "r" && fromRow === 0 && fromCol === 7){
    blackRightRookMoved = true;
}

lastMove = {
    fromRow,
    fromCol,
    toRow,
    toCol,
    piece
};

}

function saveGame(){

    const saveData = {

        gameBoard,

        currentPlayer,

        moveHistory,

        whiteCaptured,

        blackCaptured,

        whiteTime,

        blackTime,

        gameMode,

        lastMove

    };

    localStorage.setItem(
        "savedGame",
        JSON.stringify(saveData)
    );
}

function undoMove(){

    if(gameStates.length === 0){

        alert("No moves to undo");

        return;
    }

    const previous =
        gameStates.pop();

    gameBoard =
        previous.gameBoard;

    currentPlayer =
        previous.currentPlayer;

    moveHistory =
        previous.moveHistory;

    whiteCaptured =
        previous.whiteCaptured;

    blackCaptured =
        previous.blackCaptured;

    whiteTime =
        previous.whiteTime;

    blackTime =
        previous.blackTime;

    lastMove =
        previous.lastMove;

    createBoard();

    updateHistory();

    updateCapturedPieces();

    updateClockDisplay();

    saveGame();

}
window.undoMove = undoMove;

window.startNewGame = startNewGame;
window.goHome = goHome;

function updateClockDisplay(){

    const whiteMin =
        Math.floor(whiteTime / 60);

    const whiteSec =
        whiteTime % 60;

    const blackMin =
        Math.floor(blackTime / 60);

    const blackSec =
        blackTime % 60;

    document.getElementById(
        "whiteClock"
    ).textContent =
        `${whiteMin}:${whiteSec
            .toString()
            .padStart(2,"0")}`;

    document.getElementById(
        "blackClock"
    ).textContent =
        `${blackMin}:${blackSec
            .toString()
            .padStart(2,"0")}`;
}

function startClock(){

    clearInterval(clockInterval);

    clockInterval = setInterval(() => {

        if(currentPlayer === "white"){

            whiteTime--;

            if(whiteTime <= 0){

                whiteTime = 0;

                updateClockDisplay();

                gameOver("⏱ Time Out! Black wins on time!");

                return;
            }

        }else{

            blackTime--;

            if(blackTime <= 0){

                blackTime = 0;

                updateClockDisplay();

                gameOver("⏱ Time Out! White wins on time!");

                return;
            }
        }

        updateClockDisplay();

    },1000);
}

function applyTheme(theme){

    const root =
        document.documentElement;

    switch(theme){

case "blue":

    root.style.setProperty("--light-square","#dee3e6");
    root.style.setProperty("--dark-square","#4a6fa5");
    root.style.setProperty("--panel-color","#1f2937");

    break;

case "green":

    root.style.setProperty("--light-square","#eeeed2");
    root.style.setProperty("--dark-square","#769656");
    root.style.setProperty("--panel-color","#1f2937");

    break;

case "dark":

    root.style.setProperty("--light-square","#666666");
    root.style.setProperty("--dark-square","#333333");
    root.style.setProperty("--panel-color","#111111");

    break;

default:

    root.style.setProperty("--light-square","#f0d9b5");
    root.style.setProperty("--dark-square","#b58863");
    root.style.setProperty("--panel-color","#222222");

    }

    localStorage.setItem(
        "theme",
        theme
    );
}

function applySavedSettings(){

    const savedTheme =
        localStorage.getItem("theme") || "classic";

    const savedVolume =
        parseFloat(
            localStorage.getItem("volume") ?? "1"
        );

    const isMuted =
        localStorage.getItem("mute") === "true";

    applyTheme(savedTheme);

    setSoundVolume(savedVolume, isMuted);

    const themeSelect =
        document.getElementById("themeSelect");

    if(themeSelect){
        themeSelect.value = savedTheme;
    }
}

function setSoundVolume(volume, muted){

    const finalVolume =
        muted ? 0 : volume;

    moveSound.volume = finalVolume;
    captureSound.volume = finalVolume;
    checkSound.volume = finalVolume;
    castleSound.volume = finalVolume;
    gameOverSound.volume = finalVolume;
}

function loadGame(){

    const saved =
        localStorage.getItem("savedGame");

    if(!saved){
        return false;
    }

    const data = JSON.parse(saved);

    gameBoard = data.gameBoard;
    currentPlayer = data.currentPlayer;
    gameMode = data.gameMode || "player";
    moveHistory = data.moveHistory || [];
    whiteCaptured = data.whiteCaptured || [];
    blackCaptured = data.blackCaptured || [];
    whiteTime = data.whiteTime || 600;
    blackTime = data.blackTime || 600;
    gameMode = data.gameMode || "player";
    lastMove = data.lastMove || null;

    createBoard();
    updateHistory();
    updateCapturedPieces();
    updateClockDisplay();

    return true;
}


function showGameOver(title,message){

    clearInterval(clockInterval);

    document.getElementById(
        "resultTitle"
    ).textContent = title;

    document.getElementById(
        "resultMessage"
    ).textContent = message;

    document.getElementById(
        "gameOverModal"
    ).style.display = "flex";
}

function gameOver(message){

    clearInterval(clockInterval);

    if(!matchAlreadySaved){
        saveGameToHistory(message);
        matchAlreadySaved = true;
    }

    showGameOver("Game Over", message);

    gameOverSound.play();
}

function startNewGame(){

    localStorage.removeItem("savedGame");
    localStorage.removeItem("chessSave");
    localStorage.removeItem("gameMode");

    window.location.href = "index.html";
}

function goHome(){

    window.location.href =
        "index.html";
}

function recordMove(
    piece,
    fromRow,
    fromCol,
    toRow,
    toCol
){

    const moveText =
        piece +
        " : " +
        String.fromCharCode(
            97 + fromCol
        ) +
        (8 - fromRow) +
        " → " +
        String.fromCharCode(
            97 + toCol
        ) +
        (8 - toRow);

    moveHistory.push(moveText);

    updateHistory();
}

function updateHistory(){

    const list =
        document.getElementById(
            "historyList"
        );

    list.innerHTML = "";

    moveHistory.forEach(move => {

        const li =
            document.createElement("li");

        li.textContent = move;

        list.appendChild(li);

    });

}

function updateCapturedPieces(){

    document.getElementById(
        "whiteCaptured"
    ).innerHTML =
    whiteCaptured
        .map(piece => pieces[piece])
        .join(" ");

    document.getElementById(
        "blackCaptured"
    ).innerHTML =
    blackCaptured
        .map(piece => pieces[piece])
        .join(" ");
}



    function checkPromotion(row,col){

    const piece = gameBoard[row][col];

    if(piece === "P" && row === 0){

        promotePawn(row,col,"white");

    }

    if(piece === "p" && row === 7){

        promotePawn(row,col,"black");

    }
}

function promotePawn(row,col,color){

    const choice = prompt(
        "Promote to: Q, R, B, N",
        "Q"
    );

    let piece = "Q";

    if(choice){

        const selected =
            choice.toUpperCase();

        if(
            ["Q","R","B","N"]
                .includes(selected)
        ){

            piece = selected;
        }
    }

    gameBoard[row][col] =
        color === "white"
        ? piece
        : piece.toLowerCase();

    createBoard();
}

    function highlightMoves(){

        const squares =
            document.querySelectorAll(".square");

        squares.forEach(square => {

            const row =
                parseInt(square.dataset.row);

            const col =
                parseInt(square.dataset.col);

            if(
                selectedSquare &&
                row === selectedSquare.row &&
                col === selectedSquare.col
            ){
                square.classList.add("selected");
            }

            legalMoves.forEach(move => {

                if(
                    move.row === row &&
                    move.col === col
                ){
                    square.classList.add("valid-move");
                }

            });

        });
    }

function getLegalMoves(row,col){

    const piece = gameBoard[row][col];

    if(!piece) return [];

    switch(piece.toLowerCase()){

        case "p":
            return getPawnMoves(row,col,piece);

        case "n":
            return getKnightMoves(row,col,piece);

        case "b":
            return getBishopMoves(row,col,piece);

        case "r":
            return getRookMoves(row,col,piece);

        case "q":
            return getQueenMoves(row,col,piece);

        case "k":
            return getKingMoves(row,col,piece);

        default:
            return [];
    }
}

    function isEnemy(piece,target){

    if(target === "") return false;

    return (
        piece === piece.toUpperCase()
        ? target === target.toLowerCase()
        : target === target.toUpperCase()
    );
}

function isFriend(piece,target){

    if(target === "") return false;

    return (
        piece === piece.toUpperCase()
        ? target === target.toUpperCase()
        : target === target.toLowerCase()
    );
}

function getSlidingMoves(row,col,piece,directions){

    const moves = [];

    directions.forEach(dir => {

        let r = row + dir[0];
        let c = col + dir[1];

        while(
            r >= 0 &&
            r < 8 &&
            c >= 0 &&
            c < 8
        ){

            const target = gameBoard[r][c];

            if(target === ""){

                moves.push({
                    row:r,
                    col:c
                });

            }else{

                if(isEnemy(piece,target)){

                    moves.push({
                        row:r,
                        col:c
                    });
                }

                break;
            }

            r += dir[0];
            c += dir[1];
        }
    });

    return moves;
}

function getPawnMoves(row,col,piece){

    const moves = [];

    const direction =
        piece === "P" ? -1 : 1;

    const startRow =
        piece === "P" ? 6 : 1;

    // Forward move

    if(
        gameBoard[row + direction]?.[col] === ""
    ){

        moves.push({
            row: row + direction,
            col
        });

        if(
            row === startRow &&
            gameBoard[row + direction*2]?.[col] === ""
        ){

            moves.push({
                row: row + direction*2,
                col
            });

        }
    }

    // Diagonal captures

    [-1,1].forEach(offset => {

        const target =
            gameBoard[row + direction]?.[col + offset];

        if(
            target &&
            isEnemy(piece,target)
        ){

            moves.push({
                row: row + direction,
                col: col + offset
            });

        }

    });

    // En Passant

if(lastMove){

    const enemyPawn =
        piece === "P"
        ? "p"
        : "P";

    const direction =
        piece === "P"
        ? -1
        : 1;

    if(

        lastMove.piece === enemyPawn &&

        Math.abs(
            lastMove.fromRow -
            lastMove.toRow
        ) === 2 &&

        lastMove.toRow === row &&

        Math.abs(
            lastMove.toCol -
            col
        ) === 1

    ){

        moves.push({
            row: row + direction,
            col: lastMove.toCol,
            enPassant: true
        });

    }

}

    return moves;
}

function getKnightMoves(row,col,piece){

    const moves = [];

    const offsets = [
        [-2,-1],
        [-2,1],
        [-1,-2],
        [-1,2],
        [1,-2],
        [1,2],
        [2,-1],
        [2,1]
    ];

    offsets.forEach(offset => {

        const r = row + offset[0];
        const c = col + offset[1];

        if(
            r < 0 ||
            r > 7 ||
            c < 0 ||
            c > 7
        ){
            return;
        }

        const target = gameBoard[r][c];

        if(
            target === "" ||
            isEnemy(piece,target)
        ){
            moves.push({
                row:r,
                col:c
            });
        }

    });

    return moves;
}

function getBishopMoves(row,col,piece){

    return getSlidingMoves(
        row,
        col,
        piece,
        [
            [1,1],
            [1,-1],
            [-1,1],
            [-1,-1]
        ]
    );
}

function getRookMoves(row,col,piece){

    return getSlidingMoves(
        row,
        col,
        piece,
        [
            [1,0],
            [-1,0],
            [0,1],
            [0,-1]
        ]
    );
}

function getQueenMoves(row,col,piece){

    return getSlidingMoves(
        row,
        col,
        piece,
        [
            [1,0],
            [-1,0],
            [0,1],
            [0,-1],
            [1,1],
            [1,-1],
            [-1,1],
            [-1,-1]
        ]
    );
}

function getKingMoves(row,col,piece){

    const moves = [];

    for(let r=-1;r<=1;r++){

        for(let c=-1;c<=1;c++){

            if(r===0 && c===0) continue;

            const nr=row+r;
            const nc=col+c;

            if(
                nr<0 ||
                nr>7 ||
                nc<0 ||
                nc>7
            ){
                continue;
            }

            const target = gameBoard[nr][nc];

            if(
                target === "" ||
                isEnemy(piece,target)
            ){
                moves.push({
                    row:nr,
                    col:nc
                });
            }
        }
    }

    // White kingside

if(
    piece === "K" &&
    !whiteKingMoved &&
    !whiteRightRookMoved &&
    gameBoard[7][5] === "" &&
    gameBoard[7][6] === ""
){

    moves.push({
        row:7,
        col:6
    });
}

// White queenside

if(
    piece === "K" &&
    !whiteKingMoved &&
    !whiteLeftRookMoved &&
    gameBoard[7][1] === "" &&
    gameBoard[7][2] === "" &&
    gameBoard[7][3] === ""
){

    moves.push({
        row:7,
        col:2
    });
}

// Black kingside

if(
    piece === "k" &&
    !blackKingMoved &&
    !blackRightRookMoved &&
    gameBoard[0][5] === "" &&
    gameBoard[0][6] === ""
){

    moves.push({
        row:0,
        col:6
    });
}

// Black queenside

if(
    piece === "k" &&
    !blackKingMoved &&
    !blackLeftRookMoved &&
    gameBoard[0][1] === "" &&
    gameBoard[0][2] === "" &&
    gameBoard[0][3] === ""
){

    moves.push({
        row:0,
        col:2
    });
}

    return moves;
}

//helpers functions

function findKing(color){

    const king =
        color === "white"
        ? "K"
        : "k";

    for(let row=0; row<8; row++){

        for(let col=0; col<8; col++){

            if(gameBoard[row][col] === king){

                return {
                    row,
                    col
                };
            }
        }
    }

    return null;
}

function isSquareUnderAttack(row,col,color){

    const enemyColor =
        color === "white"
        ? "black"
        : "white";

    for(let r=0; r<8; r++){

        for(let c=0; c<8; c++){

            const piece = gameBoard[r][c];

            if(piece === "") continue;

            const isEnemyPiece =
                enemyColor === "white"
                ? piece === piece.toUpperCase()
                : piece === piece.toLowerCase();

            if(!isEnemyPiece) continue;

            const moves =
                getLegalMoves(r,c);

            if(
                moves.some(
                    move =>
                        move.row === row &&
                        move.col === col
                )
            ){
                return true;
            }

        }
    }

    return false;
}

function isKingInCheck(color){

    const king =
        findKing(color);

    return isSquareUnderAttack(
        king.row,
        king.col,
        color
    );
}
function wouldLeaveKingInCheck(
    fromRow,
    fromCol,
    toRow,
    toCol
){

    const piece =
        gameBoard[fromRow][fromCol];

    const captured =
        gameBoard[toRow][toCol];

    // make temporary move

    gameBoard[toRow][toCol] = piece;

    gameBoard[fromRow][fromCol] = "";

    const color =
        piece === piece.toUpperCase()
        ? "white"
        : "black";

    const kingInCheck =
        isKingInCheck(color);

    // undo move

    gameBoard[fromRow][fromCol] = piece;

    gameBoard[toRow][toCol] = captured;

    return kingInCheck;
}
function getAllLegalMoves(color){

    const allMoves = [];

    for(let row=0; row<8; row++){

        for(let col=0; col<8; col++){

            const piece =
                gameBoard[row][col];

            if(piece === "") continue;

            const belongsToPlayer =
                color === "white"
                ? piece === piece.toUpperCase()
                : piece === piece.toLowerCase();

            if(!belongsToPlayer) continue;

            const moves =
                getLegalMoves(row,col);

            moves.forEach(move => {

                if(
                    !wouldLeaveKingInCheck(
                        row,
                        col,
                        move.row,
                        move.col
                    )
                ){

    allMoves.push({
    fromRow:row,
    fromCol:col,
    toRow:move.row,
    toCol:move.col
});

                }

            });

        }
    }

    return allMoves;
}
function isCheckmate(color){

    if(
        !isKingInCheck(color)
    ){
        return false;
    }

    const moves =
        getAllLegalMoves(color);

    return moves.length === 0;
}
function isStalemate(color){

    if(
        isKingInCheck(color)
    ){
        return false;
    }

    const moves =
        getAllLegalMoves(color);

    return moves.length === 0;
}

function makeAIMove(){

    console.log("AI STARTED");

    const allMoves = [];

    for(let row=0; row<8; row++){

        for(let col=0; col<8; col++){

            const piece =
                gameBoard[row][col];

            if(piece === "") continue;

            const isAI =
                aiColor === "white"
                ? piece === piece.toUpperCase()
                : piece === piece.toLowerCase();

            if(!isAI) continue;

            const moves =
                getLegalMoves(row,col)
                .filter(move =>
                    !wouldLeaveKingInCheck(
                        row,
                        col,
                        move.row,
                        move.col
                    )
                );

            moves.forEach(move => {

                const target =
    gameBoard[
        move.row
    ][
        move.col
    ];

let score = 0;

if(target !== ""){

    score =
        pieceValues[
            target
                .toLowerCase()
        ];

}

allMoves.push({

    fromRow:row,
    fromCol:col,

    toRow:move.row,
    toCol:move.col,

    score

});

            });

        }
    }

    if(allMoves.length === 0) return;

allMoves.sort(
    (a,b) =>
        b.score - a.score
);

const bestMoves =
    allMoves.filter(
        move =>
            move.score ===
            allMoves[0].score
    );

let bestMove = null;
let bestScore = -Infinity;

allMoves.forEach(move => {

    const captured =
        gameBoard[
            move.toRow
        ][
            move.toCol
        ];

    const piece =
        gameBoard[
            move.fromRow
        ][
            move.fromCol
        ];

    gameBoard[
        move.toRow
    ][
        move.toCol
    ] = piece;

    gameBoard[
        move.fromRow
    ][
        move.fromCol
    ] = "";

    const score =
        minimax(
            2,
            false
        );

    gameBoard[
        move.fromRow
    ][
        move.fromCol
    ] = piece;

    gameBoard[
        move.toRow
    ][
        move.toCol
    ] = captured;

    if(score > bestScore){

        bestScore = score;
        bestMove = move;
    }

});

movePiece(
    bestMove.fromRow,
    bestMove.fromCol,
    bestMove.toRow,
    bestMove.toCol
);

currentPlayer =
    currentPlayer === "white"
    ? "black"
    : "white";

if(isCheckmate(currentPlayer)){

    updateStats("loss");

    gameOver(
        "🏆 CHECKMATE! " +
        (
            currentPlayer === "white"
            ? "Black"
            : "White"
        ) +
        " Wins!"
    );

    return;
}

if(isStalemate(currentPlayer)){

    updateStats("draw");

    gameOver(
        "🤝 Stalemate!"
    );

    return;
}

if(isKingInCheck(currentPlayer)){

    checkSound.play();

    document.getElementById(
        "turnDisplay"
    ).textContent =
        currentPlayer +
        " KING IS IN CHECK!";
}

createBoard();
}
function evaluateBoard(){

    const values = {

        p:1,
        n:3,
        b:3,
        r:5,
        q:9,
        k:100

    };

    let score = 0;

    for(let row=0; row<8; row++){

        for(let col=0; col<8; col++){

            const piece =
                gameBoard[row][col];

            if(piece === "") continue;

            const value =
                values[
                    piece.toLowerCase()
                ];

            if(piece === piece.toLowerCase()){

                score += value;

            }else{

                score -= value;

            }
        }
    }

    return score;
}
function getAllMoves(color){

    const moves = [];

    for(let row=0; row<8; row++){

        for(let col=0; col<8; col++){

            const piece =
                gameBoard[row][col];

            if(piece === "") continue;

            const belongsToColor =
                color === "white"
                ? piece === piece.toUpperCase()
                : piece === piece.toLowerCase();

            if(!belongsToColor) continue;

            getLegalMoves(row,col)
            .forEach(move => {

                if(
                    !wouldLeaveKingInCheck(
                        row,
                        col,
                        move.row,
                        move.col
                    )
                ){

                    moves.push({

                        fromRow:row,
                        fromCol:col,

                        toRow:move.row,
                        toCol:move.col

                    });

                }

            });

        }
    }

    return moves;
}
function minimax(depth,isMaximizing){

    if(depth === 0){

        return evaluateBoard();

    }

    const color =
        isMaximizing
        ? "black"
        : "white";

    const moves =
        getAllMoves(color);

    if(isMaximizing){

        let best = -Infinity;

        moves.forEach(move => {

            const captured =
                gameBoard[
                    move.toRow
                ][
                    move.toCol
                ];

            const piece =
                gameBoard[
                    move.fromRow
                ][
                    move.fromCol
                ];

            gameBoard[
                move.toRow
            ][
                move.toCol
            ] = piece;

            gameBoard[
                move.fromRow
            ][
                move.fromCol
            ] = "";

            best = Math.max(
                best,
                minimax(
                    depth-1,
                    false
                )
            );

            gameBoard[
                move.fromRow
            ][
                move.fromCol
            ] = piece;

            gameBoard[
                move.toRow
            ][
                move.toCol
            ] = captured;

        });

        return best;

    }else{

        let best = Infinity;

        moves.forEach(move => {

            const captured =
                gameBoard[
                    move.toRow
                ][
                    move.toCol
                ];

            const piece =
                gameBoard[
                    move.fromRow
                ][
                    move.fromCol
                ];

            gameBoard[
                move.toRow
            ][
                move.toCol
            ] = piece;

            gameBoard[
                move.fromRow
            ][
                move.fromCol
            ] = "";

            best = Math.min(
                best,
                minimax(
                    depth-1,
                    true
                )
            );

            gameBoard[
                move.fromRow
            ][
                move.fromCol
            ] = piece;

            gameBoard[
                move.toRow
            ][
                move.toCol
            ] = captured;

        });

        return best;
    }
}
const pieceValues = {

    p:1,
    n:3,
    b:3,
    r:5,
    q:9,
    k:100

};

function triggerAIIfNeeded(){

    console.log(
        "Mode:",
        gameMode,
        "Player:",
        currentPlayer,
        "AI:",
        aiColor
    );

    if(gameMode !== "ai") return;

    if(currentPlayer !== aiColor) return;

    setTimeout(() => {

        makeAIMove();

    },500);
}

function updateStats(result){

    let stats =
        JSON.parse(
            localStorage.getItem("stats")
        ) || {

            gamesPlayed:0,
            wins:0,
            losses:0,
            draws:0

        };

    stats.gamesPlayed++;

    if(result === "win")
        stats.wins++;

    if(result === "loss")
        stats.losses++;

    if(result === "draw")
        stats.draws++;

    localStorage.setItem(
        "stats",
        JSON.stringify(stats)
    );

}

function saveGameToHistory(resultText){

    let history =
        JSON.parse(
            localStorage.getItem("gameHistory")
        ) || [];

    const historyEntry = {

        result: resultText,

        winner:
            resultText.includes("Black Wins")
            ? "Black"
            : resultText.includes("White Wins")
            ? "White"
            : "Draw",

        mode:
            gameMode === "ai"
            ? "AI Match"
            : "Local Match",

        movesPlayed:
            moveHistory.length,

        date:
            new Date().toLocaleString()

    };

    history.unshift(historyEntry);

    localStorage.setItem(
        "gameHistory",
        JSON.stringify(history)
    );
}

//handlers and initialization


const loaded =
    loadGame();

if(loaded){

    triggerAIIfNeeded();

}

if(!loaded){

    createBoard();

}

if(!loaded){

    gameMode =
        localStorage.getItem("gameMode")
        || "player";

}

updateClockDisplay();

startClock();

const selector =
    document.getElementById(
        "themeSelect"
    );

selector.addEventListener("change", e => {

    const selectedTheme = e.target.value;

    applyTheme(selectedTheme);

    localStorage.setItem(
        "theme",
        selectedTheme
    );

});

applySavedSettings();


    if(!loaded){

    createBoard();
    matchAlreadySaved = false;

}

});