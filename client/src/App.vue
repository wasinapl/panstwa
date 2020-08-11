<template>
  <v-app fluid style="background-color: black;">
   <router-view></router-view>
  </v-app>
</template>

<script>

export default {
  name: "App",
  data: () => ({
    //
  }),

  sockets: {
    connect() {
      console.log("connect");
    },
  },
};
</script>
