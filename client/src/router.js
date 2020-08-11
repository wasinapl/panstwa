import VueRouter from "vue-router";
import Start from './components/Start';
import Room from './components/Room';


const routes = [
    { path: '/', component: Start },
    { path: '/room', component: Room }
  ]
  
  export default new VueRouter({
    routes
  })