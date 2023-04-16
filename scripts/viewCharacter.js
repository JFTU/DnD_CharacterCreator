let currentCharacter;
let currentlySelected;
let currentSection;

const localStorage = window.localStorage;
let data = JSON.parse(localStorage.getItem("test"));
const characterSelect = document.getElementById("CharacterSelect");
const nameText = document.getElementById("CharacterName");
const statsButton = document.getElementById("StatsButton");
const backgroundButton = document.getElementById("BackgroundButton");
const spellsButton = document.getElementById("SpellsButton");
const classText = document.getElementById("ClassText");
const subClassText = document.getElementById("SubClassText");
const raceText = document.getElementById("RaceText");
const subRaceText = document.getElementById("SubRaceText");
const statsSection = document.getElementById("StatsSection");
const backgroundSection = document.getElementById("BackgroundSection");
const spellsSection = document.getElementById("SpellsSection");
const scoreText = document.getElementById("ScoreText");
const proficiencyTable = document.getElementById("ProficiencyTable");
const backgroundText = document.getElementById("BackgroundText");
const flawText = document.getElementById("FlawText");
const idealText = document.getElementById("IdealsText");
const traitText = document.getElementById("TraitText");

statsButton.addEventListener("click", () => {
    ChangeSelection(statsButton, statsSection);
});

backgroundButton.addEventListener("click", () => {
    ChangeSelection(backgroundButton, backgroundSection);
});

spellsButton.addEventListener("click", () => {
    ChangeSelection(spellsButton, spellsSection);
});

currentlySelected = statsButton;
currentSection = statsSection;

if (data.length > 0) {
    characterSelect.innerHTML = "";
    character = data[0];
    for (character of data) {
        characterSelect.innerHTML += '<label for="' + data.name + '">Option for ' + data.name + '</label> <option id="' + data.name + '" value="' + data.name + '">' + data.name + '</option>';
    }
    SetUp();
}
else if(data != null){
    currentCharacter = data;
    SetUp();
}

function SetUp(){
    scoreText.innerHTML = '';
    classText.innerText = '';
    raceText.innerHTML = '';
    proficiencyTable.innerHTML = '<tr><th>Proficiency</th><th>Modifier</th></tr>';
    backgroundText.innerText = '';
    flawText.innerText = '';
    for (let score of currentCharacter.abScores){
        scoreText.innerHTML += '<section class="Scores"><h3>'+score.modifier+'</h3> <p>' + score.score + '</p> <p>' + score.name + '</p></section>';
    }
    classText.innerText += 'Class: ' + currentCharacter.charClass.name +' Subclass: '+ currentCharacter.subClass.name;
    raceText.innerText += 'Class: ' +currentCharacter.race.name + ' Subrace: ' + currentCharacter.subRace.name;

    for (let prof of currentCharacter.skills){
        proficiencyTable.innerHTML += '<tr><td>' + prof.name + '</td><td class="SkillModifier">' + prof.modifier + '</td></tr>';
    }

    backgroundText.innerText += currentCharacter.background.name;
    flawText.innerText += "Flaw: " + currentCharacter.flaw;
    idealText.innerText += "Ideal: " + currentCharacter.ideal;
    traitText.innerText += "Trait: " + currentCharacter.trait;
}

function ChangeSelection(newSelection, targetSection) {
    if (currentlySelected != newSelection) {
        currentlySelected.className = "";
        currentSection.className = "notVisible";
        newSelection.className = "Selected";
        currentlySelected = newSelection;
        currentSection = targetSection;
        targetSection.className = "visible Screen";
    }
}