let serverAvailable = false;

let classList;
let raceList;
let subRaceList;
let subClassList;
let skillList;
let spellList;
let backgroundList;
let currentlySelected;
let currentSection;

let currentClass;
let currentRace;
let currentSubRace;
let currentSubclass;
let currentBackground;

let currentSelectedSpells = new Array();
let selectedSpellsElements = new Array();

const basicSection = document.getElementById("CharacterForm");
const backgroundSection = document.getElementById("BackgroundForm");
const spellsSection = document.getElementById("SpellsForm");
const saveButton = document.getElementById("SaveButton");
const classSelect = document.getElementById("ClassSelect");
const raceSelect = document.getElementById("RaceSelect");
const backgroundSelect = document.getElementById("BackgroundSelect");
const bondBox = document.getElementById("BondSelect");
const flawBox = document.getElementById("FlawSelect");
const idealBox = document.getElementById("IdealsSelect");
const traitBox = document.getElementById("TraitSelect");
const statsButton = document.getElementById("StatsButton");
const backgroundButton = document.getElementById("BackgroundButton");
const spellsButton = document.getElementById("SpellsButton");
const backgroundDesc = document.getElementById("BackgroundDescription");
const spellsSelect = document.getElementById("SpellsSelect");
const selectedSpells = document.getElementById("SelectedSpells");
const localStorage = window.localStorage;

saveButton.addEventListener("click", SaveCharacter);
classSelect.addEventListener("change", ChangeClass);
raceSelect.addEventListener("change", ChangeRace);
spellsSelect.addEventListener("change", AddSpell);
statsButton.addEventListener("click", () => {
    ChangeSelection(statsButton, basicSection);
});

backgroundButton.addEventListener("click", () => {
    ChangeSelection(backgroundButton, backgroundSection);
});

spellsButton.addEventListener("click", () => {
    ChangeSelection(spellsButton, spellsSection);
});

currentlySelected = statsButton;
currentSection = basicSection;

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
    return [initialClass, initialRace, initialSubclass, initialClassList, initialRaceList, initialSubclassList, initialSkillList, initialBackgroundList, initialBackground];
}
async function GetClasses() {
    let classData = await fetch("https://www.dnd5eapi.co/api/classes/");
    classData = await classData.json();
    SetSelectionBox("ClassSelect", classData.results);
    return classData;
}

async function GetSubClasses(clas) {
    let classData = await fetch('https://www.dnd5eapi.co' + clas.url);
    classData = await classData.json()
    SetSelectionBox("SubClassSelect", classData.subclasses);
    return classData;
}

function ChangeClass() {
    for (let clas of classList) {
        if (clas.name == classSelect.value) {
            currentClass = clas;
        }
    }
    GetSubClasses(currentClass).then(result => {
        currentSubclass = result.subclasses[0];
        subClassList = result.subclasses;
        currentClass = result;
        if(currentClass.spells !=null){
            spellsButton.className = "visible";
            GetSpells(currentClass.spells).then(list => {
                spellList = list;
                SetSelectionBox("SpellsSelect", list.results);
            });
        }
    });
}

async function GetSpells(spellListURL){
    let spellList = await fetch("https://www.dnd5eapi.co" + spellListURL);
    spellList = await spellList.json();
    return spellList;
}

async function GetSpellData(spellName){
    for (let spell in spellList)
    {
        if (spell.name == spellName){
            let spellData = await fetch("https://www.dnd5eapi.co" + spell.url);
            spellData = await spellData.json();
            console.log(spellData);
            return spellData;
        } 
    }
}

async function AddSpell(){
    await GetSpellData(spellsSelect.value).then(spellData => {
        currentSelectedSpells.push(spellData);
        selectedSpellsElements.push('<section id="'+ spellData.name +'">');
        selectedSpells.innerHTML += selectedSpellsElements[selectedSpellsElements.length -1];

        document.getElementById(spellData.name).innerHTML += '<p>' + spellData.name + '</p>';

        document.getElementById(currentSelectedSpells[currentSelectedSpells.length - 1].name).addEventListener("click", () =>{
            RemoveSpell(currentSelectedSpells.length - 1);
        });
    });
}

