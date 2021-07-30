<template>
  <section>
    <form class="form-signin" v-on:submit.prevent>
      <h1 class="h3 mb-3 fw-normal" v-if="mode == 'login'">Connexion</h1>
      <h1 class="h3 mb-3 fw-normal" v-else>Inscription</h1>
      <div class="form-floating d-flex justify-content-between" v-if="mode == 'login'">
        <p class="mb-3 fw-normal">Je n'ai pas encore de compte</p>
        <a class="mb-3 fw-normal" @click="switchToCreateAccount()">Créer un compte</a>
      </div>

      <div class="form-floating d-flex justify-content-between" v-else>
        <p class="mb-3 fw-normal">J'ai déjà un compte</p>
        <a class="mb-3 fw-normal" @click="switchToLogin()">Se connecter</a>
      </div>  

      <div class="form-floating" v-if="mode == 'create'"> 
        <input id="floatingPseudo" type="text" class="form-control" v-model="pseudo" placeholder="Login">
        <label for="floatingPseudo">Pseudo</label>
      </div>

      <div class="form-floating">
        <input type="email" class="form-control" id="floatingEmail" v-model="email" placeholder="user@email.fr" required>
        <label for="floatingEmail">Email</label>
      </div>

      <div class="form-floating">
        <input type="password" class="form-control" v-model="password" placeholder="Password">
        <label for="floatingPassword">Password</label>
      </div>

      <div class="form-floating" v-if="mode == 'create'">
        <input type="password" class="form-control" v-model="confirmpassword" id="floatingPasswordConfirm" placeholder="Password" required>
        <label for="floatingPasswordConfirm">Confirmez votre password</label>
      </div>

      <div class="form-floating" v-if="mode == 'create'">
        <input type="text" class="form-control" v-model="nom" id="floatingNom" placeholder="John" required>
        <label for="floatingNom">Nom</label>
      </div>

      <div class="form-floating" v-if="mode == 'create'">
        <input type="text" class="form-control" v-model="prenom" id="floatingPrenom" placeholder="Doe" required>
        <label for="floatingPrenom">Prénom</label>
      </div>

      <div class="form-floating" v-if="mode == 'create'">
        <input ref="file" type="file" accept="image/png, image/jpeg, image/bmp, image/gif" class="form-control" id="floatingFile" name="image" v-on:change="handleFileUpload">
      </div>

      <div class="checkbox mb-3" v-else>
        <label>
          <input type="checkbox" value="remember-me" v-model="checked"> Rester connecté
        </label>
      </div>

      <button @click="login()" class="w-100 btn btn-lg btn-primary" v-if="mode == 'login'" :disabled='isDisabled' >
        <span v-if="status == 'loading'">Connexion en cours...</span>
        <span v-else>Connexion</span>
      </button>
      <button @click="createAccount()" class="w-100 btn btn-lg btn-primary" v-else :disabled='isDisabled'>
        <span v-if="status == 'loading'">Création en cours...</span>
        <span v-else>Créer mon compte</span>
      </button>
    </form>
      <div class="form-floating" v-if="status == 'error'">
        <p class="error__message">{{err}}</p>
      </div> 
  </section>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Login',
  data: function() {
    return {
      mode:'login',
      pseudo:'',
      password:'',
      confirmpassword:'',
      email:'',
      nom:'',
      prenom:'',
      file: null,
      checked:false,
      err:'',
    }
  },
  mounted: function() {
    if (this.$store.state.user.id !== -1) {
        this.$router.push('/Home');
        return;
    }
  },
  computed: {
    isDisabled: function () {
      if (this.mode == 'create') {
        if (this.pseudo != "" && this.password != "" && this.email != "" && this.nom != "" && this.prenom != "" && this.confirmpassword != "") {
          return false;
        } else {
          return true;
        }
      } else {
        if (this.login != "" && this.password != "") {
          return false;
        } else {
          return true;
        }
      }
    },
    ...mapState(['status'])
  },
  methods: {
    switchToCreateAccount: function() {
      this.mode = 'create';
    },
    switchToLogin: function() {
      this.mode = 'login';
    },
    createAccount: function() {
      const fd = new FormData();
      fd.append('pseudo', this.pseudo)
      fd.append('email', this.email)
      fd.append('password', this.password)
      fd.append('prenom', this.prenom)
      fd.append('nom', this.nom)
      if (this.file !== null) {
        fd.append('image', this.file, this.file.name)
      }
      if (this.confirmpassword === this.password) {
        this.$store.dispatch('createAccount', fd)
        .then(response =>{
          this.mode = 'login',
          console.log(response)
        }).catch(error => {
          console.log(error)
          this.password = '';
          this.email = '';
          this.err = error.response.data.error
        })
      } else {
        this.err = 'Veuillez vérifier que votre mot de pass et la confirmation de mot de pass correspondent'
        this.$store.commit('setStatus', 'error')

      }  
    },
    login: function() {
      if (this.checked == true) {
          this.$store.commit('setStorage', true)
      }
      this.$store.dispatch('login', {
        email: this.email,
        password: this.password,
      }).then(response =>{
        this.$router.push('/profile');
        console.log(response)
      }).catch(error => {
        console.log(error)
        this.password = '';
        this.email = '';
        this.$store.commit('setStorage', false)
        this.err = error.response.data.error
      })
    },
    handleFileUpload(){
      this.file = this.$refs.file.files[0]
      console.log(this.file)
    }
  }

}
</script>

<style>
  .form-signin {
    width: 100%;
    max-width: 350px;
    padding: 15px;
    margin: auto;
  }

  .form-signin .checkbox {
    font-weight: 400;
  }

  .form-signin .form-floating:focus-within {
    z-index: 2;
  }


  .form-signin input[type="password"] {
    margin-bottom: 10px;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }

  .form-signin input[type="login"] {
    margin-bottom: -1px;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }

  #floatingFile {
    margin-top:10px;
    margin-bottom: 10px;
  }
</style>
