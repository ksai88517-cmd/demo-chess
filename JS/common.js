function goBack(){

    if(window.history.length > 1){

        window.history.back();

    }else{

        window.location.href =
        "index.html";

    }

}

function applySiteTheme(){

    const theme =
    localStorage.getItem("siteTheme")
    || "dark";

    document.body.classList.remove(
        "light-mode",
        "dark-mode"
    );

    document.body.classList.add(
        theme + "-mode"
    );

}

document.addEventListener(
    "DOMContentLoaded",
    applySiteTheme
);

window.addEventListener("storage", () => {

    applySiteTheme();

});