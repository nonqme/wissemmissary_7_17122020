<template>
  <section class="form-signin">
    <form @submit.prevent="handleSubmit">
      <h1 class="h3 mb-3 fw-normal">Please register</h1>
      <div class="form-floating"> 
        <input type="text" class="form-control" id="floatingInput" v-model="user_login" placeholder="Login" required>
        <label for="floatingInput">Login</label>
      </div>
      <div class="form-floating">
        <input type="password" class="form-control" v-model="user_password" id="floatingPassword" placeholder="Password" required>
        <label for="floatingPassword">Password</label>
      </div>
      <div class="form-floating">
        <input type="password" class="form-control" v-model="user_confirmpassword" id="floatingPasswordConfirm" placeholder="Password" required>
         <label for="floatingPasswordConfirm">Confirmez votre password</label>
      </div>
      <div class="form-floating">
        <input type="email" class="form-control" id="floatingEmail" v-model="user_email" placeholder="user@email.fr" required>
        <label for="floatingEmail">Email</label>
      </div>
      <div class="form-floating">
        <input type="text" class="form-control" v-model="user_firstname" id="floatingFirstname" placeholder="John" required>
        <label for="floatingFirstname">Prénom</label>
      </div>
      <div class="form-floating">
        <input type="text" class="form-control" v-model="user_lastname" id="floatingLastname" placeholder="Doe" required>
        <label for="floatingLastname">Nom</label>
      </div>
      <div class="form-floating">
        <input type="date" class="form-control" v-model="user_birthdate" id="floatingBirthDate" placeholder="01/01/1900" required>
        <label for="floatingBirthDate">Date de naissance</label>
      </div>
      <button class="w-100 btn btn-lg btn-primary" type="submit">Submit</button>
    </form>
      <p class="error__code">{{error}}</p>
      <p class="error__message">{{errorMessage}}</p>
  </section> 
</template>

<script>
import axios from 'axios'
export default {
    name:'register',
    data() {
      return {
        user_login: '',
        user_password:'',
        user_confirmpassword:'',
        user_email: '',
        user_firstname: '',
        user_lastname:'',
        user_birthdate:'',
        error:'',
        errorMessage:'',
      }
    },
    methods: {
        handleSubmit(){
        if ((this.user_password) == (this.user_confirmpassword)) {
          const data = {
            user_login: this.user_login,
            user_password: this.user_password,
            user_email: this.user_email,
            user_firstname: this.user_firstname,
            user_lastname: this.user_lastname,
            user_birthdate: this.user_birthdate,
          }
          axios.post('http://localhost:3000/api/auth/signup', data)
            .then (
              () => {
                this.$router.push('/');
              }
            ).catch(
              err => {
                this.error = err.message
                this.errorMessage = err.response.data.error
              }
            )
        } else {
          this.errorMessage = "Confirmation de mot de pass incorect."
        }
    }
}
}
</script>

<style>
</style>