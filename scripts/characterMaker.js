//Reference to the character creation form
const form = document.getElementById("Basic");

//Reference to the basic section of the character creation form
const basicSection = document.getElementById("StatsForm");

//Reference to the background section of the character creation form
const backgroundSection = document.getElementById("BackgroundForm");

//Reference to the spells section of the character creation form
const spellsSection = document.getElementById("SpellsForm");

//Reference to the save button in the character creation form
const saveButton = document.getElementById("SaveButton");

//Reference to the button that opens the save menu in the character creation form
const saveScreenButton = document.getElementById("SaveScreenButton");

//Reference to the selection menu for the characters class
const classSelect = document.getElementById("ClassSelect");

//Reference to the selection menu for the characters race
const raceSelect = document.getElementById("RaceSelect");

//Reference to the selection menu for the characters background
const backgroundSelect = document.getElementById("BackgroundSelect");

//Reference to the selection menu for the characters bond
const bondBox = document.getElementById("BondSelect");

//Reference to the selection menu for the characters flaw
const flawBox = document.getElementById("FlawSelect");

//Reference to the selection menu for the characters ideals
const idealBox = document.getElementById("IdealsSelect");

//Reference to the selection menu for the characters trait
const traitBox = document.getElementById("TraitSelect");

//Reference to the button that opens the stats menu in the character creation form
const statsButton = document.getElementById("StatsButton");

//Reference to the button that opens the background menu in the character creation form
const backgroundButton = document.getElementById("BackgroundButton");

//Reference to the button that opens the spells menu in the character creation form
const spellsButton = document.getElementById("SpellsButton");

//Reference to the background description element
const backgroundDesc = document.getElementById("BackgroundDescription");

//Reference to the selection menu for the characters spells
const spellsSelect = document.getElementById("SpellsSelect");

//Reference to the selected spells list
const selectedSpells = document.getElementById("SelectedSpells");

//Reference to the save section of the character creation form
const saveSection = document.getElementById("SaveForm");

//Reference to the strength score input field
const strScore = document.getElementById("StrStat");

//Reference to the dexterity score input field
const dexScore = document.getElementById("DexStat");

//Reference to the constitution score input field
const conScore = document.getElementById("ConStat");

//Reference to the intelligence score input field
const intScore = document.getElementById("IntStat");

//Reference to the wisdom score input field
const wisScore = document.getElementById("WisStat");

//Reference to the charisma score input field
const chaScore = document.getElementById("ChaStat");

//Reference to the name input field
const nameInput = document.getElementById("NameInput");

//Reference to the ability score help element
const abScoreHelp = document.getElementById("ABScoreHelp");

//Reference to the class description element
const classDesc = document.getElementById("ClassDescription");

//Reference to the race description element
const raceDesc = document.getElementById("RaceDescription");

//Reference to the no API section
const noAPISection = document.getElementById("NoAPI");

//Reference to the browser local storage
const localStorage = window.localStorage;

//Refernce to the list of classes
let classList;

//Reference to the list of races
let raceList;

//Reference to the list of subraces based on the current race
let subRaceList;

//Reference to the list of subclasses based on the current class
let subClassList;

//Reference to the skill list
let skillList;

//Reference to the spell list based on the current class
let spellList;

//Reference to the background list
let backgroundList;

//Reference to the currently selected button
let currentlySelected;

//Reference to the currently selected section
let currentSection;

//Reference to the current class
let currentClass;

//Reference to the current race
let currentRace;

//Reference to the current subrace
let currentSubRace;

//Reference to the current subclass
let currentSubclass;

//Reference to the current background
let currentBackground;

//Reference to an array of the current class's features
let currentClassFeatures = new Array();

//Reference to an array of the selected spells
let currentSelectedSpells = new Array();

//Reference to an array of the html elements of the current spells
let selectedSpellsElements = new Array();

//Reference to the ability scores array
let abScores = new Array();

//Reference to the storage data
let storage;

