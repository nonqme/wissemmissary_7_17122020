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
        axios.get('http://localhost:3000/api/messages/allmessages', {
            headers: {
                Authorization:'Bearer ' + localStorage.getItem('token')
            }
        })
        .then (
            res => {
                console.log(res.data.message[0].post)
                this.data = res.data.message[0].post
            }
        ).catch(
            err => {
            console.log(err)
            }
        )

    }
}
</script>