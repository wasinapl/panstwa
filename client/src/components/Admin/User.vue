<template>
  <v-container>
    <v-row>
      <v-col cols="3"
        ><h3>email: {{ user.email }}</h3></v-col
      >
      <v-col cols="3"
        ><h3>username: {{ user.username }}</h3></v-col
      >
      <v-col cols="3"
        ><h3>rola: {{ user.role_name }}</h3></v-col
      >
    </v-row>
    <v-row style="margin-top: 50px;">
      <v-col cols="3" class="table">
        Gry gracza:
        <v-row>
          <v-col>Nazwa</v-col>
          <v-col>Rundy</v-col>
          <v-col>Punkty</v-col>
        </v-row>
        <v-row v-for="(game, i) in games" :key="i">
          <v-col>{{ game.name }}</v-col>
          <v-col>{{ game.rounds }}</v-col>
          <v-col>{{ game.pkt }}</v-col>
        </v-row>
      </v-col>
      <v-col cols="3" class="table">
        Głosowania gracza:
        <v-row>
          <v-col>Wyraz</v-col>
          <v-col>Ocena</v-col>
        </v-row>
        <v-row v-for="(vote, i) in votes" :key="i">
          <v-col>{{ vote.word }}</v-col>
          <v-col>{{ vote.good }}</v-col>
        </v-row>
      </v-col>
      <v-col cols="3" class="table">
        Wyrazy użyte przez gracza:
        <v-row v-for="(word, i) in words" :key="i">
          <v-col>{{ word.word }}</v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      games: [],
      user: {},
      votes: [],
      words: [],
    };
  },
  async mounted() {
    try {
      const headers = this.$header();
      const response = await this.axios.post(
        this.$api + "/admin/userinfo",
        {
          id: this.$route.params.id,
        },
        {
          headers,
        }
      );
      console.log(response.data);
      this.games = response.data.games;
      this.user = response.data.user;
      this.votes = response.data.votes;
      this.words = response.data.words;
    } catch (error) {
      console.log("error", error);
    }
  },
};
</script>

<style>
.table {
  height: 400px;
  overflow-y: scroll;
}
</style>
