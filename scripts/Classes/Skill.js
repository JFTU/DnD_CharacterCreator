//The class that defines a skill
class Skill {
    //The name of the skill
    name;

    //The API data for the skill
    skillData;

    //The modifier value for the skill
    modifier;
    constructor(name) {
        this.name = name;
    }

    //Sets the global variables for the skill
    SetData(skillData, modifier) {
        this.skillData = skillData;
        this.modifier = modifier;
    }

    //Sets the skill modifier
    async SetSkillModifier(skillList, abilityScores) {
        let initialSkillData;
        let initialModifier;

        //Iterates through the skill list and sets the skill data for the skill
        for (let skill of skillList) {
            if (skill.name == this.name) {
                await this.GetSkillData(skill).then(data => {
                    initialSkillData = data;
                })
            }
        }

        //Iterates through the ability modifiers and sets the modifier to the right ability modifier
        for (let score of abilityScores) {
            if (score.name == initialSkillData.ability_score.name) {
                initialModifier = score.modifier;
                break;
            }
        }
        this.SetData(initialSkillData, initialModifier);
    }

    //Fetches the skill data for the current skill
    async GetSkillData(skill) {
        let skillList = await fetch("https://www.dnd5eapi.co" + skill.url);
        skillList = await skillList.json();
        return skillList;
    }
}