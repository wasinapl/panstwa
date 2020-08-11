<template>
  <v-container>
    Gracze:
    <v-row>
      <div
        style="padding: 10px"
        align="center"
        v-for="player in players"
        :key="player.id"
      >
        <v-badge
          :value="player.ready"
          bordered
          color="green"
          icon="mdi-check-outline"
          overlap
          transition="fade-transition"
        >
          <v-avatar :color="player.color">
            <v-icon dark>{{ player.icon }}</v-icon>
          </v-avatar> </v-badge
        ><br />
        {{ player.username }}
      </div>
    </v-row>
    <v-row>
      <v-col align="center" justify="center">
        <v-btn @click="ready" :color="readyPl ? 'green' : 'primary'">Gotowy</v-btn>
        <v-btn @click="start" :disabled="!allReady" v-if="admin">Start</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  props: ["players", "admin"],
  sockets: {
    playerJoin({ player }) {
      this.players.push(player);
    },
    playerLeft(id) {
      let index = this.players.findIndex((p) => p.id == id);
      this.players.splice(index, 1);
    },
    playerRdy(id){
      let index = this.players.findIndex((p) => p.id == id);
      this.players[index].ready = !this.players[index].ready;
      this.allReadyCheck();
    }
  },
  data() {
    return {
      readyPl: false,
      allReady: false
    };
  },
  methods: {
    ready(){
      this.readyPl = !this.readyPl; 
      this.$socket.emit("playerRdy");
    },
    allReadyCheck(){
      var readyCount = 0;
      for(let i = 0; i < this.players.length; i++){
        if(this.players[i].ready) readyCount++;
      }
      console.log(readyCount);
      if(readyCount == this.players.length) this.allReady = true;
      else this.allReady = false;
    },
    start(){
      this.$socket.emit("startGame");
    }
  },
};
</script>

<style></style>
