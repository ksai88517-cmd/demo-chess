function login(){

    alert("Login Page Coming Soon");

}

function newLocalGame(){

    localStorage.removeItem("savedGame");

    localStorage.setItem(
        "gameMode",
        "player"
    );

    window.location.href =
        "game.html";
}

function newAIGame(){

    localStorage.removeItem("savedGame");

    localStorage.setItem(
        "gameMode",
        "ai"
    );

    window.location.href =
        "game.html";
}

function continueGame(){

    const savedGame =
        localStorage.getItem(
            "savedGame"
        );

    if(!savedGame){

        alert(
            "No saved game found."
        );

        return;
    }

    window.location.href =
        "game.html";
}

function openScoreboard(){

    window.location.href =
        "scoreboard.html";
}

function openSettings(){

    window.location.href =
        "settings.html";
}

function historyPage(){

    window.location.href =
        "history.html";
}

function scoreboard(){

    alert("Scoreboard Coming Soon");

}
function closeModal(){

    document.getElementById("colorModal").style.display="none";

}

function startGame(color){

    localStorage.setItem("playerColor",color);

    window.location.href="game.html";

}