class Skill{
    name;
    skillData;
    modifier;
    constructor(name){
        this.name = name;
    }

    SetData(skillData, modifier){
        this.skillData = skillData;
        this.modifier = modifier;
    }

    async SetSkillModifier(skillList, abilityScores){
        let initialSkillData;
        let initialModifier;
        for(let skill of skillList){
            if (skill.name == this.name){
                await this.GetSkillData(skill).then(data => {
                    initialSkillData= data;
                })
            }
        }
        for(let score of abilityScores){
            if(score.name == initialSkillData.ability_score.name){
                initialModifier = score.modifier;
                break;
            }
        }
        this.SetData(initialSkillData, initialModifier);
    }

    async GetSkillData(skill) {
        let skillList = await fetch("https://www.dnd5eapi.co" + skill.url);
        skillList = await skillList.json();
        return skillList;
    }
}