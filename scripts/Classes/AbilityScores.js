class AbilityScores{
    score;
    constructor(characterClass, proficencyBonus, score){
        this.score = score + characterClass + proficencyBonus; 
    }

    SetAbScores(characterRace, proficencyBonus, score) {
        this.score = score + characterRace + proficencyBonus; 
    }
}