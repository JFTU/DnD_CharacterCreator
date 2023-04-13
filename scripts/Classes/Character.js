class Character {
    race;
    subRace = null;

    charClass;
    subClass;

    abScores;
    skills;

    constructor(charClass, subClass, race, subRace) {
        this.charClass = charClass;
        this.subClass = subClass;
        this.race = race;
        this.subRace = subRace;
    }

    async SetABScores(skillsList) {
        let initialScores = new Array();
        initialScores.push(new AbilityScores("STR", 10, this.race));
        initialScores.push(new AbilityScores("DEX", 10, this.race));
        initialScores.push(new AbilityScores("CON", 10, this.race));
        initialScores.push(new AbilityScores("INT", 10, this.race));
        initialScores.push(new AbilityScores("WIS", 10, this.race));
        initialScores.push(new AbilityScores("CHA", 10, this.race));
        this.SetScores(initialScores);
        await this.SetSkillData(skillsList);
    }

    async Constructor(skillsList){
        await this.SetABScores(skillsList);
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