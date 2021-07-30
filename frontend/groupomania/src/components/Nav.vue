<template>
    <header>
        <nav class="navbar navbar-expand-md navbar-dark bg-dark mb-4">
            <div class="container-fluid">
                <router-link to="/" class="navbar-brand">Accueil</router-link>
                <div>
                    <ul class="navbar-nav me-auto mb-2 mb-md-0">
                        <li class="nav-item">
                            <router-link to="/posts" class="nav-link">Messages</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link to="/profile" class="nav-link">Profile</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link to="/" class="nav-link" @click="logOut">Log Out</router-link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    </header>   
</template>

<script>
export default {
    name:"Nav",
    methods: {
        logOut: function () {
            this.$store.commit('logOut');
            this.$router.push('/');
        }
    }
}
</script>

<style>

</style>