<template>
  <main class="form-signin">
    <form @submit.prevent="handleSubmit">
      <h1 class="h3 mb-3 fw-normal">Please sign in</h1>
      <div class="form-floating"> 
        <input type="text" class="form-control" v-model="user_login" placeholder="Login">
      </div>
      <div class="form-floating">
        <input type="password" class="form-control" v-model="user_password" placeholder="Password">
      </div>

      <div class="checkbox mb-3">
        <label>
          <input type="checkbox" value="remember-me"> Remember me
        </label>
      </div>
      <button class="w-100 btn btn-lg btn-primary" type="submit">Sign in</button>
    </form>
  </main> 
</template>

<script>
import axios from 'axios'
export default {
    name:"Login",
    data() {
      return {
        user_login: '',
        user_password: '',
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
                console.log(res)
                localStorage.setItem('token', res.data.token);
                this.$router.push('/messages');
              }
            ).catch(
              err => {
                console.log(err)
              }
            )
        }
    }
}
</script>

<style>

</style>