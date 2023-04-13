class AbilityScores{
    name;
    score;
    raceData;
    modifier;
    constructor(name, score, raceData){
        this.name = name;
        this.score = score;
        this.SetAbScores(raceData);
    }

    SetAbScores(raceData) {
        for (let bonus of raceData.ability_bonuses) {
            if(this.name == bonus.ability_score.name){
                this.score += bonus.bonus;
            }
        }
        if (this.subRace != null) {
            for (let bonus of this.subRace.ability_bonuses) {
                switch (bonus.ability_score.name) {
                    case "STR":
                        this.abScores[0] += bonus.bonus;
                        break;
                    case "DEX":
                        this.abScores[1] += bonus.bonus;
                        break;
                    case "CON":
                        this.abScores[2] += bonus.bonus;
                        break;
                    case "INT":
                        this.abScores[3] += bonus.bonus;
                        break;
                    case "WIS":
                        this.abScores[4] += bonus.bonus;
                        break;
                    case "CHA":
                        this.abScores[5] += bonus.bonus;
                        break;
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