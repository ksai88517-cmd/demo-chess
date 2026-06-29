document.addEventListener("DOMContentLoaded", () => {

    document.getElementById("pieceTheme").value =
    localStorage.getItem("pieceTheme") || "classic";

    const themeSelect =
        document.getElementById("themeSetting");

    const volumeSlider =
        document.getElementById("volumeSlider");

    const volumeValue =
        document.getElementById("volumeValue");

    const muteToggle =
        document.getElementById("muteToggle");

    const saveBtn =
        document.getElementById("saveSettingsBtn");

    // Load saved settings
    const savedTheme =
        localStorage.getItem("theme") || "classic";

    const savedVolume =
        localStorage.getItem("volume") ?? "1";

    const savedMute =
        localStorage.getItem("mute") === "true";

    const savedSiteTheme =
        localStorage.getItem("siteTheme") || "dark";

    const siteTheme =
        document.getElementById("siteTheme");

        const pieceTheme =
    document.getElementById("pieceTheme");

    siteTheme.addEventListener("change", () => {

    localStorage.setItem(
        "siteTheme",
        siteTheme.value
    );

    applySiteTheme();

});

    themeSelect.addEventListener("change", () => {

    localStorage.setItem(
        "theme",
        themeSelect.value
    );

    pieceTheme.addEventListener("change", () => {

    localStorage.setItem(
        "pieceTheme",
        pieceTheme.value
    );

});

});

    themeSelect.value = savedTheme;
    volumeSlider.value = savedVolume;
    muteToggle.checked = savedMute;
    siteTheme.value = savedSiteTheme;
    pieceTheme.value =
    localStorage.getItem("pieceTheme") || "classic";

    updateVolumeLabel(savedVolume);

    volumeSlider.addEventListener("input", () => {

    updateVolumeLabel(volumeSlider.value);

    localStorage.setItem(
        "volume",
        volumeSlider.value
    );

});

muteToggle.addEventListener("change", () => {

    localStorage.setItem(
        "mute",
        muteToggle.checked
    );

});

    function updateVolumeLabel(value){
        volumeValue.textContent =
            Math.round(value * 100) + "%";
    }

});