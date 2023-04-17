const homeButton = document.getElementById("HomeButton");
homeButton.addEventListener("click", () => {
    location.replace("index.html");
});

const characterButton = document.getElementById("CharacterButton");
characterButton.addEventListener("click", () => {
    location.replace("characterViewing.html");
});

const creatorButton = document.getElementById("CreatorButton");
creatorButton.addEventListener("click", () => {
    location.replace("characterMaking.html");
});

/*

// This script was removed due to it being navigation that was unneeded and could confuse the user. I was just too proud of it to delete it.


const openButton = document.getElementById("OpenButton");
openButton.addEventListener("click", OpenNavBar);
const bar = document.getElementById("bar");
const main = document.getElementById("main");

const homeBarButton = document.getElementById("HomeBarButton");
homeBarButton.addEventListener("click", () => {
    location.replace("index.html");
});

const characterBarButton = document.getElementById("CharacterBarButton");
characterBarButton.addEventListener("click", () => {
    location.replace("characterViewing.html");
});

const creatorBarButton = document.getElementById("CreatorBarButton");
creatorBarButton.addEventListener("click", () => {
    location.replace("characterMaking.html");
});

function OpenNavBar() {
    if (bar.className == "notVisible") {
        bar.className = "visible";
        main.className = "mainNavBarOpen";
        openButton.className = "navOpenButton";
    }
    else {
        bar.className = "notVisible";
        openButton.className = "navCloseButton";
        main.className = "";
    }
}*/