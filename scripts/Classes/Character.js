class Character{
    race;
    charClass;
    abScores;
    subClass;

    constructor(charClass, race, subClass){
        this.abScores = [1,2,3,4,5,6];
        this.race = race;
        this.charClass = charClass;
        this.subClass = subClass;
    }

    SetUpCharacter(){

    }

    SetABScores(){

    }

    SetCombatStats(){
        
    }

    SaveCharacter(){
        let x = JSON.stringify(this);
        console.log(x);
    }

    LoadCharacter(){
    }
}