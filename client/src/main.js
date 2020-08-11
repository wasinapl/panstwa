import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import vuetify from "./plugins/vuetify";
import socketio from "socket.io-client";
import VueSocketIO from "vue-socket.io";
import VueRouter from "vue-router";
import router from "./router";

Vue.use(VueRouter);

const SocketInstance = socketio("http://localhost:3000");

Vue.use(
  new VueSocketIO({
    debug: true,
    connection: SocketInstance, //options object is Optional
    vuex: {
      store,
      actionPrefix: "SOCKET_",
      mutationPrefix: "SOCKET_",
    },
  })
);

Vue.config.productionTip = false;

new Vue({
  vuetify,
  router,
  render: (h) => h(App),
}).$mount("#app");
