<template>

  <v-app>
    <v-container>

      <!-- header -->

      <v-row class="mb-3 mt-3 pa-3 primary lighten-3 elevation-5">
        <v-col>
          <v-row>
            <div class="display-3">DebAuthn</div>
            <img src="./assets/debauthn.png" class="logo">
          </v-row>
          <v-row class="pa-3 subtitle-1 font-thin">
            WebAuthn Authenticator Debugging Tool
          </v-row>
        </v-col>
      </v-row>

      <!-- tabs routing -->

      <v-row>
        <v-tabs>
          <v-tabs-slider></v-tabs-slider>
          <v-tab to="/">Dashboard</v-tab>
          <v-tab to="/attestation">Attestation</v-tab>
          <v-tab to="/assertion">Assertion</v-tab>
        </v-tabs>
      </v-row>

      <!-- dynamic router view -->

      <v-row class="mb-2 mt-2">
        <v-col>
          <router-view></router-view>
        </v-col>
      </v-row>
      
    </v-container>

    <!-- footer -->

    <div class="footer">
      <hr>
      <v-footer>
        <v-spacer></v-spacer>
        <div class="font-thin overline"> DebAuthn - WebAuthn Authenticator Debugging Tool</div>
      </v-footer>
    </div>

    <!-- notification dialog -->

    <v-dialog 
      v-model="showNotification"
      max-width="700"
    >
      <v-card dark>
        <v-card-title>Disclaimer</v-card-title>
        <v-card-text>
          <p>
            <v-icon medium>mdi-alert-circle</v-icon>
            This site is part of an investigation on WebAuthn. The tool is currently under development.
            However, feel free to try it. Any comments are welcome: martino.rivera.dourado at udc dot es 
          </p>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                text
                @click="showNotification = false"
            >
                Dismiss
            </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-app>

</template>

<script>

export default {
  name: 'App',
  components:{
  },
  data() {
    return {
      showNotification: true
    }
  },
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

  .logo {
    height: 60px;
    width: 85px;
    padding-left: 30px;
  }
</style>