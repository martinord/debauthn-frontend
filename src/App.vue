<template>
  <div id="app">
    <h1>Operations</h1>
    <img id="logo" class="p-2" src="./assets/login.png"/>
    <Attestation/>
  </div>
</template>

<script>
import Attestation from './components/Attestation.vue'
// import Assertion from './components/Assertion.vue'

export default {
  name: 'App',
  components: {
    Attestation,
    // Assertion,
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 5vw 10vw 5vw 10vw;
}
.body {
  
}
#logo {
  width: 150px;
  padding: 1% 1% 1% 1%;
}
</style>
