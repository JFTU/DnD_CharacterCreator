const localStorage = window.localStorage;
const noDataButton = document.getElementById("NoDataCharacterButton");
const noDataSection = document.getElementById("NoData");
const dataSection = document.getElementById("Data");
const characterSelect = document.getElementById("CharacterSelect");
const nameText = document.getElementById("CharacterName");
const statsButton = document.getElementById("StatsButton");
const backgroundButton = document.getElementById("BackgroundButton");
const spellsButton = document.getElementById("SpellsButton");
const allButton = document.getElementById("AllButton");
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
const deleteButton = document.getElementById("DeleteButton");
const backgroundDesc = document.getElementById("BackgroundDescription");
const deleteSection = document.getElementById("DeleteSection");
const deleteCharacter = document.getElementById("Delete");
const cancelDelete = document.getElementById("Cancel");
const classDesc = document.getElementById("ClassDescription");
const subClassDesc = document.getElementById("SubClassDescription");
const raceDesc = document.getElementById("RaceDescription");

const bottomStatsButton = document.getElementById("BottomStatsButton");
const bottomBackgroundButton = document.getElementById("BottomBackgroundButton");
const bottomSpellsButton = document.getElementById("BottomSpellsButton");
const bottomAllButton = document.getElementById("BottomAllButton");
const bottomDeleteButton = document.getElementById("BottomDeleteButton");


let currentCharacter;
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

function AllButton() {
    statsButton.className = '';
    bottomStatsButton.className = '';

    backgroundButton.className = '';
    bottomBackgroundButton.className = '';
    if(spellsButton.className != "notVisible"){
        spellsButton.className = '';
        bottomSpellsButton.className = '';
    }
    allButton.className = "Selected";
    statsSection.className = "visible Screen";
    backgroundSection.className = "visible Screen";
    if (spellsButton.className != "notVisible") {
        spellsSection.className = "visible Screen";
    }
}

function SetUp() {
    if (data[0] != undefined) {
        dataSection.className = "dataVisible";
        noDataSection.className = "notVisible";
        characterSelect.innerHTML = "";
        currentCharacter = data[0];
        for (character of data) {
            characterSelect.innerHTML += '<label for="' + character.name + '">Option for ' + character.name + '</label> <option id="' + character.name + '" value="' + character.name + '">' + character.name + '</option>';
        }
        nameText.innerText = currentCharacter.name;
        scoreText.innerHTML = '';
        classText.innerText = '';
        raceText.innerHTML = '';
        proficiencyTable.innerHTML = '<tr><th>Proficiency</th><th>Modifier</th></tr>';
        backgroundText.innerText = '';
        flawText.innerText = '';
        for (let score of currentCharacter.abScores) {
            scoreText.innerHTML += '<div class="Scores"><p>Mod: ' + score.modifier + '</p> <p>Val: ' + score.score + '</p> <p>' + score.name + '</p></div>';
        }
        classText.innerText += 'Class: ' + currentCharacter.charClass.name + ' Subclass: ' + currentCharacter.subClass.name;
        for (let feature of currentCharacter.charClassFeatures) {
            classDesc.innerHTML += '<p>' + feature.name;
            let featureText = String(feature.desc);
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
        if (currentCharacter.subRace != null) {
            raceText.innerText += 'Race: ' + currentCharacter.race.name + ' Subrace: ' + currentCharacter.subRace.name;
        }
        else {
            raceText.innerText += 'Race: ' + currentCharacter.race.name;
        }

        raceDesc.innerHTML = '<p>' + currentCharacter.race.alignment + '</p><div class="dividerLine"></div><p>' + currentCharacter.race.size_description + '</p>';

        for (let prof of currentCharacter.skills) {
            proficiencyTable.innerHTML += '<tr><td>' + prof.name + '</td><td class="SkillModifier">' + prof.modifier + '</td></tr>';
        }

        backgroundText.innerText += currentCharacter.background.name;
        backgroundDesc.innerText = currentCharacter.background.feature.desc[0];
        flawText.innerText += "Flaw: " + currentCharacter.flaw;
        idealText.innerText += "Ideal: " + currentCharacter.ideal;
        traitText.innerText += "Trait: " + currentCharacter.trait;
        if (currentCharacter.spells.length != 0) {
            spellsButton.className = "visible";
            bottomSpellsButton.className = "visible";
            for (let spellData of currentCharacter.spells) {
                spellsSection.innerHTML += '<section id="' + spellData.index + '"class="Screen">';
                document.getElementById(spellData.index).innerHTML += '<p>' + spellData.name + '</p><p>' + spellData.desc + '</p>';
            }
        }
        else {
            spellsButton.className = "notVisible";
            bottomSpellsButton.className = "notVisible";
        }
    }
    else {
        dataSection.className = "notVisible";
        noDataSection.className = "visible";
    }

}

function ChangeSelection(newSelection, newBottomSelection, targetSection) {
    statsButton.className = '';
    bottomStatsButton.className = '';

    backgroundButton.className = '';
    bottomBackgroundButton.className = '';
    if(spellsButton.className != "notVisible"){
        spellsButton.className = '';
        bottomSpellsButton.className = '';
    }
    allButton.className = '';
    bottomAllButton.className = '';

    statsSection.className = "notVisible";
    backgroundSection.className = "notVisible";
    spellsSection.className = "notVisible";
    newSelection.className = "Selected";
    currentSection = targetSection;
    targetSection.className = "visible Screen";
    newBottomSelection.className = "Selected";
}

function ChangeCharacter() {
    for (let save of data) {
        if (save.name == characterSelect.value) {
            currentCharacter = save;
            break;
        }
    }
    SetUp();
}
async function CheckAPI(){
    try{
        await fetch('https://www.dnd5eapi.co/');
        SetUp();
    }
    catch (error){
        if(data == undefined){
            let backupData = await fetch("backupData.json");
            backupData = await backupData.json();
            SetBackupData(backupData);
        }
        else{
            SetUp();
        }
    }
}

function SetBackupData(backupData){
    data = backupData;
    SetUp();
}

CheckAPI();
