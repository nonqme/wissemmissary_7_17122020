<template>
<section class="container-fluid col-5">
    <div>
        <form @submit.prevent="handleSubmit" class="card-body">
            <label class="sr-only" for="message">Post</label>
            <textarea v-model="post" class="form-control" id="message" rows="3" placeholder="What are you thinking?"></textarea>
            <button type="submit" class="btn btn-primary">share</button>
        </form>
    </div>
    <article v-for="message in messages.slice().reverse()" :key="message.id" card gedf-card>
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
    </article>
</section>       
</template>

<script>
import axios from 'axios'
export default {
    name:"Home",
    data() {
        return {
            messages: [],
            fullname:'',
            userId:'',
            post:'',
        }
    },
    beforeMount(){
        const name = localStorage.getItem('userFullName')
        if (name === null) {
            this.fullname = sessionStorage.getItem('userFullName')
            this.userId = sessionStorage.getItem('userid')
        } else {
            this.fullname = name;
            this.userId = localStorage.getItem('userid')
        }

    },
    methods: {
        handleSubmit(){
        console.log(this.fullname)
        console.log(this.userId)
          const data = {
            id: this.userId,
            post: this.post,
          }
          axios.post('http://localhost:3000/api/messages/post', data, {
                headers: {
                    Authorization:'Bearer ' + sessionStorage.getItem('token')
                },
  
            })
            .then (
              () => {
                this.$router.go();
              }
            ).catch(
              err => {
                this.error = err.message
                this.errorMessage = err.response.data.error
                console.log(err)
              }
            )
    }
},
    created() {
        const lsToken = localStorage.getItem('token');
        const ssToken = sessionStorage.getItem('token');
        if ((lsToken === null) && (ssToken === null)){
            this.$router.push('/');
        }
        else if (ssToken === null) {
            axios.get('http://localhost:3000/api/messages/allmessages', {
                headers: {
                    Authorization:'Bearer ' + localStorage.getItem('token')
                },
                params: {
                        id: localStorage.getItem('userid')
                },   
            })
            .then (res => {
                    this.messages = res.data.message;
                }
            ).catch(
                () => {
                }
            )
        }
        else if (lsToken === null){
                    axios.get('http://localhost:3000/api/messages/allmessages', {
                headers: {
                    Authorization:'Bearer ' + sessionStorage.getItem('token')
                },
                params: {
                    id: sessionStorage.getItem('userid')
                },  
            })
            .then (
                res => {
                    this.messages = res.data.message;
                }
            ).catch(
                ()=> {
                }
            )
        }
    },
}
</script>