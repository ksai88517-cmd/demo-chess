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
