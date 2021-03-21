<template>
  <v-container>
    <v-row>
      <v-col cols="2">
        <v-text-field v-model="name" label="Nazwa" required></v-text-field>
      </v-col>
      <v-col><v-btn color="success" @click="search()">Szukaj</v-btn></v-col>
    </v-row>
    <v-row v-for="user in users" :key="user.id" class="user" @click="go(user.id)">
        <v-col>{{ user.username }}</v-col>
        <v-col>{{ user.email }}</v-col>
        <v-col>{{ user.role_name }}</v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      name: "",
      users: [],
    };
  },
  methods: {
    async search() {
      try {
        const headers = this.$header();
        const response = await this.axios.post(
          this.$api + "/admin/searchuser",
          {
            name: this.name,
          },
          {
            headers,
          }
        );
        this.users = response.data
      } catch (error) {
        console.log("error", error);
      }
    },
    go(id){
        this.$router.push({ name: 'user', params: { id } })
    }
  },
};
</script>

<style>

.user{
    margin: 5px;
    cursor: pointer;
}

.user:hover{
    background-color: gray;
}

</style>
