//Reference to the local storage
const localStorage = window.localStorage;

//Reference to the button that takes the user to the character creation scren if no characters are found
const noDataButton = document.getElementById("NoDataCharacterButton");

//Reference to the no data section
const noDataSection = document.getElementById("NoData");

//Reference to the data section
const dataSection = document.getElementById("Data");

//Reference to the character selecton box
const characterSelect = document.getElementById("CharacterSelect");

//Reference to the character name text
const nameText = document.getElementById("CharacterName");

//Reference to the stats tab button
const statsButton = document.getElementById("StatsButton");

//Reference to the background tab button
const backgroundButton = document.getElementById("BackgroundButton");

//Reference to the spells tab button
const spellsButton = document.getElementById("SpellsButton");

//Reference to the all tab button
const allButton = document.getElementById("AllButton");

//Reference to the class name text
const classText = document.getElementById("ClassText");

//Reference to the class description text
const classDesc = document.getElementById("ClassDescription");

//Reference to the subclass name text
const subClassText = document.getElementById("SubClassText");

//Reference to the subclass description text
const subClassDesc = document.getElementById("SubClassDescription");

//Reference to the race name text
const raceText = document.getElementById("RaceText");

//Reference to the race description text
const raceDesc = document.getElementById("RaceDescription");

//Reference to the subrace name text
const subRaceText = document.getElementById("SubRaceText");

//Reference to the stats section
const statsSection = document.getElementById("StatsSection");

//Reference to the background section
const backgroundSection = document.getElementById("BackgroundSection");

//Reference to the spells section
const spellsSection = document.getElementById("SpellsSection");

//Reference to the ability score text
const scoreText = document.getElementById("ScoreText");

//Reference to the proficiency table
const proficiencyTable = document.getElementById("ProficiencyTable");

//Reference to the background name text
const backgroundText = document.getElementById("BackgroundText");

//Reference to the background description text
const backgroundDesc = document.getElementById("BackgroundDescription");

//Reference to the flaw text
const flawText = document.getElementById("FlawText");

//Reference to the ideal text
const idealText = document.getElementById("IdealsText");

//Reference to the trait text
const traitText = document.getElementById("TraitText");

//Refernce to the delete section button
const deleteButton = document.getElementById("DeleteButton");

//Refernce to the delete section
const deleteSection = document.getElementById("DeleteSection");

//Reference to the delete character button
const deleteCharacter = document.getElementById("Delete");

//Reference to the cancel delete button
const cancelDelete = document.getElementById("Cancel");

//Reference to the bottom stats tab button
const bottomStatsButton = document.getElementById("BottomStatsButton");

//Reference to the bottom background tab button
const bottomBackgroundButton = document.getElementById("BottomBackgroundButton");

//Reference to the bottom spells tab button
const bottomSpellsButton = document.getElementById("BottomSpellsButton");

//Reference to the bottom all tab button
const bottomAllButton = document.getElementById("BottomAllButton");

//Reference to the bottom delete tab button
const bottomDeleteButton = document.getElementById("BottomDeleteButton");

//Reference to the current loaded character
let currentCharacter;

//Reference to the storage data
let data = JSON.parse(localStorage.getItem("DnDCharacterList"));

characterSelect.addEventListener("change", ChangeCharacter);

noDataButton.addEventListener("click", () => { location.replace("characterMaking.html"); });

statsButton.addEventListener("click", () => {
    ChangeSelection(statsButton, bottomStatsButton, statsSection);
});

backgroundButton.addEventListener("click", () => {
    ChangeSelection(backgroundButton, bottomBackgroundButton, backgroundSection);
});

spellsButton.addEventListener("click", () => {
    ChangeSelection(spellsButton, bottomSpellsButton, spellsSection);
});

allButton.addEventListener("click", AllButton);

deleteButton.addEventListener("click", () => {
    deleteSection.className = "visible Screen";
});

bottomStatsButton.addEventListener("click", () => {
    ChangeSelection(statsButton, bottomStatsButton, statsSection);
});

bottomBackgroundButton.addEventListener("click", () => {
    ChangeSelection(backgroundButton, bottomBackgroundButton, backgroundSection);
});

bottomSpellsButton.addEventListener("click", () => {
    ChangeSelection(spellsButton, bottomSpellsButton, spellsSection);
});

bottomAllButton.addEventListener("click", AllButton);

bottomDeleteButton.addEventListener("click", () => {
    deleteSection.className = "visible Screen";
});

deleteCharacter.addEventListener("click", () => {
    data.pop(currentCharacter);
    let toStore = JSON.stringify(data);
    localStorage.setItem("DnDCharacterList", toStore);
    SetUp();
});

cancelDelete.addEventListener("click", () => {
    deleteSection.className = "notVisible";
});

//Displays all sections of the character other than delete
function AllButton() {
    //Sets all the other buttons classes to blank
    statsButton.className = '';
    bottomStatsButton.className = '';

    backgroundButton.className = '';
    bottomBackgroundButton.className = '';
    if (spellsButton.className != "notVisible") {
        spellsButton.className = '';
        bottomSpellsButton.className = '';
    }
    //Sets the all button class to selected
    allButton.className = "Selected";
    //Displays all screens
    statsSection.className = "visible Screen";
    backgroundSection.className = "visible Screen";
    if (spellsButton.className != "notVisible") {
        spellsSection.className = "visible Screen";
    }
}



