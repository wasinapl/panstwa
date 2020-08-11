<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-row
          align="center"
          justify="center"
          style="height: 100vh;"
        >
          <v-card
            class="ma-3 pa-6"
            shaped
            tile
          >
          <h1>PAŃSTWA MIASTA</h1><hr>
          <v-row
          align="center"
          justify="center"
        >
            <v-btn style="margin: 30px;" @click="newGame">Nowa gra</v-btn>
          </v-row>
          </v-card>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  sockets: {
    joinRoom(name){
      this.$router.push({ path: 'room', query: { id: name } })
    }
  },
  methods: {
    newGame(){
      this.$socket.emit('newGame', "xd");
    }
  }
};
</script>

<style></style>
