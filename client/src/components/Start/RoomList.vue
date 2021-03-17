<template>
  <v-data-table
    :headers="headers"
    :items="desserts"
    :search="search"
    :footer-props="{
      'items-per-page-options': [10],
    }"
    sort-by="name"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Lista pokoi</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Szukaj"
          single-line
          hide-details
        ></v-text-field>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-btn color="primary" dark class="mb-2" @click="dialog = true">
          Nowy pokój
        </v-btn>
        <NewRoomDialog v-if="dialog" @closed="dialog = false"></NewRoomDialog>
      </v-toolbar>
    </template>
    <template v-slot:item.pass="{ item }">
      <v-icon v-if="item.pass">mdi-lock</v-icon>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-btn color="success" @click="join(item.id)" small>Dołącz</v-btn>
    </template>
  </v-data-table>
</template>

<script>
import NewRoomDialog from "./NewRoomDialog";

export default {
  components: { NewRoomDialog },
  data: () => ({
    dialog: false,
    headers: [
      {
        text: "Nazwa",
        align: "start",
        sortable: true,
        value: "name",
      },
      {
        text: "Miejsca",
        value: "slots",
        align: "start",
      },
      {
        text: "Hasło",
        value: "pass",
        align: "start",
      },
      { text: "Actions", value: "actions", sortable: false },
    ],
    search: "",
    desserts: [],
  }),
  mounted() {
    this.initialize();
  },
  sockets: {
    roomList(list) {
      this.desserts = list;
    },
  },
  methods: {
    initialize() {
      this.$socket.emit("roomList", (response) => {
        this.desserts = response;
      });
    },
    join(id) {
      this.$router.push({ path: "room", query: { id } });
    },
  },
};
</script>

<style></style>
