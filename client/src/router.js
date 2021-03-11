import VueRouter from "vue-router";
import Start from "./views/app/Start";
// import Room from "./components/Room";
import Room from "./views/app/Room";
import Login from "./views/auth/Login";

const routes = [
  { path: "/", component: Start },
  { path: "/room", component: Room },
  { path: "/login", component: Login },
];

const router = new VueRouter({
  mode: "history",
  routes,
});

router.beforeEach((to, from, next) => {
  const publicPages = ["/login", "/register"];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem("user");

  if (authRequired && !loggedIn) {
    next("/login");
  }
  if (!authRequired && loggedIn) {
    next("/");
  } else {
    next();
  }
});
export default router;
