const openButton = document.getElementById("OpenButton");
openButton.addEventListener("click",OpenNavBar);
const bar = document.getElementById("bar");
const main = document.getElementById("main");

const homeButton = document.getElementById("HomeButton");
homeButton.addEventListener("click", () =>{
    location.replace("index.html");
});

const characterButton = document.getElementById("CharacterButton");
characterButton.addEventListener("click", () =>{
    location.replace("characterViewing.html");
});

const creatorButton = document.getElementById("CreatorButton");
creatorButton.addEventListener("click", () =>{
    location.replace("characterMaking.html");
});

function OpenNavBar(){
    if(bar.className == "notVisible"){
        bar.className = "visible";
        main.className = "mainNavBarOpen";
        openButton.className = "navOpenButton";
    }
    else{
        bar.className = "notVisible";
        openButton.className = "navCloseButton";
        main.className = "";
    }
}