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
  async mounted() {
    const user = JSON.parse(localStorage.getItem("user"));
    try {
      await this.$store.dispatch("auth/auth", user.token);  
    } catch (error) {
      console.log(error);
      this.$router.push("/login");
    }
  },
};
</script>
