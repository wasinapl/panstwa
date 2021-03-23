<template>
  <v-container>
    <v-row>
      <v-col cols="3"
        ><h3 v-if="!edit">email: {{ user.email }}</h3>
        <v-text-field
          v-if="edit"
          label="Email"
          v-model="user.email"
          outlined
        ></v-text-field
      ></v-col>
      <v-col cols="3"
        ><h3 v-if="!edit">username: {{ user.username }}</h3>
        <v-text-field
          v-if="edit"
          label="Username"
          v-model="user.username"
          outlined
        ></v-text-field
      ></v-col>
      <v-col cols="3"
        ><h3 v-if="!edit">rola: {{ user.role_name }}</h3>
        <v-select
          v-if="edit"
          v-model="user.role"
          :items="items"
          label="Rola"
          item-text="name"
          item-value="val"
          outlined
        ></v-select
      ></v-col>
      <v-col cols="2">
        <v-btn color="primary" v-if="!edit" @click="edit = true">Edytuj</v-btn>
        <v-btn color="primary" v-if="edit" @click="save()">Zapisz</v-btn>
        <v-btn color="error" v-if="!banned" @click="ban()">Zbanuj</v-btn>
        <v-btn color="error" v-if="banned" @click="unban()">Odbanuj</v-btn>
      </v-col>
    </v-row>
    <v-row style="margin-top: 50px;" justify="space-around">
      <v-col cols="3" class="box">
        Gry gracza:
        <v-row>
          <v-col class="header">Nazwa</v-col>
          <v-col class="header">Rundy</v-col>
          <v-col class="header">Punkty</v-col>
        </v-row>
        <v-row>
          <v-col class="table">
            <v-row v-for="(game, i) in games" :key="i">
              <v-col>{{ game.name }}</v-col>
              <v-col>{{ game.rounds }}</v-col>
              <v-col>{{ game.pkt }}</v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="3" class="box">
        Głosowania gracza:
        <v-row>
          <v-col class="header">Wyraz</v-col>
          <v-col class="header">Ocena</v-col>
        </v-row>
        <v-row>
          <v-col class="table">
            <v-row v-for="(vote, i) in votes" :key="i">
              <v-col>{{ vote.word }}</v-col>
              <v-col>{{ vote.good }}</v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="2" class="box">
        Wyrazy użyte przez gracza:
        <v-row>
          <v-col class="table">
            <v-row v-for="(word, i) in words" :key="i">
              <v-col>{{ word.word }}</v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="2" class="box">
        Wiadomości gracza:
        <v-row>
          <v-col class="table">
            <v-row v-for="(message, i) in messages" :key="i">
              <v-col>{{ message.message }}</v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <Dialog :message="message" v-if="dialog" @ok="dialog = false" />
  </v-container>
</template>

<script>
import Dialog from "../Room/ReportDialog";

export default {
  components: { Dialog },
  data() {
    return {
      games: [],
      user: {},
      votes: [],
      words: [],
      messages: [],
      banned: null,
      edit: false,
      dialog: false,
      items: [
        { name: "User", val: 1 },
        { name: "Admin", val: 2 },
      ],
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
      this.games = response.data.games;
      this.user = response.data.user;
      this.votes = response.data.votes;
      this.words = response.data.words;
      this.messages = response.data.messages;
      this.banned = response.data.banned;
    } catch (error) {
      console.log("error", error);
    }
  },
  methods: {
    save() {
      this.edit = false;
      const headers = this.$header();
      this.axios
        .post(
          this.$api + "/admin/update",
          {
            user: this.user,
          },
          { headers }
        )
        .catch((error) => {
          console.log("error", error);
        });
    },
    ban() {
      const headers = this.$header();
      this.axios
        .post(
          this.$api + "/admin/ban",
          {
            id: this.user.id,
          },
          { headers }
        )
        .then((response) => {
          this.message = response.data.message;
          this.dialog = true;
          this.banned = true;
        })
        .catch((error) => {
          console.log("error", error);
        });
    },
    unban() {
      const headers = this.$header();
      this.axios
        .post(
          this.$api + "/admin/unban",
          {
            id: this.user.id,
          },
          { headers }
        )
        .then((response) => {
          this.message = response.data.message;
          this.dialog = true;
          this.banned = false;
        })
        .catch((error) => {
          console.log("error", error);
        });
    },
  },
};
</script>

<style>
.table {
  height: 400px;
  overflow-y: scroll;
}

.box {
  border: 1px solid #000;
}

.header {
  border-bottom: 1px solid #000;
  border-right: 1px solid #000;
  border-top: 1px solid #000;
}
</style>
