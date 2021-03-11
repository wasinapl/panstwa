<template>
  <v-container>
    <v-row>
      <v-col>
        <v-progress-linear
          :buffer-value="progress"
          :value="progress"
          stream
          color="orange"
        ></v-progress-linear>
      </v-col>
    </v-row>
    <v-row style="height: 86px;">
      <v-col cols="4" align="center" justify="center">
        <h2 @click="timer">Czas: {{ time }}s</h2>
      </v-col>
      <v-col align="center" v-for="player in players" :key="player.id">
        <v-avatar :color="player.color">
          <v-icon dark>{{ player.icon }}</v-icon> </v-avatar
        ><br />
        {{ player.username }}
      </v-col>
    </v-row>
    <v-row
      v-for="(category, i) in categories"
      :key="category.id"
      align="center"
      style="height: 86px;"
    >
      <v-col cols="2">
        <h3>{{ category.name }}:</h3>
      </v-col>
      <v-col cols="2">
        <v-text-field
          :placeholder="letter"
          outlined
          solo
          hide-details
          :disabled="disabled"
          v-model="words[i]"
          @focus="focus(category.name)"
          @blur="blur(category.name, i)"
          @input="check($event, i)"
        >
        </v-text-field>
      </v-col>
      <v-col
        align="center"
        v-for="(state, index) in getStates(category.name)"
        v-bind:key="index"
      >
        <v-icon large :color="state.color">{{ state.icon }}</v-icon>
      </v-col>
    </v-row>
    <v-row>
      <v-col align="center" justify="center">
        <v-btn color="success" :disabled="disabledBtn" @click="done"
          >Gotowe</v-btn
        >
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Vue from "vue";

export default {
  props: ["playersG", "categoriesG", "letter"],
  data() {
    return {
      randomLetter: false,
      test: "mdi-domain",
      test2: true,
      roundTime: 60,
      progress: 0,
      time: 60,
      disabled: false,
      disabledBtn: true,
      words: [],
      states: {},
      icons: ["mdi-border-all-variant", "mdi-pencil", "mdi-check-outline"],
      colors: ["dark", "yellow darken-2", "green darken-2"],
      userid: "",
      players: [],
      categories: [],
    };
  },
  methods: {
    check(e, i) {
      if (e.charAt(0).toLowerCase() != this.letter.toLowerCase()) {
        setTimeout(() => {
          Vue.set(this.words, i, "");
        }, 20);
      }
    },
    focus(name) {
      this.$socket.emit("stateChange", { name, state: 1 });
    },
    blur(name, i) {
      if (this.words[i].length > 1) {
        this.checkWords();
        this.$socket.emit("stateChange", { name, state: 2 });
      } else this.$socket.emit("stateChange", { name, state: 0 });
    },
    timer() {
      if (this.time > 0) {
        this.time--;
        this.progress = 100 - Math.floor((this.time / this.roundTime) * 100);
        setTimeout(this.timer, 1000);
      }else {
        this.disabled = true;
        this.disabledBtn = true;
        this.$socket.emit("words", this.words);
      }
    },
    getStates(name) {
      return this.states[name];
    },
    checkWords() {
      for (let word of this.words) {
        if (word.length < 2) return;
      }
      this.disabledBtn = false;
    },
    done() {
      this.$socket.emit("time");
      this.disabled = true;
      this.disabledBtn = true;
    },
  },
  sockets: {
    stateChange({ data, from }) {
      const index = this.players.findIndex((el) => el.id == from);
      this.states[data.name][index] = {
        color: this.colors[data.state],
        icon: this.icons[data.state],
      };
      let color = this.players[0].color;
      this.players[0].color = "dark";
      this.players[0].color = color;
    },
    time(){
      this.time = 10;
    }
  },
  mounted() {
    this.userid = localStorage.getItem("socketid");
    const index = this.playersG.findIndex((el) => el.id == this.userid);
    this.players = this.playersG;
    this.categories = this.categoriesG;
    this.players.splice(index, 1);

    for (let i = 0; i < this.categories.length; i++) {
      this.words.push("");
      this.states[this.categories[i].name] = [];
      const count = this.players.length;
      for (let j = 0; j < count; j++)
        this.states[this.categories[i].name].push({
          color: this.colors[0],
          icon: this.icons[0],
        });
    }
    this.timer();
  },
};
</script>

<style></style>
