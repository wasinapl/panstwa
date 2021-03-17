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
                :time="options.time"
              ></Round>
              <Voting v-if="voting" :words="words"></Voting>
              <Results v-if="resultsView" :rounds="rounds" :table="table" />
            </v-col>
          </v-row>
        </v-card>
      </v-col>
      <v-col cols="3">
        <v-card class="ma-3 pa-6" outlined tile style="height: 90vh;">
          <v-row align="center" justify="center">
            <PlayersList v-if="waitRoom" :players="players" :admin="admin" :playerId="playerId"/>
          </v-row>
          <v-row align="center" justify="center">
            <Chat :players="players" :playerId="playerId"></Chat>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    <PasswordDialog
      v-if="dialog"
      @closed="back()"
      :password="pass"
      @ok="join()"
    />
  </v-container>
</template>

<script>
import Chat from "../../components/Chat";
import WaitRoom from "../../components/Room/WaitRoom";
import Round from "../../components/Room/Round";
import Voting from "../../components/Room/Voting";
import Results from "../../components/Room/Results";
import PlayersList from "../../components/Room/PlayersList";
import PasswordDialog from "../../components/Room/PasswordDialog";

export default {
  components: {
    Chat,
    WaitRoom,
    Round,
    Voting,
    Results,
    PlayersList,
    PasswordDialog,
  },
  data: () => ({
    roomId: "",
    playerId: "",
    loading: false,
    waitRoom: false,
    roundView: false,
    voting: false,
    resultsView: false,
    dialog: false,
    pass: "",
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
      this.round = data.round;
      this.roundView = true;
    },
    nextRound(data) {
      this.playersG = data.players;
      this.categories = data.categories;
      this.round = data.round;
      this.voting = false;
      this.roundView = true;
    },
    endGame({ rounds, tab }) {
      this.rounds = rounds;
      this.table = tab;
      this.voting = false;
      this.resultsView = true;
    },
    endGame2(data) {
      console.log(data);
    },
    voting(words) {
      this.roundView = false;
      this.words = words;
      this.voting = true;
    },
  },
  mounted() {
    this.checkRoom();
  },
  methods: {
    async checkRoom() {
      this.loading = true;
      this.roomId = this.$route.query.id;
      this.$socket.emit("roomExist", this.roomId, async (res) => {
        if (!res.exist) this.back();
        else {
          if (res.pass) {
            this.pass = res.pass;
            if (res.admin) this.join();
            else this.dialog = true;
          } else {
            this.join();
          }
        }
      });
    },
    async join() {
      this.dialog = false;
      const player = await this.getUserInfo();
      this.$socket.emit("playerJoin", { id: this.roomId, player });
    },
    back() {
      this.$router.push({ path: "/" });
    },
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
    "options.time": function(val) {
      if (this.admin) this.$socket.emit("timeChange", val);
    },
  },
};
</script>

<style></style>
