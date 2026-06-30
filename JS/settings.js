document.addEventListener("DOMContentLoaded", () => {

    // =========================
    // Elements
    // =========================

    const siteTheme =
        document.getElementById("siteTheme");

    const themeSelect =
        document.getElementById("themeSetting");

    const pieceTheme =
        document.getElementById("pieceTheme");

    const volumeSlider =
        document.getElementById("volumeSlider");

    const volumeValue =
        document.getElementById("volumeValue");

    const muteToggle =
        document.getElementById("muteToggle");


    // =========================
    // Load Saved Settings
    // =========================

    const savedSiteTheme =
        localStorage.getItem("siteTheme") || "dark";

    const savedBoardTheme =
        localStorage.getItem("theme") || "classic";

    const savedPieceTheme =
        localStorage.getItem("pieceTheme") || "classic";

    const savedVolume =
        localStorage.getItem("volume") ?? "1";

    const savedMute =
        localStorage.getItem("mute") === "true";


    // =========================
    // Apply Saved Values
    // =========================

    siteTheme.value = savedSiteTheme;

    themeSelect.value = savedBoardTheme;

    pieceTheme.value = savedPieceTheme;

    volumeSlider.value = savedVolume;

    muteToggle.checked = savedMute;

    updateVolumeLabel(savedVolume);


    // =========================
    // Site Theme
    // =========================

    siteTheme.addEventListener("change", () => {

        localStorage.setItem(
            "siteTheme",
            siteTheme.value
        );

        applySiteTheme();

    });


    // =========================
    // Board Theme
    // =========================

    themeSelect.addEventListener("change", () => {

        localStorage.setItem(
            "theme",
            themeSelect.value
        );

    });


    // =========================
    // Piece Theme
    // =========================

    pieceTheme.addEventListener("change", () => {

        localStorage.setItem(
            "pieceTheme",
            pieceTheme.value
        );

    });


    // =========================
    // Volume
    // =========================

    volumeSlider.addEventListener("input", () => {

        updateVolumeLabel(
            volumeSlider.value
        );

        localStorage.setItem(
            "volume",
            volumeSlider.value
        );

    });


    // =========================
    // Mute
    // =========================

    muteToggle.addEventListener("change", () => {

        localStorage.setItem(
            "mute",
            muteToggle.checked
        );

    });


    // =========================
    // Helpers
    // =========================

    function updateVolumeLabel(value){

        volumeValue.textContent =
            Math.round(value * 100) + "%";

    }

});