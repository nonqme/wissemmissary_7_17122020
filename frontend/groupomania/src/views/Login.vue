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

      <div class="form-floating"> 
        <input type="text" class="form-control" v-model="user_login" placeholder="Login">
        <label for="floatingInput">Login</label>
      </div>

      <div class="form-floating">
        <input type="password" class="form-control" v-model="user_password" placeholder="Password">
        <label for="floatingPassword">Password</label>
      </div>

      <div class="form-floating" v-if="mode == 'create'">
        <input type="password" class="form-control" v-model="user_confirmpassword" id="floatingPasswordConfirm" placeholder="Password" required>
        <label for="floatingPasswordConfirm">Confirmez votre password</label>
      </div>

      <div class="form-floating" v-if="mode == 'create'">
        <input type="email" class="form-control" id="floatingEmail" v-model="user_email" placeholder="user@email.fr" required>
        <label for="floatingEmail">Email</label>
      </div>

      <div class="form-floating" v-if="mode == 'create'">
        <input type="text" class="form-control" v-model="user_firstname" id="floatingFirstname" placeholder="John" required>
        <label for="floatingFirstname">Prénom</label>
      </div>

      <div class="form-floating" v-if="mode == 'create'">
        <input type="text" class="form-control" v-model="user_lastname" id="floatingLastname" placeholder="Doe" required>
        <label for="floatingLastname">Nom</label>
      </div>

      <div class="form-floating" v-if="mode == 'create'">
        <input type="date" class="form-control" v-model="user_birthdate" id="floatingBirthDate" placeholder="01/01/1900" required>
        <label for="floatingBirthDate">Date de naissance</label>
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
      user_login:'',
      user_password:'',
      user_confirmpassword:'',
      user_email:'',
      user_firstname:'',
      user_lastname:'',
      user_birthdate:'',
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
        if (this.user_login != "" && this.user_password != "" && this.user_email != "" && this.user_firstname != "" && this.user_lastname != "" && this.user_birthdate != "") {
          return false;
        } else {
          return true;
        }
      } else {
        if (this.user_login != "" && this.user_password != "") {
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
      if (this.user_confirmpassword === this.user_password) {
        this.$store.dispatch('createAccount', {
          user_login: this.user_login,
          user_password: this.user_password,
          user_email: this.user_email,
          user_firstname: this.user_firstname,
          user_lastname: this.user_lastname,
          user_birthdate: this.user_birthdate,
        }).then(response =>{
          this.mode = 'login',
          console.log(response)
        }).catch(error => {
          console.log(error)
          this.user_password = '';
          this.user_login = '';
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
        user_login: this.user_login,
        user_password: this.user_password,
      }).then(response =>{
        this.$router.push('/Home');
        console.log(response)
      }).catch(error => {
        console.log(error)
        this.user_password = '';
        this.user_login = '';
        this.$store.commit('setStorage', false)
        this.err = error.response.data.error
      })
    }
  }

}
</script>

<style>
  .form-signin {
    width: 100%;
    max-width: 330px;
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
</style>
