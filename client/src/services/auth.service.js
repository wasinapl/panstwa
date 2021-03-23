import axios from "axios";

const API_URL = "http://localhost:3030/api/user/";
//const API_URL = "http://145.239.90.114:3030/api/user/";

class AuthService {
  login(user) {
    return axios
      .post(API_URL + "login", {
        email: user.email,
        password: user.password,
      })
      .then((response) => {
        if (response.data.user.token) {
          localStorage.setItem("user", JSON.stringify(response.data.user));
          localStorage.setItem("role", JSON.stringify(response.data.role));
        }

        return response.data;
      });
  }

  loginG(user) {
    return axios
      .post(API_URL + "loginG", {
        email: user.email,
        name: user.name,
      })
      .then((response) => {
        if (response.data.user.token) {
          localStorage.setItem("user", JSON.stringify(response.data.user));
          localStorage.setItem("role", JSON.stringify(response.data.role));
        }

        return response.data;
      });
  }

  auth(token) {
    return axios
      .get(API_URL + "auth", {headers: { 'x-access-token': token }})
      .then((response) => {
        if (response.data.user.token) {
          localStorage.setItem("user", JSON.stringify(response.data.user));
          localStorage.setItem("role", JSON.stringify(response.data.role));
        }
        return response.data;
      });
  }

  logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("role");
  }

  register(user) {
    return axios
      .post(API_URL + "register", {
        username: user.username,
        email: user.email,
        password: user.password,
      })
      .then((response) => {
        if (response.data.user.token) {
          localStorage.setItem("user", JSON.stringify(response.data.user));
          localStorage.setItem("role", JSON.stringify(response.data.role));
        }
        return response.data;
      });
  }
}

export default new AuthService();
