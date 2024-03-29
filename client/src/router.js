import VueRouter from "vue-router";
import Start from "./views/app/Start";
import Room from "./views/app/Room";
import Login from "./views/auth/Login";

import Admin from "./views/app/Admin";
import Users from "./components/Admin/Users";
import User from "./components/Admin/User";
import Reports from "./components/Admin/Reports";

const routes = [
  { path: "/", component: Start },
  { path: "/room", component: Room },
  { path: "/login", component: Login },
  {
    name: "admin",
    path: "/admin",
    component: Admin,
    meta: {
      adminAuth: true,
    },
    children: [
      {
        name: "users",
        path: "users",
        component: Users,
      },
      {
        name: "user",
        path: "user/:id",
        component: User,
      },
      {
        name: "reports",
        path: "reports",
        component: Reports,
      },
    ],
  },
];

const router = new VueRouter({
  mode: "history",
  routes,
});

router.beforeEach((to, from, next) => {
  const publicPages = ["/login", "/register"];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem("user");
  const role = JSON.parse(localStorage.getItem("role"));

  if (authRequired && !loggedIn) {
    next({
      path: "/login",
      query: {
        nextUrl: to.fullPath,
      },
    });
  }
  if (to.meta.adminAuth) {
    if (role === "2") {
      next();
    } else {
      next("/");
    }
  }
  if (!authRequired && loggedIn) {
    next("/");
  } else {
    next();
  }
});
export default router;
