let classList;
let raceList;
let subRaceList;
let subClassList;

let currentClass;
let currentRace;
let currentSubRace;
let currentSubclass;

const saveButton = document.getElementById("SaveButton");
saveButton.addEventListener("click",SaveCharacter);
const classSelect = document.getElementById("ClassSelect");
classSelect.addEventListener("change", ChangeClass);
const raceSelect = document.getElementById("RaceSelect");
raceSelect.addEventListener("change",ChangeRace);

async function InitialSetup(){
    let initialClass;
    let initialRace;
    let initialSubclass;

    let initialClassList;
    let initialRaceList;
    let initialSubclassList;

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

    return [initialClass, initialRace, initialSubclass, initialClassList, initialRaceList, initialSubclassList];
}
async function GetClasses() {
    let classData  = await fetch("https://www.dnd5eapi.co/api/classes/");
    classData = await classData.json();
    SetSelectionBox("ClassSelect", classData.results);
    return classData;
}

async function GetRaces(){
    let raceData = await fetch("https://www.dnd5eapi.co/api/races/");
    raceData = await raceData.json()
    SetSelectionBox("RaceSelect", raceData.results);
    return raceData;
}

function SetSelectionBox(id, content){
    let selectionBox = document.getElementById(id);
    selectionBox.innerHTML = "";
    for (let object of content) {
        selectionBox.innerHTML += '<label for="'+ object.name +'">Option for '+ object.name +'</label> <option id='+ object.name +' value=' + object.name +'>' + object.name + '</option>';
    }
}

async function GetRaceData(race){
    let raceData = await fetch('https://www.dnd5eapi.co' + race.url);
    raceData = await raceData.json();
    return raceData;
}

async function GetSubClasses(clas){
    let classData = await fetch('https://www.dnd5eapi.co' + clas.url);
    classData = await classData.json()
    SetSelectionBox("SubClassSelect", classData.subclasses);
    return classData.subclasses;
}

function SetClassList(result){
    classList = result.results;
    currentClass = classList[0];
}

function ChangeClass(){
    console.log();
    for (let clas of classList){
        if(clas.name == classSelect.value){
            currentClass = clas;
        }
    }
    GetSubClasses(currentClass).then(result =>{
        currentSubclass = result[0];
        subClassList = result;
    });
}

function ChangeRace(){
    for (let race of raceList){
        if(race.name == raceSelect.value){
            console.log(race);
            GetRaceData(race).then(raceData =>{
                currentRace = raceData;
                if(raceData.subraces.length > 0){
                    subRaceList = raceData.subraces;
                    currentSubRace = subRaceList[0];
                    SetSelectionBox("SubRaceSelect",subRaceList);
                    let elements = document.getElementsByName("SubRaceSelect");
                    for(i = 0; i < elements.length; i++){
                        elements[i].className = "visible";
                    }
                }
            });
        }
    }
}

function SaveCharacter(){
    let character = new Character(currentClass, currentRace, currentSubclass);
    console.log(character);
}

InitialSetup().then(result =>{
    currentClass = result[0];
    currentRace = result[1];
    currentSubclass = result[2];

    classList = result[3];
    raceList = result[4];
    subClassList = result[5];
});