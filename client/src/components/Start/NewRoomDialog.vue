<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <v-card>
      <v-card-title>
        <span class="headline">Nowy pokój</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="10">
              <v-text-field label="Nazwa pokoju" required v-model="name"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="3">
              <v-btn color="success" class="p-4" @click="create">Stwórz</v-btn>
            </v-col>
            <v-col cols="3">
              <v-btn color="primary" class="p-4" @click="close">Anuluj</v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data: () => ({
    dialog: true,
    name: ''
  }),
  dialog(val) {
    if (!val) {
      console.log("elo");
    }
  },
  methods: {
    close() {
      this.$emit("closed");
      this.dialog = false;
    },
    create() {
      this.$socket.emit("newGame", this.name);
    }
  },
};
</script>

<style></style>
