<template>
  <main class="form-signin">
    <form @submit.prevent="handleSubmit">
      <h1 class="h3 mb-3 fw-normal">Please register</h1>
      <div class="form-floating"> 
        <input type="text" class="form-control" v-model="user_login" placeholder="Login" required>
      </div>
      <div class="form-floating">
        <input type="password" class="form-control" v-model="user_password" placeholder="Password" required>
      </div>
      <button class="w-100 btn btn-lg btn-primary" type="submit">Submit</button>
    </form>
  </main> 
</template>

<script>
import axios from 'axios'
export default {
    name:'register',
    data() {
      return {
        user_login: '',
        user_password:'',
      }
    },
    methods: {
        handleSubmit(){
          const data = {
            user_login: this.user_login,
            user_password: this.user_password
          }
          axios.post('http://localhost:3000/api/auth/signup', data)
            .then (
              res => {
                console.log(res)
                this.$router.push('/login');
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