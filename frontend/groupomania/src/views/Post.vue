<template>
    <div>
        <Nav/>

        <div class="form-floating d-flex justify-content-between" v-if="mode == 'mymessages'">
            <a class="mb-3 fw-normal" @click="switchToAllMessages()">Quoi de nouveau ?</a>
        </div> 

        <div class="form-floating d-flex justify-content-between" v-else>
            <a class="mb-3 fw-normal" @click="switchToMyMessages()">Mes Messages</a>
        </div>

        <div class="container-fluid col-5" v-if="mode == 'mymessages'">
            <form v-on:submit.prevent class="card-body">
                <label class="sr-only" for="post">Post</label>
                <textarea v-model="newbody" class="form-control" id="post" rows="3" placeholder="What are you thinking?"></textarea>
                <input ref="file" type="file" accept="image/png, image/jpeg, image/bmp, image/gif" class="form-control" id="floatingFile" name="image" v-on:change="handleFileUpload">
                <button @click="createPost()" type="submit" class="btn btn-primary" :disabled='isDisabled'>
                    <span v-if="status == 'loading'">En cours d'envoi</span>
                    <span v-else>Envoyer</span>
                </button>
            </form>
        </div>

        <div v-if="mode == 'mymessages'">
            <article v-for="post in posts.slice(-10).reverse()" :key="post.id"  class="card">
                <div class="card-header">
                    <div class="d-flex justify-content-between align-items-center">
                        <div class="d-flex justify-content-between align-items-center">
                            <div class="mr-2">
                                <img class="rounded-circle" width="45" height="45" v-bind:src=post.user.imageUrl alt="">
                            </div>
                            <div class="ml-2">
                                <div class="h5 m-0">@ {{post.user.pseudo}}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="form-floating" v-if="postmode == `modify${post.id}`">
                    <input type="text" class="form-control" v-model="body" id="floatingBody" placeholder="Doe" name='body' required>
                    <label for="floatingBody">Message</label>
                </div>

                <div class="form-floating" v-if="postmode == `modify${post.id}`">
                    <input ref="file" type="file" accept="image/png, image/jpeg, image/bmp, image/gif" class="form-control" id="floatingFile" name="image" v-on:change="handleFileUpload">
                </div>
                
                <div class="card-body">
                    <div class="text-muted h7 mb-2"> <i class="fa fa-clock-o"></i>{{post.createdAt}}</div>
                    <p class="card-text">
                        {{post.body}}
                    </p>
                    <img v-if='post.bodyImageUrl !== null' v-bind:src="post.bodyImageUrl">
                </div>

                <div v-if="postmode == `modify${post.id}`" class="btn-space">
                    <button @click="modifyPost(post.id)" type="submit" class="btn btn-primary">
                        <span v-if="status == 'modifying'">En cours de modification</span>
                        <span v-else>Valider</span>
                    </button>
                    <button @click="switchToView()" type="submit" class="btn btn-primary">
                        <span v-if="status == 'modifying'">En cours de modification</span>
                        <span v-else>Annuler</span>
                    </button>
                </div>    

                <div v-if="postmode == 'view'">
                    <div v-if="post.user.id === this.$store.state.user.id || this.$store.state.user.role == 'admin'" class="btn-space">
                        <button @click="switchToModifyPost(post.id)" type="submit" class="btn btn-primary">
                            <span v-if="status == 'modifying'">En cours de modification</span>
                            <span v-else>Modifier</span>
                        </button>
                        <button @click="deletePost(post.id)" type="submit" class="btn btn-primary">
                            <span v-if="status == 'deleting'">En cours de supression</span>
                            <span v-else>Supprimer</span>
                        </button>
                    </div>
                </div>
                <div class="container-fluid">
                    <form v-on:submit.prevent class="card-body">
                        <label class="sr-only" for="post">Commentaire</label>
                        <textarea v-model="comment" class="form-control" rows="2" placeholder="What are you thinking?"></textarea>
                        <button @click="createComment(post.id)" type="submit" class="btn btn-primary" :disabled='isDisabled'>
                            <span v-if="status == 'loading'">En cours d'envoi</span>
                            <span v-else>Envoyer</span>
                        </button>
                    </form>
                </div>
                <div v-if="posts.length !== 0 || post.comments.length !== 0">
                    <div v-for="comment in post.comments.slice().reverse()" :key="comment.id" class="card">
                        <h1>@{{comment.commentUser.pseudo}}</h1>
                        <p>{{comment.bodyComment}}</p>
                        <div v-if="commentmode == 'view'">
                            <div v-if="comment.commentUser.id === this.$store.state.user.id || this.$store.state.user.role == 'admin'" class="btn-space">
                                <button @click="switchToModifyComment(comment.id)" type="submit" class="btn btn-primary">
                                    <span v-if="status == 'modifying'">En cours de modification</span>
                                    <span v-else>Modifier</span>
                                </button>
                                <button @click="deleteComment(comment.id)" type="submit" class="btn btn-primary">
                                    <span v-if="status == 'deleting'">En cours de supression</span>
                                    <span v-else>Supprimer</span>
                                </button>
                            </div>
                        </div>
                        <div class="form-floating" v-if="commentmode == `modify${comment.id}`">
                            <input type="text" class="form-control" v-model="this.comment" id="floatingBody" placeholder="Doe" name='body' required>
                            <label for="floatingBody">Message</label>
                        </div>
                        <div v-if="commentmode == `modify${comment.id}`" class="btn-space">
                            <button @click="modifyComment(comment.id)" type="submit" class="btn btn-primary">
                                <span v-if="status == 'modifying'">En cours de modification</span>
                                <span v-else>Valider</span>
                            </button>
                            <button @click="switchToCommentView()" type="submit" class="btn btn-primary">
                                <span v-if="status == 'modifying'">En cours de modification</span>
                                <span v-else>Annuler</span>
                            </button>
                        </div>  
                    </div>
                </div>               
            </article>
        </div>
        <div v-if="mode == 'allmessages'">
            <article v-for="post in posts.slice(-10).reverse()" :key="post.id"  class="card">
                <div class="card-header">
                    <div class="d-flex justify-content-between align-items-center">
                        <div class="d-flex justify-content-between align-items-center">
                            <div class="mr-2">
                                <img class="rounded-circle" width="45" height="45" v-bind:src=post.user.imageUrl alt="">
                            </div>
                            <div class="ml-2">
                                <div class="h5 m-0">@ {{post.user.pseudo}}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <div class="text-muted h7 mb-2"> <i class="fa fa-clock-o"></i>{{post.createdAt}}</div>
                    <p class="card-text">
                        {{post.body}}
                    </p>
                    <img v-if='post.bodyImageUrl !== null' v-bind:src="post.bodyImageUrl">
                </div>
                <div v-if="postmode == 'view'">
                    <div v-if="post.user.id === this.$store.state.user.id || this.$store.state.user.role == 'admin'" class="btn-space">
                        <button @click="switchToModifyPost(post.id)" type="submit" class="btn btn-primary">
                            <span v-if="status == 'modifying'">En cours de modification</span>
                            <span v-else>Modifier</span>
                        </button>
                        <button @click="deletePost(post.id)" type="submit" class="btn btn-primary">
                            <span v-if="status == 'deleting'">En cours de supression</span>
                            <span v-else>Supprimer</span>
                        </button>
                    </div>
                </div>
                <div class="container-fluid">
                    <form v-on:submit.prevent class="card-body">
                        <label class="sr-only" for="post">Commentaire</label>
                        <textarea v-model="comment" class="form-control" rows="2" placeholder="What are you thinking?"></textarea>
                        <button @click="createComment(post.id)" type="submit" class="btn btn-primary" :disabled='isDisabled'>
                            <span v-if="status == 'loading'">En cours d'envoi</span>
                            <span v-else>Envoyer</span>
                        </button>
                    </form>
                </div>
                <div v-if="posts.length !== 0 || post.comments.length !== 0">
                    <div v-for="comment in post.comments.slice().reverse()" :key="comment.id" class="card">
                        <h1>@{{comment.commentUser.pseudo}}</h1>
                        <p>{{comment.bodyComment}}</p>
                        <div v-if="commentmode == 'view'">
                            <div v-if="comment.commentUser.id === this.$store.state.user.id || this.$store.state.user.role == 'admin'" class="btn-space">
                                <button @click="switchToModifyComment(comment.id)" type="submit" class="btn btn-primary">
                                    <span v-if="status == 'modifying'">En cours de modification</span>
                                    <span v-else>Modifier</span>
                                </button>
                                <button @click="deleteComment(comment.id)" type="submit" class="btn btn-primary">
                                    <span v-if="status == 'deleting'">En cours de supression</span>
                                    <span v-else>Supprimer</span>
                                </button>
                            </div>
                        </div>
                        <div class="form-floating" v-if="commentmode == `modify${comment.id}`">
                            <input type="text" class="form-control" v-model="this.comment" id="floatingBody" placeholder="Doe" name='body' required>
                            <label for="floatingBody">Message</label>
                        </div>
                        <div v-if="commentmode == `modify${comment.id}`" class="btn-space">
                            <button @click="modifyComment(comment.id)" type="submit" class="btn btn-primary">
                                <span v-if="status == 'modifying'">En cours de modification</span>
                                <span v-else>Valider</span>
                            </button>
                            <button @click="switchToCommentView()" type="submit" class="btn btn-primary">
                                <span v-if="status == 'modifying'">En cours de modification</span>
                                <span v-else>Annuler</span>
                            </button>
                        </div>  
                    </div>
                </div>       
            </article>
        </div>        
    </div>   
