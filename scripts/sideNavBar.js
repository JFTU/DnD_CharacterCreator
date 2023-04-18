//Refernce to the home button in the nav bar
const homeButton = document.getElementById("HomeButton");
homeButton.addEventListener("click", () => {
    location.replace("index.html");
});

//Refernce to the character viewer button in the nav bar
const characterButton = document.getElementById("CharacterButton");
characterButton.addEventListener("click", () => {
    location.replace("characterViewing.html");
});

//Refernce to the character creator button in the nav bar
const creatorButton = document.getElementById("CreatorButton");
creatorButton.addEventListener("click", () => {
    location.replace("characterMaking.html");
});