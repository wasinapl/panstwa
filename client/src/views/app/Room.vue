<template>
  <v-container fluid>
    <v-row align="center" justify="center">
      <v-col cols="7">
        <v-card class="ma-3 pa-6" outlined tile style="height: 90vh;">
          <v-row align="center" justify="center">
            <v-col cols="11">
              <WaitRoom
                v-if="waitRoom"
                :options="options"
                :admin="admin"
                :players="players"
              ></WaitRoom>
              <Round
                v-if="roundView"
                :round="round"
                :categories="categories"
                :players="playersG"
              ></Round>
              <Voting v-if="voting" :words="words"></Voting>
              <Results v-if="resultsView" :rounds="rounds" :table="table"/>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
      <v-col cols="3">
        <v-card class="ma-3 pa-6" outlined tile style="height: 90vh;">
          <v-row align="center" justify="center">
            <PlayersList :players="players"/>
          </v-row>
          <v-row align="center" justify="center">
            <Chat :players="players" :playerId="playerId"></Chat>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Chat from "../../components/Chat";
import WaitRoom from "../../components/Room/WaitRoom";
import Round from "../../components/Room/Round";
import Voting from "../../components/Room/Voting";
import Results from "../../components/Room/Results";
import PlayersList from "../../components/Room/PlayersList";

export default {
  components: {
    Chat,
    WaitRoom,
    Round,
    Voting,
    Results,
    PlayersList
  },
  data: () => ({
    roomId: "",
    playerId: '',
    loading: false,
    waitRoom: false,
    roundView: false,
    voting: false,
    resultsView:  false,
    options: {},
    players: [],
    playersG: [],
    categories: [],
    words: [],
    round: {},
    rounds: [],
    table: [],
    admin: false,
  }),
  sockets: {
    async roomExist(res) {
      if (!res) this.$router.push({ path: "/" });
      else {
        const player = await this.getUserInfo();
        this.$socket.emit("playerJoin", { id: this.roomId, player });
      }
    },
    waitRoom({ options, players, admin, playerId }) {
      this.options = options;
      this.players = players;
      this.playerId = playerId;
      this.waitRoom = true;
      this.admin = admin;
    },
    startGame(data) {
      this.waitRoom = false;
      this.playersG = data.players;
      this.categories = data.categories;
      this.round = data.round
      this.roundView = true;
    },
    nextRound(data){
      this.playersG = data.players;
      this.categories = data.categories;
      this.round = data.round;
      this.voting = false;
      this.roundView = true;
    },
    endGame({rounds, tab}){
      this.rounds = rounds;
      this.table = tab;
      this.voting = false;
      this.resultsView = true;
    },
    endGame2(data){
      console.log(data)
    },
    voting(words){
      this.roundView = false;
      this.words = words;
      this.voting = true;
    }
  },
  mounted() {
    this.loading = true;
    this.roomId = this.$route.query.id;
    this.$socket.emit("roomExist", this.roomId);
  },
  methods: {
    async getUserInfo() {
      try {
        const headers = this.$header();
        const response = await this.axios.get(this.$api + "/user/info", {
          headers,
        });
        return response.data.user;
      } catch (error) {
        console.log("error", error);
      }
    },
  },
  watch: {
    "options.categories": function(val) {
      if (this.admin) this.$socket.emit("catChange", val);
    },
    "options.rounds": function(val) {
      if (this.admin) this.$socket.emit("rndChange", val);
    },
    "options.players": function(val) {
      if (this.admin) this.$socket.emit("plyChange", val);
    },
  },
};
</script>

<style></style>
