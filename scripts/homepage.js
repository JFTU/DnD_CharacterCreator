//Reference to the extra button that takes the user to the character creation screen
const createCharacterButton = document.getElementById("CreateCharacterButton");

//Adds event to take the user to the character creation page
createCharacterButton.addEventListener("click", () => {
    location.replace("characterMaking.html");
});