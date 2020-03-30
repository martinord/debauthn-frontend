<template>
  <div class="login">
    <img alt="Login logo" src="../assets/login.png">
    <h1>Login Page</h1> 
    <button v-on:click="createCredentials">Create credentials</button>
  </div>
</template>

<script>
export default {
  name: 'Login',
  props: {
  },
  methods: {
      createCredentials: function(){
        // TODO: create credentials
        // TODO: backend url
        console.log('createCredentials');
        var req = new XMLHttpRequest();
        let url = "http://localhost:5000/attestation/options"
        req.onreadystatechange = function() {
            console.log('got reply')
            if (this.readyState == 4 && this.status == 200) {
                var myArr = JSON.parse(this.responseText);
                console.log(myArr);
            }
        };
        req.open("POST", url, true);
        req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        req.send(JSON.stringify({  }));
        //navigator.credentials.create();
      }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
img {
  width: 200px;
}
</style>
