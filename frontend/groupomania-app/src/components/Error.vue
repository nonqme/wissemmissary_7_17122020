<template>
    <div class="error">
        <p class="error__code">{{error}}</p>
        <p class="error__message">{{errorMessage}}</p>
    </div>
</template>
<script>
export default {
    name:"Error",
    data() {
      return {
        error:'',
        errorMessage:'',
      }
    },
}    
</script>
<style lang="sass">

</style>
