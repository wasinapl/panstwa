<template>
  <div>
    <v-btn @click="logInWithFacebook"> Login with Facebook</v-btn>
  </div>
</template>
<script>
export default {
  name: "facebookLogin",
  methods: {
    async logInWithFacebook() {
      await this.loadFacebookSDK(document, "script", "facebook-jssdk");
      await this.initFacebook();
      window.FB.login(
        function(response) {
          if (response.authResponse) {
            alert("You are logged in &amp; cookie set!");
            window.FB.api("/me", function(response) {
              console.log(response);
            });
          } else {
            alert("User cancelled login or did not fully authorize.");
          }
        },
        {
          scope: "email",
          return_scopes: true,
        }
      );
      return false;
    },
    async initFacebook() {
      window.fbAsyncInit = function() {
        window.FB.init({
          appId: "918010262274398", //You will need to change this
          cookie: true, // This is important, it's not enabled by default
          version: "v9.0",
        });
      };
    },
    async loadFacebookSDK(d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement(s);
      js.id = id;
      js.src = "https://connect.facebook.net/pl_PL/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    },
  },
};
</script>
<style>
.button {
  color: white;
  min-width: 150px;
  background-color: #000000a1;
  height: 2.5rem;
  border-radius: 2rem;
  font-weight: 400;
  font-size: 0.8rem;
}
</style>
