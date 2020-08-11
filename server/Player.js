module.exports = class Player{
    constructor(socket){
        this.id = socket.id;
        this.username = socket.username;
        this.icon = socket.icon;
        this.color = socket.color;
        this.ready = false;
    }
}