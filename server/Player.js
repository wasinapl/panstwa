module.exports = class Player{
    constructor(socket, player, data){
        this.id = socket.id;
        this.username = player.username;
        this.uuid = player.uuid;
        this.icon = data.icons[player.icon - 1];
        this.color = data.colors[player.color - 1];
        this.ready = false;
    }
}