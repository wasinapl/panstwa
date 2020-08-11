<template>
  <v-container>
    <v-row>
      <v-col cols="2" align="start" justify="center">
        Liczba rund:
      </v-col>
      <v-col cols="5" align="start" justify="center">
        <v-btn class="ma-2" text icon color="green" @click="roundChange('-')" :disabled="!admin">
          <v-icon large>mdi-minus-circle</v-icon>
        </v-btn>
        {{ options.rounds }}
        <v-btn class="ma-2" text icon color="green" @click="roundChange('+')" :disabled="!admin">
          <v-icon large>mdi-plus-circle</v-icon>
        </v-btn>
      </v-col>
      <v-col cols="5" align="start" justify="center" v-if="admin">
        <v-btn class="ma-2" color="green" @click="copyLink">
          Skopiuj link
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-combobox
        v-model="options.categories"
        :items="items"
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
      items: [
        "Państwa",
        "Miasta",
        "Rzeki",
        "Imie",
        "Imie męskie",
        "Imie żeńskie",
        "Roślina",
        "Zwierze",
        "Rzecz",
        "Zawód",
        "Samochód",
      ],
      //categories: options.categories,
      search: null,
      //roundCount: options.rounds,
      roomId: "",
    };
  },
  sockets: {
      catChange(cat){
          this.options.categories = cat;
      },
      rndChange(rnd){
          this.options.rounds = rnd;
      }
  },
  methods: {
    roundChange(val) {
      if (val === "+") this.options.rounds++;
      else if (val === "-") {
        if (--this.options.rounds < 1) this.options.rounds = 1;
      }
    },
    copyLink() {},
  },
  watch: {
    categories(val) {
      this.search = "";
      if (val.length > 5) {
        this.$nextTick(() => this.categories.pop());
      }
    },
  },
};
</script>

<style></style>
