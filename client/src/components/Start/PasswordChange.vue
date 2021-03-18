<template>
  <v-card flat>
    <v-alert dismissible type="success" v-show="message">{{ message }}</v-alert>
    <v-alert dismissible type="error" v-show="message_err">{{ message_err }}</v-alert>
    <v-form ref="passwordForm" v-model="valid" lazy-validation>
      <v-row justify="center">
        <v-col cols="6">
          <v-text-field
            v-model="lastPass"
            :rules="[rules.required, rules.min]"
            :type="show1 ? 'text' : 'password'"
            @click:append="show1 = !show1"
            :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
            label="Stare hasło"
            counter
            required
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col cols="6">
          <v-text-field
            v-model="password"
            :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
            :rules="[rules.required, rules.min]"
            :type="show1 ? 'text' : 'password'"
            name="input-10-1"
            label="Password"
            hint="Min 8 znaków"
            counter
            @click:append="show1 = !show1"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col cols="6">
          <v-text-field
            block
            v-model="verify"
            :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
            :rules="[rules.required, passwordMatch]"
            :type="show1 ? 'text' : 'password'"
            name="input-10-1"
            label="Potwierdź hasło"
            counter
            @click:append="show1 = !show1"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-btn @click="change" :disabled="isLoading">Zapisz</v-btn>
      </v-row>
    </v-form>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      lastPass: "",
      password: "",
      verify: "",
      show1: false,
      valid: false,
      message: "",
      message_err: "",
      isLoading: false,

      rules: {
        required: (value) => !!value || "Required.",
        min: (v) => (v && v.length >= 8) || "Min 8 znaków",
      },
    };
  },
  computed: {
    passwordMatch() {
      return () =>
        this.password === this.verify || "Hasła muszą być takie same";
    },
  },
  methods: {
    change() {
      if (this.$refs.passwordForm.validate()) {
        this.isLoading = true;
        const headers = this.$header();
        this.axios
          .post(
            this.$api + "/user/password",
            {
              lastPass: this.lastPass,
              newPass: this.password,
            },
            { headers }
          )
          .then((res) => {
            this.isLoading = false;
            this.message = res.data.message;
          })
          .catch((err) => {
            this.isLoading = false;
            this.message_err = err.response.data.message;
          });
      }
    },
  },
};
</script>

<style></style>