//Gets any characters currently in storage and adds them to the storage variable
if (JSON.parse(localStorage.getItem("DnDCharacterList")) != undefined) {
    storage = JSON.parse(localStorage.getItem("DnDCharacterList"));
}
else {
    //If no characters have been found in local storage, storage is a new array
    storage = new Array();
}


//Adds event that opens the save screen
saveScreenButton.addEventListener("click", SaveCharacter);

//Adds event that updates the current class
classSelect.addEventListener("change", ChangeClass);

//Adds event that updates the current race
raceSelect.addEventListener("change", ChangeRace);

//Adds event that submits the form
spellsSelect.addEventListener("change", AddSpell);
form.addEventListener("submit", localSave);

//Adding events for all the tab buttons
statsButton.addEventListener("click", () => {
    ChangeSelection(statsButton, basicSection);
});

backgroundButton.addEventListener("click", () => {
    ChangeSelection(backgroundButton, backgroundSection);
});

spellsButton.addEventListener("click", () => {
    ChangeSelection(spellsButton, spellsSection);
});

//Adds event that stores the new score value
strScore.addEventListener("change", () => { CheckABScores(strScore); });
dexScore.addEventListener("change", () => { CheckABScores(dexScore); });
conScore.addEventListener("change", () => { CheckABScores(conScore); });
intScore.addEventListener("change", () => { CheckABScores(intScore); });
wisScore.addEventListener("change", () => { CheckABScores(wisScore); });
chaScore.addEventListener("change", () => { CheckABScores(chaScore); });

//The starting tab button and section
currentlySelected = statsButton;
currentSection = basicSection;

//Checks the ability score input for if it is valid. If the value is not valid it is reset to 0 and the help text is shown
function CheckABScores(scoreElement) {
    if (scoreElement.value < 0 || scoreElement.value > 20) {
        scoreElement.value = 0;
        abScoreHelp.className = "visible";
    }
}

//Fetches the class list from the API
async function GetClasses() {
    let classData = await fetch("https://www.dnd5eapi.co/api/classes/");
    classData = await classData.json();
    SetSelectionBox("ClassSelect", classData.results);
    return classData;
}

//Fetches the subclass list, class data and class features from the API
async function GetSubClasses(clas) {

    //Fetches the full class data
    let classData = await fetch('https://www.dnd5eapi.co' + clas.url);
    classData = await classData.json();
    classDesc.innerText = '';

    //Fetches the class features from the full class data
    let classLevel = await (await fetch('https://www.dnd5eapi.co' + classData.class_levels)).json();

    //Iterates through each class feature and adds it to the feature array
    for (let feature of classLevel[0].features) {
        let featureData = await (await fetch('https://www.dnd5eapi.co' + feature.url)).json();
        currentClassFeatures.push(featureData);

        //Displays the feature name
        classDesc.innerHTML += '<p>' + featureData.name;

        let featureText = String(featureData.desc);

        //Splits the feature description up into sentences that can then be displayed one at a time
        const featureDesc = featureText.split('.');

        //Iterates through the feature sentences and displays them
        for (let sentence of featureDesc) {
            if (sentence != '') {
                //Removes commas from the beginning of a sentence
                if (sentence[0] == ",") {
                    sentence = sentence.slice(1, sentence.length);
                }

                //Removes dashes from the sentences
                sentence = sentence.replace("-", "");
                classDesc.innerHTML += '<p>' + sentence + '</p><div class="dividerLine"></div>';
            }
        }
    }

    //Sets the subclass selection box
    SetSelectionBox("SubClassSelect", classData.subclasses);
    return classData;
}

