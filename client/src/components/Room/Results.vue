<template>
  <div>
    <v-simple-table>
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">
              Nazwa
            </th>
            <th class="text-left"></th>
            <th class="text-left">
              Punkty
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="player in table" :key="player.uuid">
            <td>
              <v-avatar size="25" :color="player.color"
                ><v-icon>
                  {{ player.icon }}
                </v-icon></v-avatar
              >
              {{ player.username }}
            </td>
            <td>
              <v-icon color="green darken-2">mdi-thumb-up-outline</v-icon>
              <v-icon color="red darken-2">mdi-thumb-down</v-icon>
            </td>
            <td>{{ player.pkt }}</td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </div>
</template>

<script>
export default {
  props: ["table", "rounds"],
  data() {
    return {};
  },
  mounted() {
    this.table.sort((a, b) => {
      if (a.pkt > b.pkt) return -1;
      if (a.pkt < b.pkt) return 1;
      return 0;
    });
  },
};
</script>

<style></style>
