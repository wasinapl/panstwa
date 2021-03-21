import AuthService from '../services/auth.service';

const user = JSON.parse(localStorage.getItem('user'));
const initialState = user
  ? { status: { loggedIn: true }, user }
  : { status: { loggedIn: false }, user: null };

export const auth = {
  namespaced: true,
  state: initialState,
  actions: {
    login({ commit }, user) {
      return AuthService.login(user).then(
        (data)=> {
          commit('loginSuccess', data);
          return Promise.resolve(data.user);
        },
        error => {
          commit('loginFailure');
          return Promise.reject(error);
        }
      );
    },
    loginG({ commit }, user) {
      return AuthService.loginG(user).then(
        (data) => {
          commit('loginSuccess', data);
          return Promise.resolve(data.user);
        },
        error => {
          commit('loginFailure');
          return Promise.reject(error);
        }
      );
    },
    auth({ commit }, token) {
      return AuthService.auth(token).then(
        (data) => {
          commit('authSuccess', data);
          return Promise.resolve(data.user);
        },
        error => {
          commit('loginFailure');
          return Promise.reject(error);
        }
      );
    },
    logout({ commit }) {
      AuthService.logout();
      commit('logout');
    },
    register({ commit }, user) {
      return AuthService.register(user).then(
        (data) => {
          commit('registerSuccess', data);
          return Promise.resolve(data.user);
        },
        error => {
          commit('registerFailure');
          return Promise.reject(error);
        }
      );
    }
  },
  mutations: {
    loginSuccess(state, data) {
      state.status.loggedIn = true;
      state.user = data.user;
      state.role = data.role;
    },
    authSuccess(state, data) {
      state.status.loggedIn = true;
      state.user = data.user;
      state.role = data.role;
    },
    loginFailure(state) {
      state.status.loggedIn = false;
      state.user = null;
      state.role = null;
    },
    logout(state) {
      state.status.loggedIn = false;
      state.user = null;
      state.role = null;
    },
    registerSuccess(state, data) {
      state.status.loggedIn = false;
      state.user = data.user;
      state.role = data.role;
    },
    registerFailure(state) {
      state.status.loggedIn = false;
    }
  }
};