const form = document.getElementById("Basic");
const basicSection = document.getElementById("StatsForm");
const backgroundSection = document.getElementById("BackgroundForm");
const spellsSection = document.getElementById("SpellsForm");
const saveButton = document.getElementById("SaveButton");
const saveScreenButton = document.getElementById("SaveScreenButton");
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
const saveSection = document.getElementById("SaveForm");
const strScore = document.getElementById("StrStat");
const dexScore = document.getElementById("DexStat");
const conScore = document.getElementById("ConStat");
const intScore = document.getElementById("IntStat");
const wisScore = document.getElementById("WisStat");
const chaScore = document.getElementById("ChaStat");
const nameInput = document.getElementById("NameInput");
const abScoreHelp = document.getElementById("ABScoreHelp");
const classDesc = document.getElementById("ClassDescription");
const subClassDesc = document.getElementById("SubClassDescription");
const raceDesc = document.getElementById("RaceDescription");
const noAPISection = document.getElementById("NoAPI");
const localStorage = window.localStorage;

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

let currentClassFeatures = new Array();
let currentSelectedSpells = new Array();
let selectedSpellsElements = new Array();
let abScores = new Array();
let storage = new Array();

saveScreenButton.addEventListener("click", SaveCharacter);
classSelect.addEventListener("change", ChangeClass);
raceSelect.addEventListener("change", ChangeRace);
spellsSelect.addEventListener("change", AddSpell);
form.addEventListener("submit", localSave);
statsButton.addEventListener("click", () => {
    ChangeSelection(statsButton, basicSection);
});

backgroundButton.addEventListener("click", () => {
    ChangeSelection(backgroundButton, backgroundSection);
});

spellsButton.addEventListener("click", () => {
    ChangeSelection(spellsButton, spellsSection);
});

strScore.addEventListener("change", () => { CheckABScores(strScore); });
dexScore.addEventListener("change", () => { CheckABScores(dexScore); });
conScore.addEventListener("change", () => { CheckABScores(conScore); });
intScore.addEventListener("change", () => { CheckABScores(intScore); });
wisScore.addEventListener("change", () => { CheckABScores(wisScore); });
chaScore.addEventListener("change", () => { CheckABScores(chaScore); });

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
    classData = await classData.json();
    classDesc.innerText = '';
    let classLevel = await (await fetch('https://www.dnd5eapi.co' + classData.class_levels)).json();
    for (let feature of classLevel[0].features) {
        let featureData = await (await fetch('https://www.dnd5eapi.co' + feature.url)).json();
        currentClassFeatures.push(featureData);
        classDesc.innerHTML += '<p>' + featureData.name;
        let featureText = String(featureData.desc);
        const featureDesc = featureText.split('.');
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
    SetSelectionBox("SubClassSelect", classData.subclasses);
    return classData;
}

function ChangeClass() {
    currentClassFeatures = new Array();
    for (let clas of classList) {
        if (clas.name == classSelect.value) {
            currentClass = clas;
        }
    }
    GetSubClasses(currentClass).then(result => {
        currentSubclass = result.subclasses[0];
        subClassList = result.subclasses;
        currentClass = result;
        if (currentClass.spells != null) {
            spellsButton.className = "visible";
            GetSpells(currentClass.spells).then(list => {
                spellList = new Array();
                for (let i = 0; i < 10; i++) {
                    spellList.push(list.results[i]);
                }
                SetSelectionBox("SpellsSelect", spellList);
            });
        }
    });
}

async function GetSpells(spellListURL) {
    let spellList = await fetch("https://www.dnd5eapi.co" + spellListURL);
    spellList = await spellList.json();
    return spellList;
}

async function GetSpellData(spellName) {
    for (let spell in spellList) {
        if (spellList[spell].name == spellName) {
            let spellData = await fetch("https://www.dnd5eapi.co" + spellList[spell].url);
            spellData = await spellData.json();
            return spellData;
        }
    }
}

async function AddSpell() {
    await GetSpellData(spellsSelect.value).then(spellData => {
        currentSelectedSpells.push(spellData);
        selectedSpellsElements.push(spellData.index);
        selectedSpells.innerHTML += '<section id="' + spellData.index + '"class="Screen">';
        document.getElementById(spellData.index).innerHTML += '<p>' + spellData.name + '</p><p>' + spellData.desc + '</p><input type="button" name="' + spellData.index + spellData.name + '" id="' + spellData.index + spellData.name + '" value="Remove">';
        document.getElementById(spellData.index + spellData.name).addEventListener("click", () => {
            RemoveSpell(currentSelectedSpells.length - 1);
        });
    });
}

function RemoveSpell(spellNum) {
    currentSelectedSpells.pop(currentSelectedSpells[spellNum]);
    let button = selectedSpellsElements.pop(selectedSpellsElements[spellNum]);
    for (let node of selectedSpells.childNodes) {
        if (node.id == button) {
            selectedSpells.removeChild(node);
        }
    }
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
    raceDesc.innerHTML = '<p>' + raceData.alignment + '</p><p>' + raceData.size_description + '</p>';
    return raceData;
}

function CheckABScores(scoreElement) {
    if (scoreElement.value < 0 || scoreElement.value > 20) {
        scoreElement.value = 0;
        abScoreHelp.className = "visible";
    }
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

function SaveCharacter() {
    if (saveScreenButton.className == "Selected") {
        saveScreenButton.className = '';
        saveSection.className = 'notVisible';
        ChangeSelection(statsButton, basicSection);
        return;
    }
    else {
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

async function localSave(event) {
    event.preventDefault();
    abScores.push(strScore.value, dexScore.value, conScore.value, intScore.value, wisScore.value, chaScore.value);
    let character = new Character(abScores, nameInput.value, currentClass, currentClassFeatures, currentSubclass, currentRace, currentSubRace, currentBackground, bondBox.value, flawBox.value, idealBox.value, traitBox.value, currentSelectedSpells);
    await character.Constructor(skillList);
    storage.push(character);
    let toStore = JSON.stringify(storage);
    localStorage.setItem("DnDCharacterList", toStore);
}

function ChangeSelection(newSelection, targetSection) {
    if (currentlySelected != newSelection) {
        basicSection.className = "notVisible";
        backgroundSection.className = "notVisible";
        spellsSection.className = "notVisible";
        saveSection.className = "notVisible";
        currentlySelected.className = "";
        newSelection.className = "Selected";
        currentlySelected = newSelection;
        currentSection = targetSection;
        targetSection.className = "visible Screen";
    }
}

async function SetUpAPI() {
    form.className = "Loading";
    console.log(await fetch('https://www.dnd5eapi.co/').failed);
    try {
        await fetch('https://www.dnd5eapi.co/')
        await InitialSetup().then(result => {
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
    catch (error) {
        document.getElementById("Forms").className = "notVisible";
        noAPISection.className = "visible";
    }
}

SetUpAPI();