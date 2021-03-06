// import du store de vuex
import { createStore } from 'vuex'

// import de Axios
import axios from 'axios'

// initialisation de l'instance axios
const instance = axios.create({
  baseURL: 'http://localhost:3000/api/'
})

// Récupération des données
let user = (localStorage.getItem('user') || sessionStorage.getItem('user'))
let now = new Date().getTime();
let setupTime = localStorage.getItem('expire')
if (!user || setupTime == null) {
  user = {
   id: -1,
   token: '',
   pseudo:'',
   email:'',
   nom:'',
   prenom:'',
   imageUrl:'',
   role:'',
  };
} else if (now-setupTime > 23*60*60*1000) {
      localStorage.clear()
} else {
    user = JSON.parse(user)
}  


// Création du store
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
      sessionStorage.setItem('user', JSON.stringify(user));
      let now = new Date().getTime()
      localStorage.setItem('expire', now)
    },
    logUserRemind: function(state, user) {
      state.user = user;
      localStorage.setItem('user', JSON.stringify(user));
      let now = new Date().getTime()
      localStorage.setItem('expire', now)
    },
    logOut: function(state) {
      state.user = {
        id: -1,
        token:'',
      }
      localStorage.removeItem('user');
      localStorage.removeItem('expire')
      sessionStorage.removeItem('user');
    }
  },
  actions: {

    // Fonction Login
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
          resolve(response);
        })
        .catch(function (error) {
          commit('setStatus', 'error');
          reject(error);
        });
      });
    },

    // Fonction createAccount
    createAccount: ({commit}, formData) => {
      commit('setStatus', 'loading');
      return new Promise((resolve, reject) => {
        instance.post('/auth/create', formData)
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

    // Fonction modifyAccount
    modifyAccount: ({commit, state}, formData) => {
      commit('setStatus', 'loading');
      return new Promise((resolve, reject) => {
        instance.put(`/auth/update/${state.user.id}`, formData, {
          headers: {
            Authorization:'Bearer ' + state.user.token
          }
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

    // Fonction deleteAccount
    deleteAccount: ({commit, state}) => {
      commit('setStatus', 'Loading');
      return new Promise((resolve, reject) => {
        instance.delete(`/auth/delete/${state.user.id}`, {
          headers: {
            Authorization:'Bearer ' + state.user.token
          },
          data: {
            id: state.user.id
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
    },

    // Fonction getMyPosts
    getMyPosts: ({commit, state }) => {
      commit('setStatus', 'loading');
      return new Promise((resolve, reject) => {
        instance.get(`/post/myposts/${state.user.id}`, {
          headers: {
            Authorization:'Bearer ' + state.user.token
          },
          params: {
            id: state.user.id
          },   
        }) 
        .then(function (response) {
          commit('setStatus', 'postsLoaded');
          resolve(response);
        })
        .catch(function (error) {
          commit('setStatus', 'error');
          reject(error);
        });
      });
    },

    // Fonction getAllPosts
    getAllPosts: ({commit, state }) => {
      commit('setStatus', 'loading');
      return new Promise((resolve, reject) => {
        instance.get(`/post/allposts/${state.user.id}`, {
          headers: {
            Authorization:'Bearer ' + state.user.token
          },
          params: {
            id: state.user.id
          }, 
        }) 
        .then(function (response) {
          commit('setStatus', 'postsLoaded');
          resolve(response);
        })
        .catch(function (error) {
          commit('setStatus', 'error');
          reject(error);
        });
      });
    },

    // Fonction createPost
    createPost: ({commit, state}, formData) => {
      commit('setStatus', 'loading');
      return new Promise((resolve, reject) => {
        instance.post(`/post/create/${state.user.id}`, formData, {
          headers: {
            Authorization:'Bearer ' + state.user.token
          }
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

    // Fonction modifyPost
    modifyPost: ({commit, state}, {id, fd}) => {
      commit('setStatus', 'modifying');
      return new Promise((resolve, reject) => {
        instance.put(`/post/update/${id}`, fd, {
          headers: {
            Authorization:'Bearer ' + state.user.token
          },
          params: {
            id: state.user.id
          }, 
        })  
        .then(function(response){
          commit('setStatus', 'modified');
          resolve(response);
        })
        .catch(function(error){
          commit('setStatus', 'error');
          reject(error);
        })
      })
    },

    // Fonction deletePost
    deletePost: ({commit, state}, postInfo) => {
      commit('setStatus', 'Loading');
      return new Promise((resolve, reject) => {
        instance.delete(`/post/delete/${postInfo.postId}`, {
          headers: {
            Authorization:'Bearer ' + state.user.token
          },
          data: {
            userId: state.user.id
          },
          params: {
            userId: postInfo.userId
          }, 
        })
        .then(function(response){
          commit('setStatus', 'deleted');
          resolve(response);
        })
        .catch(function(error){
          commit('setStatus', 'error');
          reject(error);
        })
      })   
    },

    // Fonction likePost
    likePost: ({commit, state }, likeInfo) => {
      commit('setStatus', 'loading');
      return new Promise((resolve, reject) => {
        instance.post(`/post/like/${likeInfo.postId}`, likeInfo, {
          headers: {
            Authorization:'Bearer ' + state.user.token
          },
          params: {
            userId: state.user.id
          }, 
        })
        .then(function (response) {
          commit('setStatus', 'loaded');
          resolve(response);
        })
        .catch(function (error) {
          commit('setStatus', 'error');
          reject(error);
        });
      });
    },

    // Fonction createComment
    createComment: ({commit, state}, commentInfo) => {
      commit('setStatus', 'loading');
      return new Promise((resolve, reject) => {
        instance.post(`/comment/create/${state.user.id}`, commentInfo, {
          headers: {
            Authorization:'Bearer ' + state.user.token
          }
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

    //fonction modifyComment
    modifyComment: ({commit, state}, body) => {
      commit('setStatus', 'modifying');
      return new Promise((resolve, reject) => {
        instance.put(`/comment/update/${body.commentId}`, body, {
          headers: {
            Authorization:'Bearer ' + state.user.token
          },
          params: {
            userId: state.user.id
          }, 
        })  
        .then(function(response){
          commit('setStatus', 'modified');
          resolve(response);
        })
        .catch(function(error){
          commit('setStatus', 'error');
          reject(error);
        })
      })
    },

    // Fonction deleteComment
    deleteComment: ({commit, state}, id) => {
      commit('setStatus', 'Loading');
      return new Promise((resolve, reject) => {
        instance.delete(`/comment/delete/${id}`, {
          headers: {
            Authorization:'Bearer ' + state.user.token
          },
          data: {
            userId: state.user.id
          },
          params: {
            id: state.user.id
          }, 
        })
        .then(function(response){
          commit('setStatus', 'deleted');
          resolve(response);
        })
        .catch(function(error){
          commit('setStatus', 'error');
          reject(error);
        })
      })   
    },
  },
  modules: {
  }
})
