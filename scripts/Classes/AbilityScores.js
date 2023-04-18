// Class for ability scores
class AbilityScores {
    //Name of the ability score
    name;

    //Score value
    score;

    //The modifier of the ability score that is based on the scores value
    modifier;

    constructor(name, score, raceData, subraceData) {
        this.name = name;
        this.score = score;
        this.SetAbScores(raceData, subraceData);
    }

    //Sets the ability score value and adds any bonus if it is available
    SetAbScores(raceData, subraceData) {
        //Adds the bonuses from the characters race if the bonus matches the ability score
        for (let bonus of raceData.ability_bonuses) {
            if (this.name == bonus.ability_score.name) {
                this.score = parseInt(this.score, 10) + parseInt(bonus.bonus, 10);
            }
        }

        //Adds the bonuses from the characters subrace if the bonus matches the ability score and the character has a subrace
        if (subraceData != undefined) {
            for (let bonus of subraceData.ability_bonuses) {
                if (this.name == bonus.ability_score.name) {
                    this.score = parseInt(this.score, 10) + parseInt(bonus.bonus, 10);
                }
            }
        }

        // Description: Formula found for calculating ability score modifiers from this Roll20 article
        // Author: Roll20
        // URL: https://roll20.net/compendium/dnd5e/Ability%20Scores#content
        // Accessed: 13/04/2023
        this.modifier = Math.floor((this.score - 10) / 2);
    }
}