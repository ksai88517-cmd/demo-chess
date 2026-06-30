document.addEventListener("DOMContentLoaded", () => {

    const container = document.getElementById("achievementContainer");
    const countEl = document.getElementById("achievementCount");
    const percentEl = document.getElementById("achievementPercent");
    const resetBtn = document.getElementById("resetAchievementsBtn");

    // Only run UI logic on the Achievements page when DOM elements exist
    if(!container) return;

    renderAchievements();

    if(resetBtn){
        resetBtn.addEventListener("click", resetAchievements);
    }

    // When manager notifies of newly unlocked achievement, show alert and refresh
    document.addEventListener("achievementUnlocked", e => {
        const a = e.detail;
        if(a){
            alert("🏆 Achievement Unlocked!\n\n" + a.title);
            renderAchievements();
        }
    });

});

// Renders achievement cards using data from achievementManager.js
function renderAchievements(){

    const achievements = typeof getAchievements === "function" ? getAchievements() : [];

    const container = document.getElementById("achievementContainer");

    if(!container) return;

    container.innerHTML = "";

    let unlockedCount = 0;

    achievements.forEach(a => {

        if(a.unlocked){
            unlockedCount++;
        }

        container.innerHTML += `

        <div class="achievement ${a.unlocked ? "unlocked" : "locked"}">

            <div class="achievement-icon">

                ${a.icon}

            </div>

            <div class="achievement-info">

                <div class="achievement-title">

                    ${a.title}

                </div>

                <div class="achievement-desc">

                    ${a.description}

                </div>

            </div>

            <div class="achievement-status">

                ${a.unlocked ? "✅ Unlocked" : "🔒 Locked"}

            </div>

        </div>

        `;

    });

    const countEl = document.getElementById("achievementCount");
    const percentEl = document.getElementById("achievementPercent");

    if(countEl) countEl.textContent = `${unlockedCount} / ${achievements.length}`;

    if(percentEl){
        const percent = Math.round(unlockedCount / achievements.length * 100);
        percentEl.textContent = percent + "%";
    }

}

function resetAchievements(){

    if(!confirm("Reset all achievements?")) return;

    if(typeof getAchievements !== "function" || typeof saveAchievements !== "function") return;

    const achievements = getAchievements();
    achievements.forEach(a => a.unlocked = false);
    saveAchievements(achievements);
    renderAchievements();

    alert("Achievements have been reset.");

}