//Changes the current class
function ChangeClass() {
    //Clears the class features array
    currentClassFeatures = new Array();

    //Iterates through the class list to check which class has been selected
    for (let clas of classList) {
        if (clas.name == classSelect.value) {
            currentClass = clas;
        }
    }
    //Gets the subclass data
    GetSubClasses(currentClass).then(result => {
        currentSubclass = result.subclasses[0];

        //Sets the subclass list
        subClassList = result.subclasses;

        //Sets the current class
        currentClass = result;

        //If the class has spells then the spell tab button is displayed 
        if (currentClass.spells != null) {
            spellsButton.className = "visible";

            //Gets the spell list for the class and adds it to the spell selection box
            GetSpells(currentClass.spells).then(list => {
                spellList = new Array();
                for (let i = 0; i < 10; i++) {
                    spellList.push(list.results[i]);
                }
                SetSelectionBox("SpellsSelect", spellList);
            });
        }
        else {
            //Makes sure the spell tab button is not visible if the class does not have spells
            spellsButton.className = "notVisible";
        }
    });
}

//Fetches the skill list from the API
async function GetSkills() {
    let skillList = await fetch("https://www.dnd5eapi.co/api/skills/");
    skillList = await skillList.json();
    return skillList;
}

//Fetches the race list from the API
async function GetRaces() {
    let raceData = await fetch("https://www.dnd5eapi.co/api/races/");
    raceData = await raceData.json()
    SetSelectionBox("RaceSelect", raceData.results);
    return raceData;
}

//Fetches the race data from the API
async function GetRaceData(race) {
    let raceData = await fetch('https://www.dnd5eapi.co' + race.url);
    raceData = await raceData.json();
    raceDesc.innerHTML = '<p>' + raceData.alignment + '</p><p>' + raceData.size_description + '</p>';
    return raceData;
}
//Fetches the subrace data from the API
async function GetSubRaceData(subrace) {
    let subraceData = await fetch('https://www.dnd5eapi.co' + subrace.url);
    subraceData = await subraceData.json();
    return subraceData;
}

//Changes the race displayed in the form
function ChangeRace() {
    //Checks which race has been selected
    for (let race of raceList) {
        if (race.name == raceSelect.value) {
            //Gets the race data
            GetRaceData(race).then(raceData => {
                currentRace = raceData;
                //Checks for subraces and displays the subrace selection box if there are any
                if (raceData.subraces.length > 0) {
                    subRaceList = raceData.subraces;
                    currentSubRace = subRaceList[0];
                    SetSelectionBox("SubRaceSelect", subRaceList);
                    let elements = document.getElementsByName("SubRaceSelect");
                    for (i = 0; i < elements.length; i++) {
                        elements[i].className = "visible";
                    }
                }
                else {
                    let elements = document.getElementsByName("SubRaceSelect");
                    for (i = 0; i < elements.length; i++) {
                        elements[i].className = "notVisible";
                    }
                }
            });
        }
    }
}

//Fetches the spell list from the API
async function GetSpells(spellListURL) {
    let spellList = await fetch("https://www.dnd5eapi.co" + spellListURL);
    spellList = await spellList.json();
    return spellList;
}

//Fetches the spell data from the API
async function GetSpellData(spellName) {
    for (let spell in spellList) {
        if (spellList[spell].name == spellName) {
            let spellData = await fetch("https://www.dnd5eapi.co" + spellList[spell].url);
            spellData = await spellData.json();
            return spellData;
        }
    }
}

//Adds a spell to the selected spell list and displays its description and remove button
async function AddSpell() {
    //Fetches the spell data from the API
    await GetSpellData(spellsSelect.value).then(spellData => {
        //Adds the current spell to the selected spells array
        currentSelectedSpells.push(spellData);

        //Adds the spell's html refernce to the elements array
        selectedSpellsElements.push(spellData.index);

        //Displays the spells description, remove button and name
        selectedSpells.innerHTML += '<section id="' + spellData.index + '"class="Screen">';
        document.getElementById(spellData.index).innerHTML += '<p>' + spellData.name + '</p><p>' + spellData.desc + '</p><input type="button" name="' + spellData.index + spellData.name + '" id="' + spellData.index + spellData.name + '" value="Remove">';
        document.getElementById(spellData.index + spellData.name).addEventListener("click", () => {
            //Adds an even to the remove button to remove the spell
            RemoveSpell(currentSelectedSpells.length - 1);
        });
    });
}

