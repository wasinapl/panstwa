<template>
  <v-container>
    <v-progress-linear
      :buffer-value="progress"
      :value="progress"
      stream
      color="orange"
    ></v-progress-linear>
    <transition name="fade" mode="out-in">
      <v-row
        align="center"
        justify="center"
        style="min-height: 90vh;"
        v-if="randomLetter"
      >
        <v-col>
          <RandomLetter
            v-if="randomLetter"
            :letter="letter"
            @end="randEnd"
          ></RandomLetter>
        </v-col>
      </v-row>
      <v-row v-if="!randomLetter">
        <v-row style="height: 86px;">
          <v-col cols="4" align="center" justify="center">
            <h2 @click="timer">Czas: {{ time }}s</h2>
          </v-col>
          <v-col align="center" v-for="player in playersG" :key="player.id">
            <v-avatar :color="player.color">
              <v-icon dark>{{ player.icon }}</v-icon> </v-avatar
            ><br />
            {{ player.username }}
          </v-col>
        </v-row>
        <v-row
          v-for="category in categories"
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
              v-model="category.text"
              @focus="focus(category.id)"
              @blur="blur(category.id)"
              @input="check($event, category.id)"
            >
            </v-text-field>
          </v-col>
          <v-col align="center">
            <v-icon large :color="colors[category.state]">{{
              icons[category.state]
            }}</v-icon>
          </v-col>
          <v-col align="center">
            <v-icon large :color="colors[category.state]">{{
              icons[category.state]
            }}</v-icon>
          </v-col>
          <v-col align="center">
            <v-icon large :color="colors[category.state]">{{
              icons[category.state]
            }}</v-icon>
          </v-col>
          <v-col align="center">
            <v-icon large :color="colors[category.state]">{{
              icons[category.state]
            }}</v-icon>
          </v-col>
        </v-row>
      </v-row>
    </transition>
  </v-container>
</template>

<script>
import RandomLetter from "./RandomLetter";

export default {
  props: ["playersG"],
  components: {
    RandomLetter,
  },
  data() {
    return {
      randomLetter: false,
      letter: "Z",
      test: "mdi-domain",
      test2: true,
      roundTime: 60,
      progress: 0,
      time: 60,
      icons: ["mdi-border-all-variant", "mdi-pencil", "mdi-check-outline"],
      colors: ["dark", "yellow darken-2", "green darken-2"],
      categories: [
        {
          id: 1,
          name: "Państwa",
          state: 0,
          text: "",
        },
        {
          id: 2,
          name: "Miasta",
          state: 0,
          text: "",
        },
        {
          id: 3,
          name: "Rzeki",
          state: 0,
          text: "",
        },
        {
          id: 4,
          name: "Imie",
          state: 0,
          text: "",
        },
        {
          id: 5,
          name: "Imie żeńskie",
          state: 0,
          text: "",
        },
      ],
    };
  },
  methods: {
    check(e, id) {
      if (e.charAt(0).toLowerCase() != this.letter.toLowerCase()) {
        setTimeout(() => {
          this.categories[id - 1].text = "";
        }, 10);
      }
    },
    randEnd() {
      this.randomLetter = false;
    },
    focus(id) {
      this.categories[id - 1].state = 1;
    },
    blur(id) {
      if (this.categories[id - 1].text.length > 1)
        this.categories[id - 1].state = 2;
      else this.categories[id - 1].state = 0;
    },
    timer() {
      if (this.time > 0) {
        this.time--;
        this.progress = 100 - Math.floor((this.time / this.roundTime) * 100);
        setTimeout(this.timer, 1000);
      }
    },
  },
};
</script>

<style></style>
