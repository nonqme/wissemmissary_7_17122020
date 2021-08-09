<template>
<div>
<Nav/>
  <p>Email: {{monemail}}</p>
  <p>Pseudo: {{monpseudo}}</p>
  <p>Nom: {{monnom}}</p>
  <p>Prénom: {{monprenom}}</p>
  <img class='profile-img' v-bind:src="monimage">
  <form class="form-signin" v-on:submit.prevent>
      <div class="form-floating d-flex justify-content-between" v-if="mode == 'view'">
        <a class="mb-3 fw-normal" @click="switchToModifyAccount()">Modifier mes informations</a>
      </div>

      <div class="form-floating d-flex justify-content-between" v-else>
        <a class="mb-3 fw-normal" @click="switchToView()">Revenir au profile</a>
      </div> 

     <div class="form-floating" v-if="mode == 'modify'"> 
        <input id="floatingPseudo" type="text" class="form-control" v-model="pseudo" placeholder="Login">
        <label for="floatingPseudo">Pseudo</label>
      </div>

      <div class="form-floating" v-if="mode == 'modify'">
        <input type="email" class="form-control" id="floatingEmail" v-model="email" placeholder="user@email.fr" required>
        <label for="floatingEmail">Email</label>
      </div>

      <div class="form-floating" v-if="mode == 'modify'">
        <input type="text" class="form-control" v-model="nom" id="floatingNom" placeholder="John" required>
        <label for="floatingNom">Nom</label>
      </div>

      <div class="form-floating" v-if="mode == 'modify'">
        <input type="text" class="form-control" v-model="prenom" id="floatingPrenom" placeholder="Doe" required>
        <label for="floatingPrenom">Prénom</label>
      </div>

      <div class="form-floating" v-if="mode == 'modify'">
        <input ref="file" type="file" accept="image/png, image/jpeg, image/bmp, image/gif" class="form-control" id="floatingFile" name="image" v-on:change="handleFileUpload">
      </div>

      <button @click="modifyAccount()" class="w-100 btn btn-lg btn-primary" v-if="mode == 'modify'" :disabled='modifyDisabled'>
        <span v-if="status == 'loading'">Modification en cours...</span>
        <span v-else>Modifier mes informations</span>
      </button>

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
    <div class="form-floating" v-if="status == 'error'">
      <p class="error__message">{{err}}</p>
    </div>   
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
      monemail:'',
      monnom:'',
      monprenom:'',
      monpseudo:'',
      monimage:'',
      email:'',
      nom:'',
      prenom:'',
      pseudo:'',
      image:'',
      file:null,
      checked:false,
      mode: 'view',
      err:'',
    }
  },
  mounted: function(){

    // Vérifie si l'user est déjà log
      if (this.$store.state.user.id == -1) {
        this.$router.push('/');
        return; 
      }

    // Récupère les données dans le store  
      this.monemail = this.$store.state.user.email
      this.monprenom = this.$store.state.user.prenom
      this.monnom = this.$store.state.user.nom
      this.monpseudo = this.$store.state.user.pseudo
      this.monimage = this.$store.state.user.imageUrl
      this.email = this.$store.state.user.email
      this.prenom = this.$store.state.user.prenom
      this.nom = this.$store.state.user.nom
      this.pseudo = this.$store.state.user.pseudo
      this.image = this.$store.state.user.imageUrl
  },
    computed: {

      // Desactive le bouton si les champs ne sont pas remplis
      modifyDisabled: function () {
        if (this.pseudo != "" && this.email != "" && this.nom != "" && this.prenom != "") {
          return false;
        } else {
          return true;
        }
    },
    
    // Désactive la suppression de compte si la case n'est pas cochée
    isDisabled: function () {
        if (this.checked == true) {
          return false;
        } else {
          return true;
        }
    },

    // Appel de mapState
    ...mapState(['status'])
  },
  methods: {

    // Gérer le fichier
    handleFileUpload(){
      this.file = this.$refs.file.files[0]
    },

    // Passer en mode modifier le compte
    switchToModifyAccount: function() {
      this.mode = 'modify';
    },

    // Passer en mode normal
    switchToView: function() {
      this.mode = 'view';
    },

    // Modifier les infos du compte
    modifyAccount: function() {
      const fd = new FormData();
      fd.append('pseudo', this.pseudo)
      fd.append('email', this.email)
      fd.append('prenom', this.prenom)
      fd.append('nom', this.nom)
      fd.append('id', this.$store.state.user.id)
      if (this.file !== null) {
        fd.append('image', this.file, this.file.name)
      }
      this.$store.dispatch('modifyAccount', fd)
      .then(response =>{
        this.monemail = response.data.email
        this.monprenom = response.data.prenom
        this.monnom = response.data.nom
        this.monpseudo = response.data.pseudo
        this.mode = 'view';
        this.monimage = response.data.imageUrl
        this.$store.state.user.imageUrl = response.data.imageUrl
        this.file = null
        this.email = response.data.email
        this.prenom = response.data.prenom
        this.nom = response.data.nom
        this.pseudo = response.data.pseudo
        
      }).catch(error => {
        console.log(error)
        this.err = error.response.data.error
      })
    },

    // Supprimer le compte 
    deleteAccount: function() {
        this.$store.dispatch('deleteAccount')
        .then(() =>{
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

.profile-img {
  max-width: 200px;
}

</style>