//Removes the spell from the array and document
function RemoveSpell(spellNum) {
    //Removes the spell from the array
    currentSelectedSpells.pop(currentSelectedSpells[spellNum]);
    let button = selectedSpellsElements.pop(selectedSpellsElements[spellNum]);

    //Removes the spell from the document
    for (let node of selectedSpells.childNodes) {
        if (node.id == button) {
            selectedSpells.removeChild(node);
        }
    }
}

//Fetches the background list, bond list, flaw list, ideals list and trait list from the API
async function GetBackground() {
    //Gets the background list
    let backgroundList = await fetch("https://www.dnd5eapi.co/api/backgrounds/");
    backgroundList = await backgroundList.json();

    //Gets the background data
    let background = await fetch("https://www.dnd5eapi.co" + backgroundList.results[0].url)
    background = await background.json();

    //Adds the background list to the selection box
    SetSelectionBox("BackgroundSelect", backgroundList.results);

    //Sets the description for the current background
    backgroundDesc.innerText = background.feature.desc[0];

    //Gets and set the bond list for the current background
    bondBox.innerHTML = '';
    for (let object of background.bonds.from.options) {
        bondBox.innerHTML += '<label for="' + object.string + '">Option for ' + object.string + '</label> <option id="' + object.string + '" value="' + object.string + '">' + object.string + '</option>';
    }

    //Gets and set the flaw list for the current background
    flawBox.innerHTML = '';
    for (let object of background.flaws.from.options) {
        flawBox.innerHTML += '<label for="' + object.string + '">Option for ' + object.string + '</label> <option id="' + object.string + '" value="' + object.string + '">' + object.string + '</option>';
    }

    //Gets and set the ideal list for the current background
    idealBox.innerHTML = '';
    for (let object of background.ideals.from.options) {
        idealBox.innerHTML += '<label for="' + object.desc + '">Option for ' + object.desc + '</label> <option id="' + object.desc + '" value="' + object.desc + '">' + object.desc + '</option>';
    }

    //Gets and set the trait list for the current background
    traitBox.innerHTML = '';
    for (let object of background.personality_traits.from.options) {
        traitBox.innerHTML += '<label for="' + object.string + '">Option for "' + object.string + '"</label> <option id="' + object.string + '" value="' + object.string + '">' + object.string + '</option>';
    }
    //Returns the background list and the current background data
    return [backgroundList, background];
}

//Sets the values in a selection box
function SetSelectionBox(id, content) {
    let selectionBox = document.getElementById(id);
    selectionBox.innerHTML = "";

    //Iterates through the content of the selection box and adds it to the box
    for (let object of content) {
        selectionBox.innerHTML += '<option id="' + object.name + '" value="' + object.name + '">' + object.name + '</option>';
    }
}

//Opens the save section of the form
function SaveCharacter() {
    //Closes the save screen if it is already open
    if (saveScreenButton.className == "Selected") {
        saveScreenButton.className = '';
        saveSection.className = 'notVisible';
        ChangeSelection(statsButton, basicSection);
        return;
    }
    else {
        //Opens the save screen
        saveScreenButton.className = "Selected";
        currentlySelected.className = "";
        currentlySelected = saveScreenButton;
        basicSection.className = "visible Screen";
        backgroundSection.className = "visible Screen";
        saveSection.className = "visible Screen";
        if (spellsButton.className != "notVisible") {
            spellsSection.className = "visible Screen";
        }
    }
}

