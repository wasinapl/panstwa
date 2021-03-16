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

        <v-list>
          <v-list-item
            v-for="(item, i) in items"
            :key="i"
            @click="selectSection(item)"
          >
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-row>
  </v-container>
</template>

<script>
export default {
  props: ["players"],
  data() {
    return {
      items: [{ title: "Zgłoś" }, { title: "Wyrzuć" }],
    };
  },
  methods: {
    selectSection(item) {
      switch (item.title) {
        case "Zgłoś":
          console.log("Zgłoś");
          break;
        case "Wyrzuć":
          console.log("Wyrzuć");
          break;
      }
    },
  },
};
</script>

<style></style>
