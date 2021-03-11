<template>
  <v-container fluid>
    <v-row align="center" justify="center">
      <v-col cols="8">
        <v-card class="ma-3 pa-6" outlined tile style="height: 90vh;">
          <v-row align="center" justify="center">
            <h1>PAŃSTWA MIASTA</h1>
          </v-row>

          <v-row align="center" justify="end">
            <v-btn style="margin: 30px;" @click="changeSite">{{
              btnName
            }}</v-btn>
            <v-btn style="margin: 30px;" @click="logout">wyloguj</v-btn>
          </v-row>
          <RoomList v-if="roomList"></RoomList>
          <Profile v-if="profile"></Profile>
        </v-card>
      </v-col>
    </v-row>
    
  </v-container>
</template>

<script>
import RoomList from "../../components/Start/RoomList";
import Profile from "../../components/Start/Profile";

export default {
  components: {
    RoomList,
    Profile,
  },
  data() {
    return {
      btnName: "Mój profil",
      roomList: true,
      profile: false
    };
  },
  sockets: {
    joinRoom(name) {
      this.$router.push({ path: "room", query: { id: name } });
    },
  },
  methods: {
    newGame() {
      this.$socket.emit("newGame", "xd");
    },
    logout() {
      this.$store.dispatch("auth/logout");
      this.$router.push("/login");
    },
    changeSite() {
      
      if (this.btnName == "Mój profil") {
        this.btnName = "pokoje";
        this.roomList = false;
        this.profile = true;
      } else {
        this.btnName = "Mój profil";
        this.roomList = true;
        this.profile = false;
      }
    },
  },
};
</script>

<style></style>
