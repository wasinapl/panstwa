<template>
  <div>
    <v-tabs v-model="tab" background-color="deep-purple accent-2" centered dark>
      <v-tabs-slider></v-tabs-slider>

      <v-tab :href="'#tab-' + i" v-for="(cat, i) of categories" :key="cat.name">
        {{ cat.name }}
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item
        v-for="(cat, i) of categories"
        :key="cat.name"
        :value="'tab-' + i"
      >
        <v-row v-for="(player, ply) in cat.players" :key="player.id">
          <v-col align="center" justify="center" cols="2">
            <v-avatar :color="player.color">
              <v-icon dark>{{ player.icon }}</v-icon> </v-avatar
            ><br />
            {{ player.username }}
          </v-col>
          <v-col align="center" justify="center" cols="2">
            <v-text-field :value="player.word" solo readonly></v-text-field>
          </v-col>
          <v-col align="center" justify="center" cols="2">
            <v-btn
              :color="status[player.status].color"
              fab
              small
              @click="change(i, ply)"
            >
              <v-icon>{{ status[player.status].icon }}</v-icon>
            </v-btn>
          </v-col>
          <v-col align="center" justify="center" cols="3" style="margin-top:10px">
            <v-progress-linear :value="calc(player)" color="green" height="25" v-if="progress(player)">
              <template v-slot:default="{ value }">
                <strong>{{ Math.ceil(value) }}%</strong>
              </template>
            </v-progress-linear>
            <p v-if="check(player)">Brak danych</p>
          </v-col>
          <v-col align="center" justify="center" cols="3">
            <v-icon v-for="i of player.v" :key="i">{{ status[0].icon }}</v-icon>
            <v-icon v-for="i of player.x" :key="i">{{ status[1].icon }}</v-icon>
          </v-col>
        </v-row>
      </v-tab-item>
    </v-tabs-items>
    <v-row>
      <v-col align="center" justify="center" cols="12">
        <v-btn color="success" :disabled="btn" @click="ready">gotowe</v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import Vue from "vue";

export default {
  props: ["words"],
  data() {
    return {
      tab: null,
      btn: false,
      status: [
        {
          color: "success",
          icon: "mdi-check-bold",
        },
        {
          color: "error",
          icon: "mdi-close",
        },
      ],
      categories: [],
    };
  },
  sockets: {
    vote({ cat, ply, status }) {
      console.log({ cat, ply, status });
      Vue.set(this.categories[cat].players[ply], "x", status.x);
      Vue.set(this.categories[cat].players[ply], "v", status.v);
    },
  },
  methods: {
    change(cat, player) {
      if (!this.categories[cat].players[player].empty) {
        if (this.categories[cat].players[player].status == 1) {
          Vue.set(this.categories[cat].players[player], "status", 0);
          this.$socket.emit("vote", { cat, ply: player, status: 0 });
        } else {
          Vue.set(this.categories[cat].players[player], "status", 1);
          this.$socket.emit("vote", { cat, ply: player, status: 1 });
        }
      }
    },
    ready() {
      this.btn = true;
      this.$socket.emit("voteReady");
    },
    calc(pl) {
      return Math.round(((pl.vote_up + pl.vote_down) / pl.vote_up) * 10) / 10;
    },
    check(pl){
      if(!pl.votes) return false;
      if(pl.votes.vote_up + pl.votes.vote_down < 1) return true
      return false
    },
    progress(pl){
      if(!pl.votes) return false;
      if(pl.votes.vote_up + pl.votes.vote_down < 1) return false;
      return true;
    }
  },
  mounted() {
    this.categories = this.words;
  },
};
</script>

<style></style>
