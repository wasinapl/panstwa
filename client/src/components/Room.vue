<template>
  <v-container fluid>
    <v-row align="center" justify="center">
      <v-col cols="6">
        <v-card class="ma-3 pa-6" default tile :loading="loading">
          <NewPlayer v-if="newPlayer"></NewPlayer>
          <WaitRoom v-if="waitRoom" :options="options" :admin="admin" :players="players"></WaitRoom>
          <Round v-if="round" :playersG="playersG"></Round>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import NewPlayer from "./Room/NewPlayer";
import Round from "./Room/Round";
import WaitRoom from "./Room/WaitRoom";

export default {
  components: {
    NewPlayer,
    Round,
    WaitRoom
  },
  data: () => ({
    roomId: "",
    loading: false,
    waitRoom: false,
    newPlayer: false,
    round: false,
    options: {},
    players: [],
    playersG: [],
    admin: false,
  }),
  sockets: {
    roomExist(res) {
      console.log(res);
      if (res) {
        this.newPlayer = true;
        this.loading = false;
      } else this.$router.push({ path: "/" });
    },
    waitRoom({ options, players, admin }) {
      this.options = options;
      this.players = players;
      this.newPlayer = false;
      this.waitRoom = true;
      this.admin = admin;
    },
    startGame(data){
      this.waitRoom = false;
      this.playersG = data.players;
      console.log(this.playersG)
      this.round = true;
      console.log(data);
    }
  },
  mounted() {
    this.loading = true;
    this.roomId = this.$route.query.id;
    this.$socket.emit("roomExist", this.roomId);
  },
  watch: {
    "options.categories": function(val) {
      if (this.admin) this.$socket.emit("catChange", val);
    },
    "options.rounds": function(val) {
      if (this.admin) this.$socket.emit("rndChange", val);
    },
  },
};
</script>

<style></style>
