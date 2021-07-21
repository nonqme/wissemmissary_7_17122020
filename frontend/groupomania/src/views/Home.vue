<template>
<div>
<Nav/>
<section class="container-fluid col-5">
    <div>
        <form v-on:submit.prevent class="card-body">
            <label class="sr-only" for="message">Post</label>
            <textarea v-model="post" class="form-control" id="message" rows="3" placeholder="What are you thinking?"></textarea>
            <button @click="sendMessage()" type="submit" class="btn btn-primary" :disabled='isDisabled'>
                <span v-if="status == 'loading'">En cours d'envoi</span>
                <span v-else>Envoyer</span>
            </button>
        </form>
    </div>
    <article v-for="message in messages.slice(-10).reverse()" :key="message.id"  card gedf-card>
        <div class="card-header">
            <div class="d-flex justify-content-between align-items-center">
                <div class="d-flex justify-content-between align-items-center">
                    <div class="mr-2">
                        <img class="rounded-circle" width="45" src="https://picsum.photos/50/50" alt="">
                    </div>
                    <div class="ml-2">
                        <div class="h5 m-0">@LeeCross</div>
                        <div class="h7 text-muted">{{fullname}}</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="card-body">
            <div class="text-muted h7 mb-2"> <i class="fa fa-clock-o"></i> 10 min ago</div>
            <p class="card-text">
                {{message.post}}
            </p>
        </div>
            <button @click="deleteMessage(message.id)" type="submit" class="btn btn-primary">
                <span v-if="status == 'deleting'">En cours de supression</span>
                <span v-else>Supprimer</span>
            </button>
            <form v-on:submit.prevent class="card-body">
            <label class="sr-only" for="message">Commentaire</label>
            <textarea v-model="commentaire" class="form-control" id="message" rows="3" placeholder="What are you thinking?"></textarea>
            <button @click="sendCommentaire(message.id)" type="submit" class="btn btn-primary">
                <span v-if="status == 'loading'">En cours d'envoi</span>
                <span v-else>Envoyer</span>
            </button>
        </form>
    </article>
</section>
</div>   
</template>

<script>
import Nav from '@/components/Nav';
import { mapState } from 'vuex'
export default {    
    name: 'Home',
    components: {Nav},
    data: function() {
        return {
            post: '',
            messages:[],
            fullname:'',
            commentaire:'',
        }
  },
    mounted: function() {
        if (this.$store.state.user.id == -1) {
            this.$router.push('/');
            return;
        }
        this.$store.dispatch('getMyMessages')
        .then(response =>{
            this.messages = response.data.message;
            this.fullname = this.$store.state.user.fullname
        }).catch(error => {
            console.log(error)
            this.err = error.response.data.error
        })
    },
    computed: {        
        isDisabled: function () {
            if (this.post != "") {
            return false;
            } else {
            return true;
            }
        },
        ...mapState(['status'])
    },
    methods: {
        sendMessage: function() {
        this.$store.dispatch('postMessage', {
            userID: this.$store.state.user.id,
            post: this.post,
        }).then(response =>{
            console.log(response)
            this.$store.dispatch('getMyMessages')
            .then(response =>{
                this.messages = response.data.message;
            }).catch(error => {
                console.log(error)
                this.err = error.response.data.error
            })
        }).catch(error => {
            console.log(error.response.data.error)
            this.err = error.response.data.error
        })
        this.post = '';
        },
        deleteMessage: function(messageId) {
            console.log(messageId)
            this.$store.dispatch('deleteMessage',
                    messageId
            ).then(response =>{
                console.log(response)
                this.$store.dispatch('getMyMessages')
                .then(response =>{
                    this.messages = response.data.message;
                }).catch(error => {
                    console.log(error)
                    this.err = error.response.data.error
                })
            }).catch(error => {
                console.log(error.response.data.error)
                this.err = error.response.data.error
            })
            this.post = '';
        },
        sendCommentaire: function(messageId) {
            this.$store.dispatch('postCommentaire', {
                userId: this.$store.state.user.id,
                postId: messageId,
                commentaire: this.commentaire
            }).then(response =>{
                console.log(response)
            }).catch(error => {
                console.log(error.response.data.error)
                this.err = error.response.data.error
            })
            this.post = '';
        },

    }
}
</script>

<style>

</style>