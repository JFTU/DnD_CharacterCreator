class AbilityScores{
    name;
    score;
    raceData;
    modifier;
    constructor(name, score, raceData, subraceData){
        this.name = name;
        this.score = score;
        this.SetAbScores(raceData, subraceData);
    }

    SetAbScores(raceData, subraceData) {
        for (let bonus of raceData.ability_bonuses) {
            if(this.name == bonus.ability_score.name){
                this.score = parseInt(this.score,10) + parseInt(bonus.bonus,10);
            }
        }

        if(subraceData != undefined){
            for (let bonus of subraceData.ability_bonuses) {
                if(this.name == bonus.ability_score.name){
                    this.score = parseInt(this.score,10) + parseInt(bonus.bonus,10);
                }
            }
        }

        // Description: Formula found for calculating ability score modifiers from this Roll20 article
        // Author: Roll20
        // URL: https://roll20.net/compendium/dnd5e/Ability%20Scores#:~:text=To%20determine%20an%20ability%20modifier,often%20than%20their%20associated%20scores.
        // Accessed: 13/04/2023
        this.modifier = Math.floor((this.score - 10)/2);
    }
}