</template>

<script>
import Nav from '@/components/Nav';
import { mapState } from 'vuex'
export default {    
    name: 'Post',
    components: {Nav},
    data: function() {
        return {
            mode:'mymessages',
            postmode:'view',
            commentmode:'view',
            body:'',
            file: null,
            posts:[],
            newbody:'',
            comment:'',
        }
  },
    mounted: function() {
        console.log(this.$store.state.user.role)
        if (this.$store.state.user.id == -1) {
            this.$router.push('/');
            return;
        }
        this.$store.dispatch('getMyPosts')
        .then(response =>{
            console.log(response)
            this.posts = response.data.posts
        }).catch(error => {
            console.log(error)
            this.err = error.response.data.error
        })
    },
    computed: {        
        isDisabled: function () {
            if ((this.newbody != "") || (this.comment != "")) {
            return false;
            } else {
            return true;
            }
        },
        ...mapState(['status'])
    },
    methods: {
    handleFileUpload(){
      this.file = this.$refs.file.files[0]
    },
    switchToAllMessages: function() {
      this.mode = 'allmessages';
        this.$store.dispatch('getAllPosts')
        .then(response =>{
            console.log(response)
            this.posts = response.data.posts
        }).catch(error => {
            console.log(error)
            this.err = error.response.data.error
        })
    },
    switchToMyMessages: function() {
      this.mode = 'mymessages';
        this.$store.dispatch('getMyPosts')
        .then(response =>{
            console.log(response)
            this.posts = response.data.posts
        }).catch(error => {
            console.log(error)
            this.err = error.response.data.error
        })
    },
    switchToModifyPost: function(id) {
      this.postmode = `modify${id}`;
    },
    switchToModifyComment: function(id) {
      this.commentmode = `modify${id}`;
    },
    switchToView: function() {
      this.postmode = 'view';
    },
    switchToCommentView: function() {
      this.commentmode = 'view';
    },
    createPost: function() {
        const fd = new FormData();
        fd.append('body', this.newbody)
        fd.append('userId', this.$store.state.user.id)
        if (this.file !== null) {
            fd.append('image', this.file, this.file.name)
        }
        this.$store.dispatch('createPost', fd)
        .then(response =>{
            this.newbody = '';
            this.$store.dispatch('getMyPosts')
            .then(response =>{
                console.log(response)
                this.posts = response.data.posts
            }).catch(error => {
                console.log(error)
                this.err = error.response.data.error
            })
            console.log(response)
        }).catch(error => {
            console.log(error)
            this.newbody = '';
            this.err = error.response.data.error
        }) 
    },
    modifyPost: function(id) {
        const fd = new FormData();
        fd.append('body', this.body)
        fd.append('userId', this.$store.state.user.id)
        if (this.file !== null) {   
            fd.append('image', this.file, this.file.name)
        }
        console.log(fd)
        this.$store.dispatch('modifyPost', {id, fd})
        .then(response =>{
            this.postmode = 'view';
            console.log(response)
            this.$store.dispatch('getMyPosts')
                .then(response =>{
                    console.log(response)
                    this.body = ''
                    this.posts = response.data.posts
                }).catch(error => {
                    console.log(error)
                    this.body = ''
                    this.err = error.response.data.error
                })
      }).catch(error => {
        this.body = ''
        console.log(error)
        this.err = error.response.data.error
      })
    },
    deletePost: function (id) {
        this.$store.dispatch('deletePost', id)
        .then(response =>{
            console.log(response)
            console.log
                if (this.mode == 'mymessages') {
            this.$store.dispatch('getMyPosts')
            .then(response =>{
                console.log(response)
                this.posts = response.data.posts
            }).catch(error => {
                console.log(error)
                this.err = error.response.data.error
            })
        } else {
            this.$store.dispatch('getAllPosts')
            .then(response =>{
                console.log(response)
                this.posts = response.data.posts
            }).catch(error => {
                console.log(error)
                this.err = error.response.data.error
            })
        }  
        }).catch(error => {
            console.log(error)
            this.err = error.response.data.error
        })
    },
    createComment: function(id) {
      this.$store.dispatch('createComment', {
        postId: id,
        bodyComment: this.comment,
        userId: this.$store.state.user.id,
      }).then(response =>{
        this.comment = '';
        if (this.mode == 'mymessages') {
            this.$store.dispatch('getMyPosts')
            .then(response =>{
                console.log(response)
                this.posts = response.data.posts
            }).catch(error => {
                console.log(error)
                this.err = error.response.data.error
            })
        } else {
            this.$store.dispatch('getAllPosts')
            .then(response =>{
                console.log(response)
                this.posts = response.data.posts
            }).catch(error => {
                console.log(error)
                this.err = error.response.data.error
            })
        }       
        console.log(response)
      }).catch(error => {
        console.log(error)
        this.comment = '';
        this.err = error.response.data.error
      })
    },
    modifyComment: function(id) {
      this.$store.dispatch('modifyComment', {
        commentId: id,
        bodyComment: this.comment,
        userId: this.$store.state.user.id,
      }).then(response =>{
        this.comment = '';
        this.commentmode = 'view';
        if (this.mode == 'mymessages') {
            this.$store.dispatch('getMyPosts')
            .then(response =>{
                console.log(response)
                this.posts = response.data.posts
            }).catch(error => {
                console.log(error)
                this.err = error.response.data.error
            })
        } else {
            this.$store.dispatch('getAllPosts')
            .then(response =>{
                console.log(response)
                this.posts = response.data.posts
            }).catch(error => {
                console.log(error)
                this.err = error.response.data.error
            })
        }       
        console.log(response)
      }).catch(error => {
        console.log(error)
        this.comment = '';
        this.err = error.response.data.error
      })
    },
    deleteComment: function (id) {
    this.$store.dispatch('deleteComment', id)
    .then(response =>{
        console.log(response)
        if (this.mode == 'mymessages') {
            this.$store.dispatch('getMyPosts')
            .then(response =>{
                console.log(response)
                this.posts = response.data.posts
            }).catch(error => {
                console.log(error)
                this.err = error.response.data.error
            })
        } else {
            this.$store.dispatch('getAllPosts')
            .then(response =>{
                console.log(response)
                this.posts = response.data.posts
            }).catch(error => {
                console.log(error)
                this.err = error.response.data.error
            })
        }  
    }).catch(error => {
        console.log(error)
        this.err = error.response.data.error
    })
    },
    }
}
</script>

<style>
.card {
    margin: auto;
    margin-bottom: 10px;
    width: 700px;
    display: block;
}
.btn-space{
    display: flex;
    justify-content: space-between;
}

</style>