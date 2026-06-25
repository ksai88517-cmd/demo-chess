document.addEventListener("DOMContentLoaded", () => {

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

    themeSelect.value = savedTheme;
    volumeSlider.value = savedVolume;
    muteToggle.checked = savedMute;

    updateVolumeLabel(savedVolume);

    volumeSlider.addEventListener("input", () => {
        updateVolumeLabel(volumeSlider.value);
    });

    saveBtn.addEventListener("click", () => {

        localStorage.setItem(
            "theme",
            themeSelect.value
        );

        localStorage.setItem(
            "volume",
            volumeSlider.value
        );

        localStorage.setItem(
            "mute",
            muteToggle.checked
        );

        alert("Settings saved successfully!");
    });

    function updateVolumeLabel(value){
        volumeValue.textContent =
            Math.round(value * 100) + "%";
    }

});