<template>
<div>
    <h1> Hello </h1>
    <p>{{data}}</p>
</div>    
    
</template>

<script>
import axios from 'axios'
export default {
    name:"Home",
    data() {
        return {
            data: {}
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
                }
            })
            .then (
                res => {
                    this.data = res.data.message[0].post
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
                }
            })
            .then (
                res => {
                    this.data = res.data.message[0].post
                }
            ).catch(
                ()=> {
                }
            )
        }
    }
}
</script>