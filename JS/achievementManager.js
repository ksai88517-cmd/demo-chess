// Achievement Manager: contains achievement data and storage logic
// This file MUST NOT touch the DOM. Safe to include on any page.

const defaultAchievements = [
    { id: "first_game", icon: "♟", title: "First Steps", description: "Play your first game.", unlocked: false },
    { id: "first_win", icon: "🏆", title: "Winner", description: "Win your first game.", unlocked: false },
    { id: "first_ai_win", icon: "🤖", title: "Machine Slayer", description: "Defeat the AI.", unlocked: false },
    { id: "castle", icon: "🏰", title: "Castle Master", description: "Castle for the first time.", unlocked: false },
    { id: "promotion", icon: "👑", title: "Royal Promotion", description: "Promote a pawn.", unlocked: false },
    { id: "en_passant", icon: "👻", title: "Sneaky Move", description: "Perform an En Passant capture.", unlocked: false },
    { id: "checkmate", icon: "♚", title: "Checkmate!", description: "Deliver your first checkmate.", unlocked: false },
    { id: "draw", icon: "🤝", title: "Peace Treaty", description: "Finish a game in a draw.", unlocked: false },
    { id: "speed", icon: "⚡", title: "Speed Demon", description: "Win with more than 5 minutes remaining.", unlocked: false },
    { id: "hundred_games", icon: "💯", title: "Veteran", description: "Play 100 games.", unlocked: false }
];

function ensureAchievementsInitialized(){
    if(!localStorage.getItem("achievements")){
        localStorage.setItem("achievements", JSON.stringify(defaultAchievements));
    }
}

function getAchievements(){
    ensureAchievementsInitialized();
    return JSON.parse(localStorage.getItem("achievements"));
}

function saveAchievements(data){
    localStorage.setItem("achievements", JSON.stringify(data));
}

function unlockAchievement(id){
    const achievements = getAchievements();
    const ach = achievements.find(a => a.id === id);
    if(ach && !ach.unlocked){
        ach.unlocked = true;
        saveAchievements(achievements);
        // notify listeners (UI) that an achievement unlocked
        try{
            document.dispatchEvent(new CustomEvent("achievementUnlocked", { detail: ach }));
        }catch(e){
            // if document isn't available yet, ignore
        }
    }
}

function checkAchievements(event){
    // safe to call from anywhere; uses localStorage and unlockAchievement
    const stats = JSON.parse(localStorage.getItem("stats")) || { gamesPlayed:0, wins:0, losses:0, draws:0 };

    switch(event){
        case "firstGame":
            if(stats.gamesPlayed === 1) unlockAchievement("first_game");
            break;

        case "firstWin":
            if(stats.wins === 1) unlockAchievement("first_win");
            break;

        case "aiWin":
            unlockAchievement("first_ai_win");
            break;

        case "castle":
            unlockAchievement("castle");
            break;

        case "promotion":
            unlockAchievement("promotion");
            break;

        case "enPassant":
            unlockAchievement("en_passant");
            break;

        case "checkmate":
            unlockAchievement("checkmate");
            break;

        case "draw":
            unlockAchievement("draw");
            break;

        case "speed":
            // Caller should check winner's time; this is a fallback to grant if any side > 300
            const wt = parseInt(localStorage.getItem("whiteTime")) || 0;
            const bt = parseInt(localStorage.getItem("blackTime")) || 0;
            if(wt > 300 || bt > 300) unlockAchievement("speed");
            break;

        case "hundredGames":
            if(stats.gamesPlayed >= 100) unlockAchievement("hundred_games");
            break;

        default:
            // unknown event
    }
}

// initialize storage on load
ensureAchievementsInitialized();

// expose API globally
window.getAchievements = getAchievements;
window.saveAchievements = saveAchievements;
window.unlockAchievement = unlockAchievement;
window.checkAchievements = checkAchievements;
