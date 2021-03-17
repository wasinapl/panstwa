<template>
  <v-container fluid>
    <v-dialog v-model="dialog" persistent max-width="600px" min-width="360px">
      <div>
        <v-tabs
          v-model="tab"
          show-arrows
          background-color="blue darken-4"
          icons-and-text
          dark
          grow
        >
          <v-tabs-slider color="blue darken-4"></v-tabs-slider>
          <v-tab v-for="(i, idx) in tabs" :key="idx">
            <v-icon large>{{ i.icon }}</v-icon>
            <div class="caption py-1">{{ i.name }}</div>
          </v-tab>
          <v-tab-item>
            <v-card class="px-4" :loading="isSending">
              <v-card-text>
                <v-form
                  ref="loginForm"
                  v-model="valid"
                  lazy-validation
                  @submit.prevent
                >
                  <v-row>
                    <v-alert dismissible type="warning" v-if="loginMsg">{{
                      loginMsg
                    }}</v-alert>
                    <v-col cols="12">
                      <v-text-field
                        v-model="user.email"
                        :rules="loginEmailRules"
                        label="E-mail"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        v-model="user.password"
                        :append-icon="show1 ? 'eye' : 'eye-off'"
                        :rules="[rules.required, rules.min]"
                        :type="show1 ? 'text' : 'password'"
                        label="Hasło"
                        hint="Min 8 znaków"
                        counter
                        @click:append="show1 = !show1"
                      ></v-text-field>
                    </v-col>
                    <v-col class="d-flex" cols="12" sm="6" xsm="12"> </v-col>
                    <v-spacer></v-spacer>
                    <v-col class="d-flex" cols="5" sm="3" xsm="5">
                      <GoogleLogin
                        :params="params"
                        :renderParams="renderParams"
                        :onSuccess="onSuccess"
                        :onFailure="onFailure"
                      ></GoogleLogin>
                    </v-col>
                    <v-col class="d-flex" cols="12" sm="3" xsm="12" align-end>
                      <v-btn
                        x-large
                        block
                        :disabled="!valid"
                        color="primary"
                        @click="validateLogin"
                      >
                        Login
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item>
            <v-card class="px-4" :loading="isSending">
              <v-card-text>
                <v-form ref="registerForm" v-model="valid" lazy-validation>
                  <v-row>
                    <v-alert dismissible type="warning" v-if="registerMsg">{{
                      registerMsg
                    }}</v-alert>
                    <v-col cols="12">
                      <v-text-field
                        v-model="userRegister.username"
                        :rules="[rules.required]"
                        label="Nazwa użytkownika"
                        maxlength="20"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        v-model="userRegister.email"
                        :rules="emailRules"
                        label="E-mail"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        v-model="userRegister.password"
                        :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                        :rules="[rules.required, rules.min]"
                        :type="show1 ? 'text' : 'password'"
                        name="input-10-1"
                        label="Password"
                        hint="At least 8 characters"
                        counter
                        @click:append="show1 = !show1"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        block
                        v-model="verify"
                        :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                        :rules="[rules.required, passwordMatch]"
                        :type="show1 ? 'text' : 'password'"
                        name="input-10-1"
                        label="Confirm Password"
                        counter
                        @click:append="show1 = !show1"
                      ></v-text-field>
                    </v-col>
                    <v-spacer></v-spacer>
                    <v-col class="d-flex ml-auto" cols="12" sm="3" xsm="12">
                      <v-btn
                        x-large
                        block
                        :disabled="!valid"
                        color="primary"
                        @click="validateRegister"
                        >Register</v-btn
                      >
                    </v-col>
                  </v-row>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs>
      </div>
    </v-dialog>
  </v-container>
</template>

<script>
import User from "../../models/user";
import GoogleLogin from "vue-google-login";

export default {
  components: {
    GoogleLogin,
  },
  computed: {
    passwordMatch() {
      return () =>
        this.userRegister.password === this.verify ||
        "Hasła muszą być takie same";
    },
  },
  methods: {
    validateLogin() {
      if (this.$refs.loginForm.validate()) {
        (this.loginMsg = ""), (this.isSending = true);
        this.$store.dispatch("auth/login", this.user).then(
          () => {
            this.$router.push("/");
          },
          (error) => {
            this.loginMsg = error.response.data.message;
            this.isSending = false;
          }
        );
      }
    },
    validateRegister() {
      if (this.$refs.registerForm.validate()) {
        (this.registerMsg = ""), (this.isSending = true);
        this.$store.dispatch("auth/register", this.userRegister).then(
          () => {
            this.$router.push("/");
          },
          (error) => {
            this.registerMsg = error.response.data.message;
            this.isSending = false;
          }
        );
      }
    },
    onSuccess(googleUser) {
      let usr = {};
      usr.name = googleUser.getBasicProfile().bT;
      usr.email = googleUser.getBasicProfile().nt;

      this.$store.dispatch("auth/loginG", usr).then(
        () => {
          this.$router.push(this.$route.query.nextUrl);
        },
        (error) => {
          this.loginMsg = error.response.data.message;
          this.isSending = false;
        }
      );
    },
    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },
  },
  data: () => ({
    dialog: true,
    tab: 0,
    tabs: [
      { name: "Logowanie", icon: "mdi-account" },
      { name: "Rejestracja", icon: "mdi-account-outline" },
    ],
    valid: true,
    loginMsg: null,
    registerMsg: null,
    isSending: false,
    user: new User("", ""),
    userRegister: new User("", "", ""),
    verify: "",
    loginEmailRules: [
      (v) => !!v || "Wymagane",
      (v) => /.+@.+\..+/.test(v) || "E-mail musi być poprawny",
    ],
    emailRules: [
      (v) => !!v || "Wymagane",
      (v) => /.+@.+\..+/.test(v) || "E-mail musi być poprawny",
    ],

    show1: false,
    rules: {
      required: (value) => !!value || "Required.",
      min: (v) => (v && v.length >= 8) || "Min 8 znaków",
    },

    params: {
      client_id:
        "1058543881092-njmo74uat0kv7pekoi0521uokra6jpgc.apps.googleusercontent.com",
    },
    renderParams: {
      width: 130,
      height: 50,
      longtitle: false,
    },
  }),
};
</script>

<style></style>
