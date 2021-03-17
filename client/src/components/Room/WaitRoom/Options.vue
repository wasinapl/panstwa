<template>
  <v-container>
    <v-row style="height: 50px;">
      <v-col cols="2" align="start" justify="center" style="margin-top: 10px;">
        Liczba rund:
      </v-col>
      <v-col cols="3" align="start" justify="center">
        <v-btn
          class="ma-2"
          text
          icon
          color="green"
          @click="roundChange('-')"
          :disabled="!admin"
        >
          <v-icon large>mdi-minus-circle</v-icon>
        </v-btn>
        {{ options.rounds }}
        <v-btn
          class="ma-2"
          text
          icon
          color="green"
          @click="roundChange('+')"
          :disabled="!admin"
        >
          <v-icon large>mdi-plus-circle</v-icon>
        </v-btn>
      </v-col>
      <v-col cols="3" v-if="admin">
        <v-text-field
          v-model="link"
          outlined
          readonly
          dense
          style="margin: 8px"
          id="link"
        ></v-text-field>
      </v-col>
      <v-col cols="4" align="start" justify="center" v-if="admin">
        <v-btn class="ma-2" color="green" @click="copyLink">
          Skopiuj link
        </v-btn>
      </v-col>
    </v-row>
    <v-row style="height: 50px;">
      <v-col cols="2" align="start" justify="center" style="margin-top: 10px;">
        Liczba graczy:
      </v-col>
      <v-col cols="5" align="start" justify="center">
        <v-btn
          class="ma-2"
          text
          icon
          color="green"
          @click="playersChange('-')"
          :disabled="!admin"
        >
          <v-icon large>mdi-minus-circle</v-icon>
        </v-btn>
        {{ options.players }}
        <v-btn
          class="ma-2"
          text
          icon
          color="green"
          @click="playersChange('+')"
          :disabled="!admin"
        >
          <v-icon large>mdi-plus-circle</v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <v-row style="height: 50px;">
      <v-col cols="2" align="start" justify="center" style="margin-top: 10px;">
        Czas:
      </v-col>
      <v-col cols="2" align="start" justify="center">
        <v-select :disabled="!admin" v-model="options.time" :items="times" solo dense></v-select>
      </v-col>
    </v-row>
    <v-row>
      <v-combobox
        v-model="options.categories"
        :items="items"
        item-text="name"
        item-value="id"
        :search-input.sync="search"
        hide-selected
        hint="Maksimum 5 kategorii"
        label="Wybierz kategorie"
        multiple
        persistent-hint
        small-chips
        :disabled="!admin"
      >
        <template v-slot:no-data>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>
                Nie ma pasujących kategorii "<strong>{{ search }}</strong
                >". Wciśnij <kbd>enter</kbd> adby dodać
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-combobox>
    </v-row>
  </v-container>
</template>

<script>
export default {
  props: ["options", "admin"],
  data() {
    return {
      items: [],
      search: null,
      roomId: "",
      link: "",
      times: [],
    };
  },
  sockets: {
    catChange(cat) {
      this.options.categories = cat;
    },
    rndChange(rnd) {
      this.options.rounds = rnd;
    },
    plyChange(ply) {
      this.options.players = ply;
    },
    timeChange(time) {
      this.options.time = time;
    },
  },
  methods: {
    roundChange(val) {
      if (val === "+") this.options.rounds++;
      else if (val === "-") {
        if (--this.options.rounds < 1) this.options.rounds = 1;
      }
    },
    playersChange(val) {
      if (val === "+") {
        if (++this.options.players > 6) this.options.players = 6;
      } else if (val === "-") {
        if (--this.options.players < 2) this.options.players = 2;
      }
    },
    copyLink() {
      let linkToCopy = document.querySelector("#link");
      linkToCopy.select();
      document.execCommand("copy");
    },
    async getCategories() {
      try {
        const response = await this.axios.get(this.$api + "/categories");
        return response.data;
      } catch (error) {
        console.log("error", error);
      }
    },
    async setUp() {
      const categories = await this.getCategories();
      this.items = categories;
      this.isLoading = false;
      this.link = "http://localhost:8080" + this.$route.fullPath;
      for (let i = 60; i > 20; i -= 5) {
        this.times.push(i);
      }
    },
  },
  watch: {
    "options.categories"(val) {
      this.search = "";
      if (val.length > 5) {
        this.$nextTick(() => this.options.categories.pop());
      }
    },
  },
  mounted() {
    this.setUp();
  },
};
</script>

<style></style>
