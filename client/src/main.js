import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import vuetify from "./plugins/vuetify";
import socketio from "socket.io-client";
import VueSocketIO from "vue-socket.io";
import VueRouter from "vue-router";
import VueAxios from "vue-axios";
import router from "./router";
import Axios from 'axios'
import authHeader from './services/auth-header';

Vue.use(VueRouter);

const SocketInstance = socketio('http://localhost:3000');
//const SocketInstance = socketio('http://145.239.90.114:3000');

SocketInstance.on("connect", () => {
  localStorage.setItem('socketid', SocketInstance.id)
})



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
Vue.use(VueAxios, Axios);
Vue.prototype.$header = authHeader;
Vue.prototype.$api = 'http://localhost:3030/api';
//Vue.prototype.$api = 'http://145.239.90.114:3030/api';

new Vue({
  store,
  vuetify,
  router,
  render: (h) => h(App),
}).$mount("#app");