//Sets up a loaded character
function SetUp() {

    //Sets character name text
    nameText.innerText = currentCharacter.name;

    //Resets character values
    scoreText.innerHTML = '';
    classText.innerText = '';
    raceText.innerHTML = '';
    proficiencyTable.innerHTML = '<tr><th>Proficiency</th><th>Modifier</th></tr>';

    //Sets the ability score text for each ability score
    for (let score of currentCharacter.abScores) {
        scoreText.innerHTML += '<div class="Scores"><p>Mod: ' + score.modifier + '</p> <p>Val: ' + score.score + '</p> <p>' + score.name + '</p></div>';
    }
    //Sets the class and subclass name text
    classText.innerText += 'Class: ' + currentCharacter.charClass.name + ' Subclass: ' + currentCharacter.subClass.name;
    classDesc.innerHTML = "";
    //Iterates through the class features and displays them
    for (let feature of currentCharacter.charClassFeatures) {
        classDesc.innerHTML += '<p>' + feature.name + '</p>';

        //Converts the feature text to a string then splits it up into sentences
        let featureText = String(feature.desc);
        const featureDesc = featureText.split('.');
        //Iterates through all the sentences removing any unneeded characters 
        for (let sentence of featureDesc) {
            if (sentence != '') {
                if (sentence[0] == ",") {
                    sentence = sentence.slice(1, sentence.length);
                }
                sentence = sentence.replace("-", "");
                classDesc.innerHTML += '<p>' + sentence + '</p><div class="dividerLine"></div>';
            }
        }
    }

    //Sets the race and sub race text
    if (currentCharacter.subRace != null) {
        raceText.innerText = 'Race: ' + currentCharacter.race.name + ' Subrace: ' + currentCharacter.subRace.name;
    }
    else {
        raceText.innerText = 'Race: ' + currentCharacter.race.name;
    }

    //Sets the description of the chracters race
    raceDesc.innerHTML = '<p>' + currentCharacter.race.alignment + '</p><div class="dividerLine"></div><p>' + currentCharacter.race.size_description + '</p>';
    proficiencyTable.innerHTML = "";
    for (let prof of currentCharacter.skills) {
        proficiencyTable.innerHTML += '<tr><td>' + prof.name + '</td><td class="SkillModifier">' + prof.modifier + '</td></tr>';
    }

    //Sets the background name text
    backgroundText.innerText = currentCharacter.background.name;

    //Sets the background feature text
    backgroundDesc.innerText = currentCharacter.background.feature.desc[0];

    //Sets the flaw text
    flawText.innerText = "Flaw: " + currentCharacter.flaw;

    //Sets the flaw text
    idealText.innerText = "Ideal: " + currentCharacter.ideal;
    //Sets the flaw text
    traitText.innerText = "Trait: " + currentCharacter.trait;

    spellsSection.innerHTML = "";
    //Checks if the character has spells
    if (currentCharacter.spells.length != 0) {
        //If the character has spells the spell tab button becomes visible
        spellsButton.className = "visible";
        bottomSpellsButton.className = "visible";

        //Iterates through the spells displaying both their name and description
        for (let spellData of currentCharacter.spells) {
            spellsSection.innerHTML += '<section id="' + spellData.index + '"class="Screen">';
            document.getElementById(spellData.index).innerHTML += '<p>' + spellData.name + '</p><p>' + spellData.desc + '</p>';
        }
    }
    else {
        //Sets the spells to not visible
        spellsButton.className = "notVisible";
        bottomSpellsButton.className = "notVisible";
    }
}

//Changes tab selection
function ChangeSelection(newSelection, newBottomSelection, targetSection) {
    //Sets all tab buttons classes to blank
    statsButton.className = '';
    bottomStatsButton.className = '';

    backgroundButton.className = '';
    bottomBackgroundButton.className = '';
    if (spellsButton.className != "notVisible") {
        spellsButton.className = '';
        bottomSpellsButton.className = '';
    }
    allButton.className = '';
    bottomAllButton.className = '';

    //Sets all sections to not visible
    statsSection.className = "notVisible";
    backgroundSection.className = "notVisible";
    spellsSection.className = "notVisible";

    //Sets the new selection and new section
    newSelection.className = "Selected";
    currentSection = targetSection;
    targetSection.className = "visible Screen";
    newBottomSelection.className = "Selected";
}

//Loads a new character
function ChangeCharacter() {
    //Iterates through save data and checks the name against the characterSelect value then loads the new character
    for (let save of data) {
        if (save.name == characterSelect.value) {
            currentCharacter = save;
            break;
        }
    }
    //Loads new character
    SetUp();
}

//Initially sets up the page
function InitialSetup() {
    //Checks if any data is loaded
    if (data[0] != undefined) {
        //Displays the character view screen and hides the create character prompt
        dataSection.className = "dataVisible";
        noDataSection.className = "notVisible";

        //Resets select box html
        characterSelect.innerHTML = "";

        //Sets the current character to the first character
        currentCharacter = data[0];

        //Iterates through the characters and adds each name to the character selection box
        for (character of data) {
            characterSelect.innerHTML += '<label for="' + character.name + '">Option for ' + character.name + '</label> <option id="' + character.name + '" value="' + character.name + '">' + character.name + '</option>';
        }
    }
    else {
        //Displays create character prompt
        dataSection.className = "notVisible";
        noDataSection.className = "visible";
    }
    SetUp();
}

//Checks if the API is online
async function CheckAPI() {
    try {
        await fetch('https://www.dnd5eapi.co/');
        //If the API is online setup continues as normal
        InitialSetup();
    }
    catch (error) {
        //If the API is offline and there is no data then the backup data file is used for assessment purposes
        if (data == undefined) {
            let backupData = await fetch("backupData.json");
            backupData = await backupData.json();
            SetBackupData(backupData);
        }
        else {
            //If there is local data then initial setup continues as normal
            InitialSetup()
        }
    }
}

//Sets the global variable data to the backup data just in case
function SetBackupData(backupData) {
    data = backupData;
    SetUp();
}

CheckAPI();
