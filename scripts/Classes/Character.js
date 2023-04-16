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
    bond;
    flaw;
    ideal;
    trait;

    spells;

    constructor(abScores, charClass, subClass, race, subRace, background, bond, flaw, ideal, trait) {
        this.abScores = abScores;
        this.charClass = charClass;
        this.subClass = subClass;
        this.race = race;
        this.subRace = subRace;
        this.background = background;
        this.bond = bond;
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
        initialScores.push(new AbilityScores("STR", this.abScores[0], this.race, this.subRace));
        initialScores.push(new AbilityScores("DEX", this.abScores[1], this.race, this.subRace));
        initialScores.push(new AbilityScores("CON", this.abScores[2], this.race, this.subRace));
        initialScores.push(new AbilityScores("INT", this.abScores[3], this.race, this.subRace));
        initialScores.push(new AbilityScores("WIS", this.abScores[4], this.race, this.subRace));
        initialScores.push(new AbilityScores("CHA", this.abScores[5], this.race, this.subRace));
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
        let x = JSON.stringify(this);
        localStorage.setItem("test", x);
    }

    LoadCharacter() {
    }
}