document.addEventListener("DOMContentLoaded", () => {

    const historyContainer =
        document.getElementById("historyContainer");

    const clearBtn =
        document.getElementById("clearHistoryBtn");

    let history =
        JSON.parse(
            localStorage.getItem("gameHistory")
        ) || [];

    renderHistory();

    clearBtn.addEventListener("click", () => {

        const confirmClear =
            confirm("Clear all game history?");

        if(!confirmClear) return;

        localStorage.removeItem("gameHistory");

        history = [];

        renderHistory();
    });

    function renderHistory(){

        if(history.length === 0){

            historyContainer.innerHTML = `
                <p>No games played yet.</p>
            `;
            return;
        }

        historyContainer.innerHTML =
            history.map((game,index) => `

                <div class="history-item">
                    <div class="history-top">
                        <span class="history-number">
                            Game #${history.length - index}
                        </span>

                        <span class="history-result">
                            ${game.result}
                        </span>
                    </div>

                    <div class="history-details">
                        <p><strong>Winner:</strong> ${game.winner}</p>
                        <p><strong>Mode:</strong> ${game.mode}</p>
                        <p><strong>Moves Played:</strong> ${game.movesPlayed}</p>
                        <p><strong>Date:</strong> ${game.date}</p>
                    </div>
                </div>

            `).join("");
    }

});