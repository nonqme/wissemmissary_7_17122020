<template>
<div>
<Nav/>
  <p>{{email}}</p>
  <p>{{firstname}}</p>
  <p>{{lastname}}</p>
  <p>{{date}}</p>
  <form>
      <div class="checkbox mb-3">
        <label>
          <input type="checkbox" value="remember-me" v-model="checked"> Vous êtes sûr de vouloir supprimer le compte ?
        </label>
      </div>
      <button @click="deleteAccount()" class="w-100 btn btn-lg btn-primary" :disabled='isDisabled'>
        <span v-if="status == 'loading'">Suppression en cours...</span>
        <span v-else>Supprimer mon compte</span>
      </button>
  </form>  
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Nav from '@/components/Nav';
export default {
    name: 'Setting',
    components: {Nav},
    data: function() {
    return {
      email:'',
      firstname:'',
      lastname:'',
      date:'',
      checked:false,
    }
  },
  mounted: function(){
      if (this.$store.state.user.id == -1) {
        this.$router.push('/');
        return; 
      }
      this.email = this.$store.state.user.email
      this.firstname = this.$store.state.user.firstname
      this.lastname = this.$store.state.user.lastname
      this.date = this.$store.state.user.date
  },
    computed: {
    isDisabled: function () {
        if (this.checked == true) {
          return false;
        } else {
          return true;
        }
    },
    ...mapState(['status'])
  },
  methods: {
    deleteAccount: function() {
        this.$store.dispatch('deleteAccount')
        .then(response =>{
          console.log(response)
          this.$router.push('/')
        }).catch(error => {
          console.log(error)
          this.err = error.response.data.error
        })
      }
    },
}
</script>

<style>

</style>