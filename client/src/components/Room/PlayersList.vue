<template>
  <v-container style="height: 208px;">
    <v-row>
      <v-menu
        offset-y
        transition="scale-transition"
        v-for="player in players"
        :key="player.id"
      >
        <template v-slot:activator="{ on, attrs }">
          <div v-bind="attrs" v-on="on" style="padding: 10px" align="center">
            <v-avatar :color="player.color">
              <v-icon dark>{{ player.icon }}</v-icon>
            </v-avatar>
            <br />
            {{ player.username }}
          </div>
        </template>

        <v-list v-if="playerId != player.id">
          <v-list-item
            v-for="(item, i) in items"
            :key="i"
            @click="selectSection(item, player)"
          >
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-row>
    <ReportDialog v-if="dialog" @ok="dialog = false" :message="message" />
  </v-container>
</template>

<script>
import ReportDialog from "./ReportDialog";

export default {
  props: ["players", "admin", "playerId"],
  components: { ReportDialog },
  data() {
    return {
      items: [],
      dialog: false,
      message: "",
    };
  },
  sockets: {
    kick(id){
      if(id == this.playerId)
      this.$router.push('/');
    }
  },
  methods: {
    selectSection(item, player) {
      const headers = this.$header();
      switch (item.title) {
        case "Zgłoś":
          console.log(item)
          this.axios
            .post(
              this.$api + "/user/report",
              {
                to: player.uuid,
              },
              { headers }
            )
            .then((res) => {
              this.message = res.data.message;
              this.dialog = true;
            })
            .catch((err) => {
              console.log(err.data.message);
            });

          break;
        case "Wyrzuć":
          this.$socket.emit("kick", player.id);
          break;
      }
    },
  },
  mounted() {
    if (this.admin) this.items = [{ title: "Zgłoś" }, { title: "Wyrzuć" }];
    else this.items = [{ title: "Zgłoś" }];
  },
};
</script>

<style></style>
