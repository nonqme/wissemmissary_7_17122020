<template>
  <section class="form-signin">
    <form @submit.prevent="handleSubmit">
      <h1 class="h3 mb-3 fw-normal">Please sign in</h1>
      <div class="form-floating"> 
        <input type="text" class="form-control" v-model="user_login" placeholder="Login">
        <label for="floatingInput">Login</label>
      </div>
      <div class="form-floating">
        <input type="password" class="form-control" v-model="user_password" placeholder="Password">
        <label for="floatingPassword">Password</label>
      </div>

      <div class="checkbox mb-3">
        <label>
          <input type="checkbox" value="remember-me" v-model="checked"> Remember me
        </label>
      </div>
      <button class="w-100 btn btn-lg btn-primary" type="submit">Sign in</button>
    </form>
      <p class="error__code">{{error}}</p>
      <p class="error__message">{{errorMessage}}</p>
  </section> 
</template>

<script>
import axios from 'axios'
export default {
    name:"Login",
    data() {
      return {
        user_login: '',
        user_password: '',
        error:'',
        errorMessage:'',
        checked:false,
      }
    },
    created() {
      const lsToken = localStorage.getItem('token');
      const ssToken = sessionStorage.getItem('token');
        if ((lsToken !== null) || (ssToken !== null)){
            this.$router.push('/messages');
        }
    },
    methods: {
        handleSubmit(){
          const data = {
            user_login: this.user_login,
            user_password: this.user_password
          }
          axios.post('http://localhost:3000/api/auth/login', data)
            .then (
              res => {
                if (this.checked) {
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('userid', res.data.id);
                localStorage.setItem('userFullName', res.data.firstname + ' ' + res.data.lastname);
                this.$router.push('/messages');
                }
              else {
                sessionStorage.setItem('token', res.data.token);
                sessionStorage.setItem('userid', res.data.id);
                sessionStorage.setItem('userFullName', res.data.firstname + ' ' + res.data.lastname);
                this.$router.push('/messages');

              }
                this.$store.state.isLoged = true;

              }
            ).catch(
              err => {
                this.error = err.message
                this.errorMessage = err.response.data.error
              }
            )
        }
    }
}
</script>

<style>

</style>