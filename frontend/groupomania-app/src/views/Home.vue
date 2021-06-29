<template>
    <h1> Hello </h1>
</template>

<script>
import axios from 'axios'
export default {
    name:"home",
    created() {
        axios.get('http://localhost:3000/api/messages/allmessages', {
            headers: {
                Authorization:'Bearer ' + localStorage.getItem('token')
            }
        })

    }
}
</script>