<template>

  <v-app>
    <v-container justify-center>
      <v-row>
        <v-col xs="5" md="5">
          <v-row justify-start>
            <v-col cols="5">
              <h1>DebAuthn</h1>
            </v-col>
            <v-col cols="2">
              <v-img src="./assets/debauthn.png"
                     max-height="50px" contain>
              </v-img>
            </v-col>
          </v-row>
          <h5>WebAuthn Authenticator Debugging Tool</h5>
          <br>
          <v-row justify-center>
            <v-tabs>
              <v-tabs-slider></v-tabs-slider>
              <v-tab to="/attestation">Attestation</v-tab>
              <v-tab to="/assertion">Assertion</v-tab>
            </v-tabs>
          </v-row>
        </v-col>
      </v-row>
      <v-row>
        <v-col md="10" xs="5">
          <router-view></router-view>
        </v-col>
      </v-row>
      
    </v-container>

    <div class="footer">
      <hr>
      <v-footer align="center">
        <v-spacer></v-spacer>
        <i> DebAuthn - WebAuthn Authenticator Debugging Tool</i>
      </v-footer>
    </div>

  </v-app>

</template>

<script>

export default {
  name: 'App',
  components:{
  }
};

</script>

<style lang="css">
  .footer{
    width: 100%;
    bottom:0;
    position:absolute;
  }

  /* Inset, by Dan Eden */
  hr {
      border: 0;
      height: 0;
      border-top: 1px solid rgba(0, 0, 0, 0.1);
      border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  }
</style>