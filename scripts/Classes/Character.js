class Character {
    race;
    subRace = null;

    charClass;
    subClass;

    abScores;
    skills;

    proficiencies;
    proficienyBonus = 2;

    background;
    flaw;
    ideal;
    trait;

    constructor(charClass, subClass, race, subRace, background, flaw, ideal, trait) {
        this.charClass = charClass;
        this.subClass = subClass;
        this.race = race;
        this.subRace = subRace;
        this.background = background;
        this.flaw = flaw;
        this.ideal = ideal;
        this.trait = trait;
    }

    async Constructor(skillsList){
        await this.GetBasicAPIData();
        await this.SetABScores(skillsList);
    }

    async GetBasicAPIData(){
        let subraceData;
        let subclassData;
        if(this.subRace != undefined){
            subraceData = await this.GetSubRaceData(this.subRace);
        }

        if(this.subClass != undefined){
            subclassData = await this.GetSubClassData(this.subClass);
        }
        this.SetData(subclassData, subraceData);
    }

    async GetSubClassData(subclass) {
        let subclassData = await fetch('https://www.dnd5eapi.co' + subclass.url);
        subclassData = await subclassData.json();
        return subclassData;
    }
    
    async GetSubRaceData(subrace) {
        let subraceData = await fetch('https://www.dnd5eapi.co' + subrace.url);
        subraceData = await subraceData.json();
        return subraceData;
    }
    
    SetData(subclassData, subraceData){
        this.subClass = subclassData;
        this.subRace = subraceData;
    }

    async SetABScores(skillsList) {
        let initialScores = new Array();
        initialScores.push(new AbilityScores("STR", 10, this.race, this.subRace));
        initialScores.push(new AbilityScores("DEX", 10, this.race, this.subRace));
        initialScores.push(new AbilityScores("CON", 10, this.race, this.subRace));
        initialScores.push(new AbilityScores("INT", 10, this.race, this.subRace));
        initialScores.push(new AbilityScores("WIS", 10, this.race, this.subRace));
        initialScores.push(new AbilityScores("CHA", 10, this.race, this.subRace));
        this.SetScores(initialScores);
        await this.SetSkillData(skillsList);
    }

    SetScores(scores){
        this.abScores = scores;
    }

    async SetSkillData(skillsList){
        let initialSkills = new Array();
        for(let skill of skillsList){
            initialSkills.push(new Skill(skill.name))
        }
        for(let skill of initialSkills){
            await skill.SetSkillModifier(skillsList,this.abScores);
        }
        this.SetSkills(initialSkills);
    }

    SetSkills(initialSkills){
        this.skills = initialSkills;
    }

    SetCombatStats() {

    }

    SaveCharacter(localStorage) {
        console.log(this.skills);
        let x = JSON.stringify(this);
        localStorage.setItem("test", x);
    }

    LoadCharacter() {
    }
}