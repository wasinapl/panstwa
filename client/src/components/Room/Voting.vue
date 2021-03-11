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
            <v-text-field
              :value="player.word"
              label="Solo"
              solo
              readonly
            ></v-text-field>
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
          <v-col align="center" justify="center" cols="6">
              <v-icon v-for="i of player.v" :key="i">{{ status[0].icon }}</v-icon>
              <v-icon v-for="i of player.x" :key="i">{{ status[1].icon }}</v-icon>
          </v-col>
        </v-row>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
export default {
    props:["words"],
  data() {
    return {
      tab: null,
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
  methods: {
    change(cat, player) {
      if (this.categories[cat].players[player].status == 1)
        this.categories[cat].players[player].status = 0;
      else this.categories[cat].players[player].status = 1;
    },
  },
  mounted(){
      this.categories = this.words;
  }
};
</script>

<style></style>
