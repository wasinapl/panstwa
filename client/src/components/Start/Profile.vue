<template>
  <v-card style="height: 70vh">
    <v-toolbar flat color="primary" dark>
      <v-toolbar-title>Profil użytkownika</v-toolbar-title>
    </v-toolbar>
    <v-tabs vertical>
      <v-tab>
        <v-icon left>
          mdi-account
        </v-icon>
        Profil
      </v-tab>
      <v-tab>
        <v-icon left>
          mdi-lock
        </v-icon>
        Hasło
      </v-tab>
      <v-tab>
        <v-icon left>
          mdi-align-vertical-bottom
        </v-icon>
        Statystyki
      </v-tab>

      <v-tab-item> 
        <UserInfo/>
      </v-tab-item>
      <v-tab-item>
        <PasswordChange/>
      </v-tab-item>
      <v-tab-item>
        <Statistics/>
      </v-tab-item>
    </v-tabs>
  </v-card>
</template>

<script>
import UserInfo from "./UserInfo";
import PasswordChange from "./PasswordChange";
import Statistics from "./Statistics";

export default {
  components: {UserInfo, PasswordChange, Statistics},
};
</script>

<style></style>
