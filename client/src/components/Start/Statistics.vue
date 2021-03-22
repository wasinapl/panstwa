<template>
  <v-card flat>
    <v-row style="margin-left: 10px;">
      <v-col cols="3">
        <v-card color="#385F73" dark v-if="!loading">
          <v-card-title class="headline">
            Liczba gier:
          </v-card-title>
          <v-card-subtitle><h1>{{ data.games }}</h1></v-card-subtitle>
        </v-card>
        <v-skeleton-loader v-if="loading" type="article"></v-skeleton-loader>
      </v-col>
      <v-col cols="5">
        <v-card color="#952175" dark v-if="!loading">
          <v-card-title class="headline">
            Średnia ilość pkt na runde:
          </v-card-title>
          <v-card-subtitle><h1>{{ data.average }}</h1></v-card-subtitle>
        </v-card>
        <v-skeleton-loader v-if="loading" type="article"></v-skeleton-loader>
      </v-col>
      <v-col cols="4">
        <v-card color="#067328" dark v-if="!loading">
          <v-card-title class="headline">
            Najlepsza kategoria:
          </v-card-title>
          <v-card-subtitle><h1>{{ data.category }}</h1></v-card-subtitle>
        </v-card>
        <v-skeleton-loader v-if="loading" type="article"></v-skeleton-loader>
      </v-col>
      <v-col cols="4">
        <v-card color="#067346" dark v-if="!loading">
          <v-card-title class="headline">
            Najlepsza litera:
          </v-card-title>
          <v-card-subtitle><h1>{{ data.letter }}</h1></v-card-subtitle>
        </v-card>
        <v-skeleton-loader v-if="loading" type="article"></v-skeleton-loader>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      loading: true,
      data: {}
    };
  },
  async mounted() {
    const headers = this.$header();
    this.axios
      .get(
        this.$api + "/user/statistics",
        { headers }
      )
      .then((response) => {
        this.data = response.data;
        console.log(response.data)
        this.loading = false;
      })
      .catch((error) => {
        console.log("error", error);
      });
  },
};
</script>

<style></style>
