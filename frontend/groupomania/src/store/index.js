import { createStore } from 'vuex'
import axios from 'axios'

const instance = axios.create({
  baseURL: 'http://localhost:3000/api/'
})


let user = (localStorage.getItem('user') || sessionStorage.getItem('user'))
if (!user) {
  user = {
   id: -1,
   token: '',
   login:'',
   email:'',
   firstname:'',
   lastname:'',
   date: '',
   fullname:''
  };
} else {
    user = JSON.parse(user)
}


export default createStore({
  state: {
    storage: false,
    status: '',
    user: user,
  },
  mutations: {
    setStorage: function (state, storage) {
      state.storage = storage;
    },
    setStatus: function (state, status) {
      state.status = status;
    },
    logUser: function (state, user) {
      state.user = user;
      user.fullname = user.firstname + ' ' + user.lastname;
      console.log(user.fullname)
      sessionStorage.setItem('user', JSON.stringify(user));
    },
    logUserRemind: function(state, user) {
      state.user = user;
      localStorage.setItem('user', JSON.stringify(user));
    },
    setFullName: function (state, userFullName) {
      state.user.fullname = userFullName
    },
    logOut: function(state) {
      state.user = {
        id: -1,
        token:'',
      }
      localStorage.removeItem('user');
      sessionStorage.removeItem('user');
    }
  },
  actions: {
    login: ({commit, state }, userInfos) => {
      commit('setStatus', 'loading');
      return new Promise((resolve, reject) => {
        instance.post('/auth/login', userInfos)
        .then(function (response) {
          if (state.storage) {
            commit('logUserRemind', response.data);
          } else {
            commit('logUser', response.data);
          }
          commit('setStatus', '');
          commit('setFullName', response.data.firstname + ' ' + response.data.lastname )
          resolve(response);
        })
        .catch(function (error) {
          commit('setStatus', 'error');
          reject(error);
        });
      });
    },
    createAccount: ({commit}, userInfos) => {
      commit('setStatus', 'loading');
      return new Promise((resolve, reject) => {
        instance.post('/auth/signup', userInfos)
        .then(function(response){
          commit('setStatus', 'created');
          resolve(response);
        })
        .catch(function(error){
          commit('setStatus', 'error');
          reject(error);
        })

      })
    },
    postMessage: ({commit, state}, userMessage) => {
      commit('setStatus', 'loading');
      return new Promise((resolve, reject) => {
        instance.post('messages/post', userMessage, {
          headers: {
              Authorization:'Bearer ' + state.user.token
          }, 
        })
        .then(function(response){
          commit('setStatus', 'created');
          resolve(response);
        })
        .catch(function(error){
          commit('setStatus', 'error');
          reject(error);
        })
      })
    },
    getMyMessages: ({commit, state}) => {
      commit('setStatus', 'messagesLoading');
      return new Promise((resolve, reject) => {
        instance.get('messages/allmessages', {
          headers: {
            Authorization:'Bearer ' + state.user.token
          },
          params: {
            id: state.user.id
          },   
        })
        .then(function(response){
          commit('setStatus', 'messagesLoaded');
          resolve(response);
        })
        .catch(function(error){
          commit('setStatus', 'messagesError');
          reject(error);
        })
      })      
    },
    deleteAccount: ({commit, state}) => {
      commit('setStatus', 'Loading');
      return new Promise((resolve, reject) => {
        instance({
          method: 'post',
          url:'/auth/delete/',
          params: { id: state.user.id },  
          headers: {
            Authorization:'Bearer ' + state.user.token
          }
        })
        .then(function(response){
          commit('setStatus', 'deleted');
          commit('logOut')
          resolve(response);
        })
        .catch(function(error){
          commit('setStatus', 'error');
          reject(error);
        })
      })   
    }
  },
  modules: {
  }
})
