<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <v-card>
      <v-card-title>
        <span class="headline">Hasło</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="10">
              <v-text-field
                label="Hasło"
                type="password"
                v-model="pass"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="3">
              <v-btn color="success" class="p-4" @click="create">OK</v-btn>
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
  props: ["password"],
  data: () => ({
    dialog: true,
    pass: "",
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
      if (this.password == this.pass) this.$emit("ok");
    },
  },
};
</script>

<style></style>
