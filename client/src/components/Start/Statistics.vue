<template>
  <v-card flat>
    <v-row>
      <v-col cols="3">
        <v-card color="#385F73" dark v-if="!loading">
          <v-card-title class="headline">
            Liczba gier:
          </v-card-title>
          <v-card-subtitle><h1>20</h1></v-card-subtitle>
        </v-card>
        <v-skeleton-loader
          v-if="loading"
          v-bind="attrs"
          type="article"
        ></v-skeleton-loader>
      </v-col>
      <v-col cols="4">
        <v-card color="#1F7087" dark v-if="!loading">
          <v-card-title class="headline">
            Średnia ilość pkt na gre:
          </v-card-title>
          <v-card-subtitle><h1>125</h1></v-card-subtitle>
        </v-card>
        <v-skeleton-loader
          v-if="loading"
          v-bind="attrs"
          type="article"
        ></v-skeleton-loader>
      </v-col>
      <v-col cols="4">
        <v-card color="#952175" dark v-if="!loading">
          <v-card-title class="headline">
            Średnia ilość pkt na runde:
          </v-card-title>
          <v-card-subtitle><h1>55</h1></v-card-subtitle>
        </v-card>
        <v-skeleton-loader
          v-if="loading"
          v-bind="attrs"
          type="article"
        ></v-skeleton-loader>
      </v-col>
      <v-col cols="4">
        <v-card color="#067328" dark v-if="!loading">
          <v-card-title class="headline">
            Najlepsza kategoria:
          </v-card-title>
          <v-card-subtitle><h1>Imie damskie</h1></v-card-subtitle>
        </v-card>
        <v-skeleton-loader
          v-if="loading"
          v-bind="attrs"
          type="article"
        ></v-skeleton-loader>
      </v-col>
      <v-col cols="4">
        <v-card color="#067346" dark v-if="!loading">
          <v-card-title class="headline">
            Najlepsza litera:
          </v-card-title>
          <v-card-subtitle><h1>K</h1></v-card-subtitle>
        </v-card>
        <v-skeleton-loader
          v-if="loading"
          v-bind="attrs"
          type="article"
        ></v-skeleton-loader>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
        loading: true,
    };
  },
  methods: {},
};
</script>

<style></style>
