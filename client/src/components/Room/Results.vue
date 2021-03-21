<template>
  <div>
    <v-simple-table>
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">
              Nazwa
            </th>
            <th class="text-left"></th>
            <th class="text-left">
              Punkty
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(player, i) in players" :key="player.uuid">
            <td>
              <v-avatar size="25" :color="player.color"
                ><v-icon>
                  {{ player.icon }}
                </v-icon></v-avatar
              >
              {{ player.username }}
            </td>
            <td>
              <v-icon color="green darken-2" @click="up(player.uuid, i)">{{
                player.up
              }}</v-icon>
              <v-icon color="red darken-2" @click="down(player.uuid, i)">{{
                player.down
              }}</v-icon>
            </td>
            <td>{{ player.pkt }}</td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </div>
</template>

<script>
import Vue from "vue";

export default {
  props: ["table", "rounds"],
  data() {
    return {
      iconsUp: ["mdi-thumb-up-outline", "mdi-thumb-up"],
      iconsDown: ["mdi-thumb-down-outline", "mdi-thumb-down"],
      players: [],
    };
  },
  methods: {
    up(id, i) {
      Vue.set(this.players[i], "up", "mdi-thumb-up");
      Vue.set(this.players[i], "down", "mdi-thumb-down-outline");
      this.refresh(i);
      this.rate(id, true);
    },
    down(id, i) {
      Vue.set(this.players[i], "up", "mdi-thumb-up-outline");
      Vue.set(this.players[i], "down", "mdi-thumb-down");
      this.refresh(i);
      this.rate(id, false);
    },
    refresh(i) {
      let x = this.players[i].pkt;
      this.players[i].pkt = 0;
      this.players[i].pkt = x;
    },
    rate(id, val) {
      const headers = this.$header();
      this.axios
        .post(
          this.$api + "/user/rate",
          {
            to: id,
            value: val,
          },
          { headers }
        )
        .then(() => {})
        .catch((err) => {
          console.log(err.data.message);
        });
    },
  },
  mounted() {
    this.players = this.table;
    this.players.sort((a, b) => {
      if (a.pkt > b.pkt) return -1;
      if (a.pkt < b.pkt) return 1;
      return 0;
    });
    this.players.forEach((el) => {
      el.up = "mdi-thumb-up-outline";
      el.down = "mdi-thumb-down-outline";
    });
  },
};
</script>

<style></style>
