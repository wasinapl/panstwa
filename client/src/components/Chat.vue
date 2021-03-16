<template>
  <div class="chat-box">
    <v-container
      class="fill-height"
      style="overflow-y: scroll; height: 520px; max-height: 520px;"
      id="msgContainer"
    >
      <v-row class="fill-height pb-14" align="end">
        <v-col>
          <div
            v-for="(item, index) in chat"
            :key="index"
            :class="[
              'd-flex flex-row align-center my-2',
              item.from == playerId ? 'justify-end' : null,
            ]"
          >
            <span v-if="item.from == playerId" class="blue--text mr-3" style="display:block; word-break: break-word;">{{
              item.msg
            }}</span>
            <v-avatar :color="getColor(item.from)" size="25">
              <v-icon dark>{{ getIcon(item.from) }}</v-icon>
            </v-avatar>
            <span v-if="item.from != playerId" class="blue--text ml-3">{{
              item.msg
            }}</span>
          </div>
        </v-col>
      </v-row>
    </v-container>
    <v-container>
      <v-container class="ma-0 pa-0">
        <v-row no-gutters>
          <v-col>
            <div class="d-flex flex-row align-center">
              <v-text-field
                v-model="msg"
                placeholder="Type Something"
                @keypress.enter="send"
              ></v-text-field>
              <v-btn icon class="ml-4" @click="send"
                ><v-icon>mdi-send</v-icon></v-btn
              >
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-container>
  </div>
</template>

<script>
export default {
  props: ["players", "playerId"],
  data: () => ({
    chat: [],
    msg: null,
  }),
  methods: {
    send() {
      if (!this.msg) return;
      this.chat.push({
        from: this.playerId,
        msg: this.msg,
      });
      this.$socket.emit("msg", this.msg);
      this.msg = null;
      setTimeout(this.scroll, 50);
    },
    scroll() {
      var container = this.$el.querySelector("#msgContainer");
      container.scrollTop = container.scrollHeight;
    },
    getColor(id) {
      const player = this.players.find((el) => el.id == id);
      return player.color;
    },
    getIcon(id) {
      const player = this.players.find((el) => el.id == id);
      return player.icon;
    },
  },
  sockets: {
    msg({ msg, from }) {
      this.chat.push({
        from,
        msg,
      });
      setTimeout(this.scroll, 50);
    },
  },
};
</script>

<style>
.chat-box {
  width: 100%;
  padding: 12px;
  margin-right: auto;
  margin-left: auto;
}
</style>