function RemoveSpell(spellNum){
    let spell = currentSelectedSpells.pop(currentSelectedSpells[spellNum]);
    let button = selectedSpellsButton.pop(selectedSpellsButton[spellNum]);
    selectedSpells.remove(spell);
    selectedSpells.remove(button);
}

async function GetSkills() {
    let skillList = await fetch("https://www.dnd5eapi.co/api/skills/");
    skillList = await skillList.json();
    return skillList;
}

async function GetRaces() {
    let raceData = await fetch("https://www.dnd5eapi.co/api/races/");
    raceData = await raceData.json()
    SetSelectionBox("RaceSelect", raceData.results);
    return raceData;
}

async function GetBackground() {
    let backgroundData = await fetch("https://www.dnd5eapi.co/api/backgrounds/");
    backgroundData = await backgroundData.json();
    let background = await fetch("https://www.dnd5eapi.co" + backgroundData.results[0].url)
    background = await background.json();
    SetSelectionBox("BackgroundSelect", backgroundData.results);

    backgroundDesc.innerText = background.feature.desc[0];

    bondBox.innerHTML = '';
    for (let object of background.bonds.from.options) {
        bondBox.innerHTML += '<label for="' + object.string + '">Option for ' + object.string + '</label> <option id="' + object.string + '" value="' + object.string + '">' + object.string + '</option>';
    }

    flawBox.innerHTML = '';
    for (let object of background.flaws.from.options) {
        flawBox.innerHTML += '<label for="' + object.string + '">Option for ' + object.string + '</label> <option id="' + object.string + '" value="' + object.string + '">' + object.string + '</option>';
    }

    idealBox.innerHTML = '';
    for (let object of background.ideals.from.options) {
        idealBox.innerHTML += '<label for="' + object.desc + '">Option for ' + object.desc + '</label> <option id="' + object.desc + '" value="' + object.desc + '">' + object.desc + '</option>';
    }

    traitBox.innerHTML = '';
    for (let object of background.personality_traits.from.options) {
        traitBox.innerHTML += '<label for="' + object.string + '">Option for "' + object.string + '"</label> <option id="' + object.string + '" value="' + object.string + '">' + object.string + '</option>';
    }
    return [backgroundData, background];
}

function SetSelectionBox(id, content) {
    let selectionBox = document.getElementById(id);
    selectionBox.innerHTML = "";
    for (let object of content) {
        selectionBox.innerHTML += '<label for="' + object.name + '">Option for ' + object.name + '</label> <option id="' + object.name + '" value="' + object.name + '">' + object.name + '</option>';
    }
}

async function GetRaceData(race) {
    let raceData = await fetch('https://www.dnd5eapi.co' + race.url);
    raceData = await raceData.json();
    return raceData;
}

async function GetSubRaceData(subrace) {
    let subraceData = await fetch('https://www.dnd5eapi.co' + subrace.url);
    subraceData = await subraceData.json();
    return subraceData;
}

function ChangeRace() {
    for (let race of raceList) {
        if (race.name == raceSelect.value) {
            GetRaceData(race).then(raceData => {
                currentRace = raceData;
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

async function SaveCharacter() {
    let character = new Character(currentClass, currentSubclass, currentRace, currentSubRace, currentBackground, bondBox.value, flawBox.value, idealBox.value, traitBox.value);
    await character.Constructor(skillList);
    character.SaveCharacter(localStorage);
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


if(!fetch('https://www.dnd5eapi.co/').failed){
    serverAvailable = true;
}


if(serverAvailable){
    InitialSetup().then(result => {
        currentClass = result[0];
        currentRace = result[1];
        currentSubclass = result[2];
    
        classList = result[3];
        raceList = result[4];
        subClassList = result[5];
        skillList = result[6];
        backgroundList = result[7];
        currentBackground = result[8];

        if(currentClass.spells !=null){
            spellsButton.className = "visible";
        }
    });
}