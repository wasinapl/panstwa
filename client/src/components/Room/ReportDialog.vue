<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <v-card>
      <v-card-title>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row align="center" justify="center" style="margin-bottom: 15px;"> 
              <h3>{{ message }}</h3>
          </v-row>
          <v-row align="center" justify="center">
            <v-btn color="success" class="p-4" @click="ok">OK</v-btn>
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: ["message"],
  data: () => ({
    dialog: true,
    pass: "",
  }),
  methods: {
    ok() {
      this.$emit("ok");
      this.dialog = false;
    },
  },
};
</script>

<style></style>
