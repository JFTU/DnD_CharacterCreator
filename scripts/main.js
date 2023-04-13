let classList;
let raceList;
let subRaceList;
let subClassList;
let skillList;

let currentClass;
let currentRace;
let currentSubRace;
let currentSubclass;

const saveButton = document.getElementById("SaveButton");
saveButton.addEventListener("click", SaveCharacter);
const classSelect = document.getElementById("ClassSelect");
classSelect.addEventListener("change", ChangeClass);
const raceSelect = document.getElementById("RaceSelect");
raceSelect.addEventListener("change", ChangeRace);
const localStorage = window.localStorage;

async function InitialSetup() {
    let initialClass;
    let initialRace;
    let initialSubclass;

    let initialClassList;
    let initialRaceList;
    let initialSubclassList;
    let initialSkillList;

    // Description: Then then(x => {}) statement is taken from an answer on stack overflow
    // Author: Pac0
    // URL: https://stackoverflow.com/questions/49938266/how-to-return-values-from-async-functions-using-async-await-from-function
    // Date Accessed: 12/04/2023
    await GetClasses().then(clas => {
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
        initialSubclass = subclass[0];
        initialSubclassList = subclass;
    });

    await GetSkills().then(skillList => {
        initialSkillList = skillList.results;
    });

    return [initialClass, initialRace, initialSubclass, initialClassList, initialRaceList, initialSubclassList, initialSkillList];
}
async function GetClasses() {
    let classData = await fetch("https://www.dnd5eapi.co/api/classes/");
    classData = await classData.json();
    SetSelectionBox("ClassSelect", classData.results);
    return classData;
}

async function GetSkills(){
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

function SetSelectionBox(id, content) {
    let selectionBox = document.getElementById(id);
    selectionBox.innerHTML = "";
    for (let object of content) {
        selectionBox.innerHTML += '<label for="' + object.name + '">Option for ' + object.name + '</label> <option id=' + object.name + ' value=' + object.name + '>' + object.name + '</option>';
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

async function GetSubClasses(clas) {
    let classData = await fetch('https://www.dnd5eapi.co' + clas.url);
    classData = await classData.json()
    SetSelectionBox("SubClassSelect", classData.subclasses);
    return classData.subclasses;
}

function SetClassList(result) {
    classList = result.results;
    currentClass = classList[0];
}

function ChangeClass() {
    for (let clas of classList) {
        if (clas.name == classSelect.value) {
            currentClass = clas;
        }
    }
    GetSubClasses(currentClass).then(result => {
        currentSubclass = result[0];
        subClassList = result;
    });
}

function ChangeRace() {
    for (let race of raceList) {
        if (race.name == raceSelect.value) {
            GetRaceData(race).then(raceData => {
                currentRace = raceData;
                if (raceData.subraces.length > 0) {
                    subRaceList = raceData.subraces;
                    currentSubRace = subRaceList[0];
                    GetSubRaceData(currentSubRace).then(subrace => { currentSubRace = subrace;});
                    SetSelectionBox("SubRaceSelect", subRaceList);
                    let elements = document.getElementsByName("SubRaceSelect");
                    for (i = 0; i < elements.length; i++) {
                        elements[i].className = "visible";
                    }
                }
                else{
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
    let character = new Character(currentClass,currentSubclass,currentRace,currentSubRace);
    await character.Constructor(skillList);
    character.SaveCharacter(localStorage);
    console.log(character.skills);
}

InitialSetup().then(result => {
    currentClass = result[0];
    currentRace = result[1];
    currentSubclass = result[2];

    classList = result[3];
    raceList = result[4];
    subClassList = result[5];
    skillList = result[6];
});