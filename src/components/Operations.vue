<template>
  <div class="operations">
    <h1>Operations</h1> 
    <img id="logo" class="p-2" src="../assets/login.png">
    <div class="container center-block">
      <div class="btn-group" role="group">
        <button type="button" class="btn btn-default" id="attestation" v-on:click="attestation">Attestation</button>
        <button type="button" class="btn btn-default" id="assertion" v-on:click="assertion">Assertion</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Operations',
  props: {
  },
  methods: {
    attestation: () => {
      var req = new XMLHttpRequest();
      let url = "/attestation/options"
      req.onreadystatechange = async function() {
          if (this.readyState == 4 && this.status == 200) {
              // parsing JSON
              var options = JSON.parse(this.responseText);
              options.challenge = new Buffer(options.challenge);
              options.user.id = new Buffer(options.user.id);
              // configure user
              options.user.name = "john.p.smith@example.com";
              options.user.displayName = "John P. Smith";
              
            // call to authenticator with publicKeyCredentialCreationOptions
            navigator.credentials.create({ publicKey: options }).then((reply) => {
              // request attestation result
              var req2 = new XMLHttpRequest();
              let url = "/attestation/result"
              req2.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200){
                  var result = JSON.parse(this.responseText);
                  console.log(result);
                }
              }
              // deserialize to JSON
              var myreply = {id: reply.id};
              myreply.rawId = new Buffer(reply.rawId);
              myreply.response = {
                attestationObject: new Buffer(reply.response.attestationObject),
                clientDataJSON: new Buffer(reply.response.clientDataJSON)
              }
              req2.open("POST", url, true);
              req2.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
              req2.send(JSON.stringify(myreply));
              
            })
          }
        };
      req.open("POST", url, true);
      req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      req.send(JSON.stringify({  }));
    },

    assertion: () => {
      // TODO: implement assertion
      console.log('assertion')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#logo {
  width: 150px;
  padding: 1% 1% 1% 1%;
}
</style>
