//The class that defines a character
class Character {
    //The characters name
    name;

    //The characters race
    race;

    //The characters subrace
    subRace = null;

    //The characters class
    charClass;

    //The characters class features
    charClassFeatures = new Array();

    //The characters subclass
    subClass;

    //The characters ability scores
    abScores;

    //The characters skills
    skills;

    //The characters background
    background;

    //The characters bond which is based on the background
    bond;

    //The characters flaw which is based on the background
    flaw;

    //The characters ideal which is based on the background
    ideal;

    //The characters trait which is based on the background
    trait;

    //The characters spells
    spells;

    constructor(abScores, name, charClass, charClassFeatures, subClass, race, subRace, background, bond, flaw, ideal, trait, spells) {
        this.abScores = abScores;
        this.name = name;
        this.charClass = charClass;
        this.subClass = subClass;
        this.charClassFeatures = charClassFeatures;
        this.race = race;
        this.subRace = subRace;
        this.background = background;
        this.bond = bond;
        this.flaw = flaw;
        this.ideal = ideal;
        this.trait = trait;
        this.spells = spells;
    }

    //Async constructor that gets any extra data that is needed
    async Constructor(skillsList) {
        //Gets the subrace and subclass data if applicable
        await this.GetBasicAPIData();
        await this.SetABScores(skillsList);
    }

    async GetBasicAPIData() {
        let subraceData;
        let subclassData;
        //Checks if the character has a subrace then gets the data if they do
        if (this.subRace != undefined) {
            subraceData = await this.GetSubRaceData(this.subRace);
        }

        //Checks if the character has a subclass then gets the data if they do
        if (this.subClass != undefined) {
            subclassData = await this.GetSubClassData(this.subClass);
        }
        this.SetData(subclassData, subraceData);
    }

    //Fetches the subclass data from the API and converts it into a JavaScript object
    async GetSubClassData(subclass) {
        let subclassData = await fetch('https://www.dnd5eapi.co' + subclass.url);
        subclassData = await subclassData.json();
        return subclassData;
    }

    //Fetches the subrace data from the API and converts it into a JavaScript object
    async GetSubRaceData(subrace) {
        let subraceData = await fetch('https://www.dnd5eapi.co' + subrace.url);
        subraceData = await subraceData.json();
        return subraceData;
    }

    //Sets the subclass and subrace of the character
    SetData(subclassData, subraceData) {
        this.subClass = subclassData;
        this.subRace = subraceData;
    }

    //Sets up the ability scores of the player
    async SetABScores(skillsList) {
        let initialScores = new Array();
        //Adds the strength ability score to the array and sets the scores value
        initialScores.push(new AbilityScores("STR", this.abScores[0], this.race, this.subRace));
        //Adds the dexterity ability score to the array and sets the scores value
        initialScores.push(new AbilityScores("DEX", this.abScores[1], this.race, this.subRace));
        //Adds the constitution ability score to the array and sets the scores value
        initialScores.push(new AbilityScores("CON", this.abScores[2], this.race, this.subRace));
        //Adds the intelligence ability score to the array and sets the scores value
        initialScores.push(new AbilityScores("INT", this.abScores[3], this.race, this.subRace));
        //Adds the wisdom ability score to the array and sets the scores value
        initialScores.push(new AbilityScores("WIS", this.abScores[4], this.race, this.subRace));
        //Adds the charisma ability score to the array and sets the scores value
        initialScores.push(new AbilityScores("CHA", this.abScores[5], this.race, this.subRace));
        this.SetScores(initialScores);
        await this.SetSkillData(skillsList);
    }

    //Sets the global scores variable
    SetScores(scores) {
        this.abScores = scores;
    }

    //Sets the skill data of each skill in the list of skills
    async SetSkillData(skillsList) {
        let initialSkills = new Array();
        //Iterates through every skill in the skill list and adds a new skill to the local array with its name set
        for (let skill of skillsList) {
            initialSkills.push(new Skill(skill.name))
        }
        //Iterates through every skill in the local array and sets its modifier from the ability score
        for (let skill of initialSkills) {
            await skill.SetSkillModifier(skillsList, this.abScores);
        }
        this.SetSkills(initialSkills);
    }

    //Assigns the global variable skills
    SetSkills(initialSkills) {
        this.skills = initialSkills;
    }
}