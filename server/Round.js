module.exports = class Round{
    constructor(letter, players, categories){
        this.letter = letter;
        this.status = {};
        this.words = {};
        
        for (let i = 0; i < players.length; i++) {
            this.status[players[i].id] = {};
            this.words[players[i].id] = {};
            for (let j = 0; j < categories.length; j++) {
                this.status[players[i].id][categories[j]] = 0;
                this.words[players[i].id][categories[j]] = '';
            }
        }
    }
}