//Saves the character to the local browser storage
async function localSave(event) {

    document.getElementById("SaveElements").className = "notVisible";
    document.getElementById("SavingElements").className = "visible";
    //Stops the form from clearing
    event.preventDefault();
    //Sets the ability score array
    abScores.push(strScore.value, dexScore.value, conScore.value, intScore.value, wisScore.value, chaScore.value);

    //Defines the character to be saved
    let character = new Character(abScores, nameInput.value, currentClass, currentClassFeatures, currentSubclass, currentRace, currentSubRace, currentBackground, bondBox.value, flawBox.value, idealBox.value, traitBox.value, currentSelectedSpells);

    //Fetches any other data needed from the API for the character
    await character.Constructor(skillList);
    
    //Sets the saving progress text to show conformation of the character being saved
    document.getElementById("SavingElements").innerHTML = "<h2>Successfully Saved!</h2>";
    //Adds the character to the storage array
    storage.push(character);

    //Converts the storage array to a string then sets it into local storage with the key DnDCharacterList
    let toStore = JSON.stringify(storage);
    localStorage.setItem("DnDCharacterList", toStore);

    //Sets a 1.5 seconds timeout before the form is reset to allow the user to see confirmation the character has been saved
    setTimeout(() => {
        document.getElementById("SavingElements").innerHTML = "<h2>Saving</h2>";
        document.getElementById("SaveElements").className = "visible";
        document.getElementById("SavingElements").className = "notVisible";
        form.reset();
        ChangeSelection(statsButton, basicSection);
    }, 1500);
}

//Changes the tab screen
function ChangeSelection(newSelection, targetSection) {
    //Checks if the screen is already open
    if (currentlySelected != newSelection) {
        //Sets all the screens to not visible
        basicSection.className = "notVisible";
        backgroundSection.className = "notVisible";
        spellsSection.className = "notVisible";
        saveSection.className = "notVisible";

        //Removes any stylings from the current button
        currentlySelected.className = "";

        //Sets the stylings on the new button
        newSelection.className = "Selected";

        //Redefines currently selected and current section to represent the new section
        currentlySelected = newSelection;
        currentSection = targetSection;

        //Makes the new screen visible
        targetSection.className = "visible Screen";
    }
}

//Sets up the character creation screen
async function InitialSetup() {
    let initialClass;
    let initialRace;
    let initialSubclass;
    let initialBackground;

    let initialClassList;
    let initialRaceList;
    let initialSubclassList;
    let initialSkillList;
    let initialBackgroundList;

    //Gets all needed API data

    // Description: then(x => {}) statement is taken from an answer on stack overflow
    // Author: Pac0
    // URL: https://stackoverflow.com/questions/49938266/how-to-return-values-from-async-functions-using-async-await-from-function
    // Date Accessed: 12/04/2023
    await GetClasses().then(clas => {
        //End of cited code
        initialClass = clas.results[0];
        initialClassList = clas.results;
    });

    await GetRaces().then(race => {
        initialRace = race.results[0];
        initialRaceList = race.results;
    });

    await GetRaceData(initialRace).then(raceData => {
        initialRace = raceData;
    })

    await GetSubClasses(initialClass).then(subclass => {
        initialSubclass = subclass.subclasses[0];
        initialSubclassList = subclass.subclasses;
        initialClass = subclass;
    });

    await GetSkills().then(skillList => {
        initialSkillList = skillList.results;
    });

    await GetBackground().then(backgroundList => {
        initialBackgroundList = backgroundList[0].results;
        initialBackground = backgroundList[1];
    });
    //Returns all the variables that need to be assigned globally 
    return [initialClass, initialRace, initialSubclass, initialClassList, initialRaceList, initialSubclassList, initialSkillList, initialBackgroundList, initialBackground];
}

async function SetUpAPI() {
    //Sets the curser to show a loading circle
    form.className = "Loading";

    //Tries to fetch the API to see if it is available
    try {
        await fetch('https://www.dnd5eapi.co/')

        //If the API is online then the page is setup
        await InitialSetup().then(result => {
            //Assignes global variables gotten from the API
            form.className = '';
            currentClass = result[0];
            currentRace = result[1];
            currentSubclass = result[2];

            classList = result[3];
            raceList = result[4];
            subClassList = result[5];
            skillList = result[6];
            backgroundList = result[7];
            currentBackground = result[8];

            if (currentClass.spells != null) {
                spellsButton.className = "visible";
            }
        });
    }
    //Catches the error if the API is not available
    catch (error) {
        document.getElementById("Forms").className = "notVisible";
        noAPISection.className = "visible";
    }
}

SetUpAPI();