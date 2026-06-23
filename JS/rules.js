
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

    return moves;
}

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