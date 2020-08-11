<template>
  <v-container>
    <v-row>
      <v-col align="center" justify="center">
        <v-btn class="ma-2" text icon color="dark" @click="changeIcon('-')">
          <v-icon medium>mdi-arrow-left-drop-circle-outline</v-icon>
        </v-btn>
        <v-avatar :color="colors[color]">
          <v-icon large>{{ icons[icon] }}</v-icon>
        </v-avatar>
        <v-btn class="ma-2" text icon color="dark" @click="changeIcon('+')">
          <v-icon medium>mdi-arrow-right-drop-circle-outline</v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col align="center" justify="center">
        <v-btn class="ma-2" text icon color="dark" @click="changeColor('-')">
          <v-icon medium>mdi-arrow-left-drop-circle-outline</v-icon>
        </v-btn>
          <v-icon medium :color="colors[color]">mdi-circle</v-icon>
        <v-btn class="ma-2" text icon color="dark" @click="changeColor('+')">
          <v-icon medium>mdi-arrow-right-drop-circle-outline</v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <v-row justify="center">
        <v-col cols="6">
            <v-text-field
            v-model="username"
            :rules="nameRules"
            :counter="12"
            label="Nazwa użytkownika"
            required
          ></v-text-field>
        </v-col>
    </v-row>
    <v-row justify="center">
        <v-btn @click="playerJoin">DOŁĄCZ</v-btn>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      icons: [
        "mdi-account-circle",
        "mdi-account-hard-hat",
        "mdi-account-heart",
        "mdi-account-cowboy-hat",
        "mdi-dog",
        "mdi-face",
        "mdi-face-agent",
        "mdi-baby-face",
      ],
      colors: [
          'blue',
          'red',
          'pink',
          'purple',
          'deep-purple',
          'indigo',
          'teal',
          'green',
          'orange',
          'lime',
          'yellow',
      ],
      color: 0,
      icon: 0,
      username: '',
      nameRules: [
        v => !!v || 'Nazwa użytkownika jest wymagana',
        v => v.length <= 12 || 'Nzawa użytkownika musi być nie dluższa niż 12 znaków',
      ],
    };
  },
  methods: {
    changeIcon(val) {
      if (val === "+") {
        if (!this.icons[++this.icon]) this.icon = 0;
      } else if (val === "-") {
        if (!this.icons[--this.icon]) this.icon = this.icons.length - 1;
      }
    },
    changeColor(val) {
      if (val === "+") {
        if (!this.colors[++this.color]) this.color = 0;
      } else if (val === "-") {
        if (!this.colors[--this.color]) this.color = this.colors.length - 1;
      }
    },
    playerJoin(){
        let player = {};
        player.icon = this.icons[this.icon];
        player.color = this.colors[this.color];
        player.username = this.username;
        let name = this.$route.query.id;
        this.$socket.emit("playerJoin", {name, player});
    }
  },
};
</script>

<style></style>
