<template>
  <v-card flat>
    <v-alert dismissible type="success" v-show="message">{{ message }}</v-alert>
    <v-row v-if="!isLoading">
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
    <v-row v-if="!isLoading">
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
    <v-row justify="center" v-if="!isLoading">
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
    <v-row justify="center" v-if="!isLoading">
      <v-btn @click="save">Zapisz</v-btn>
    </v-row>
    <v-row justify="center" v-if="isLoading">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </v-row>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      icons: [],
      colors: [],
      color: 0,
      icon: 0,
      username: "",
      isLoading: true,
      message: "",
      nameRules: [
        (v) => !!v || "Nazwa użytkownika jest wymagana",
        (v) =>
          v.length <= 12 ||
          "Nzawa użytkownika musi być nie dluższa niż 12 znaków",
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
    async getUserInfo() {
      try {
        const headers = this.$header();
        const response = await this.axios.get(this.$api + "/user/info", {
          headers,
        });
        return response.data.user;
      } catch (error) {
        console.log("error", error);
      }
    },
    async getData() {
      try {
        const headers = this.$header();
        const response = await this.axios.get(this.$api + "/user/data", {
          headers,
        });
        return response.data.data;
      } catch (error) {
        console.log("error", error);
      }
    },
    async setUp() {
      const userInfo = await this.getUserInfo();
      const data = await this.getData();

      this.icons = data.icons;
      this.colors = data.colors;
      this.icon = userInfo.icon - 1;
      this.color = userInfo.color - 1;
      this.username = userInfo.username;
      this.isLoading = false;
    },
    save() {
      const headers = this.$header();
      this.axios
        .post(
          this.$api + "/user/info",
          {
            color: this.color + 1,
            icon: this.icon + 1,
            username: this.username,
          },
          { headers }
        )
        .then((response) => {
          this.message = response.data.message;
        })
        .catch((error) => {
          console.log("error", error);
        });
    },
  },
  mounted() {
    this.setUp();
  },
};
</script>

<style></style>
