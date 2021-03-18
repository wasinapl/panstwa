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
        <v-card flat>
          <v-card-text>
            <p>
              Fusce a quam. Phasellus nec sem in justo pellentesque facilisis.
              Nam eget dui. Proin viverra, ligula sit amet ultrices semper,
              ligula arcu tristique sapien, a accumsan nisi mauris ac eros. In
              dui magna, posuere eget, vestibulum et, tempor auctor, justo.
            </p>

            <p class="mb-0">
              Cras sagittis. Phasellus nec sem in justo pellentesque facilisis.
              Proin sapien ipsum, porta a, auctor quis, euismod ut, mi. Donec
              quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nam
              at tortor in tellus interdum sagittis.
            </p>
          </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs>
  </v-card>
</template>

<script>
import UserInfo from "./UserInfo";
import PasswordChange from "./PasswordChange";

export default {
  components: {UserInfo, PasswordChange},
};
</script>

<style></style>
