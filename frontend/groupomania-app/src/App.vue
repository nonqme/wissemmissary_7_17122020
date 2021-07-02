<template>
  <Nav/>  
  <router-view/>
</template>

<script>
import Nav from '@/components/Nav';

export default {
  components: {Nav}
}
</script>


<style lang="scss">
.form-signin {
  width: 100%;
  max-width: 330px;
  padding: 15px;
  margin: auto;
}

.form-signin .checkbox {
  font-weight: 400;
}

.form-signin .form-floating:focus-within {
  z-index: 2;
}


.form-signin input[type="password"] {
  margin-bottom: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}

.form-signin input[type="login"] {
  margin-bottom: -1px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}

.error {
  &__message{
  color: red;
  margin: 0;
  }
  &__code{
    color: red;
    padding-top: 10px;
    margin: 0;
  }
}


</style>
