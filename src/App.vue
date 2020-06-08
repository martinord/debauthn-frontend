<template>
  <v-app>
    <v-container>
      <!-- header -->

      <v-row class="header mb-4 mt-4 pa-5 pb-6 primary lighten-3 elevation-5">
        <v-col>
          <v-row @click="$router.push({path:'/'})" justify="center" align="center">
            <img src="./assets/header.png" class="logo" />
          </v-row>
          <!-- <v-row class="pa-5 subtitle-1 font-thin">WebAuthn Authenticator Debugging Tool</v-row> -->
        </v-col>
      </v-row>

      <!-- tabs routing -->

      <v-row justify="center" class="elevation-3">
        <v-tabs background-color="primary" dark show-arrows>
          <v-tab to="/">Dashboard</v-tab>
          <v-tab to="/attestation">Register</v-tab>
          <v-tab to="/assertion">Authenticate</v-tab>
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
      <hr />
      <v-footer>
        <v-spacer></v-spacer>
        <div class="font-thin overline">DebAuthn - WebAuthn Authenticator Debugging Tool</div>
      </v-footer>
    </div>

    <!-- notification dialog -->

    <v-dialog v-model="showNotification" max-width="700">
      <v-card dark>
        <v-card-title>Disclaimer</v-card-title>
        <v-card-text>
          <p>
            <v-icon medium>mdi-alert-circle</v-icon>This site is part of an investigation on WebAuthn. The tool is currently under development.
            However, feel free to try it. Any comments are welcome: martino.rivera.dourado at udc dot es
          </p>
          <v-progress-circular
            class="ma-5"
            v-if="compatible===undefined"
            indeterminate
            color="white"
          >
            Testing browser...
          </v-progress-circular>
          <v-alert class="mt-2 mb-2"
            v-else-if="!compatible"
            border="right"
            colored-border
            elevation="2"
            prominent
            transition="scale-transition" 
            type="error"
        >
            <b>Oh no! Your browser does not support WebAuthn.</b> 
            <v-divider class="mt-2 mb-2"></v-divider>
            You can try with Firefox (v.60 or later) or Chrome/Chromium (v.70 or later).
            <v-divider class="mt-2 mb-2"></v-divider>
            Your browser name is {{ ua }}
        </v-alert>
        <v-alert class="mt-2 mb-2"
            v-else
            border="right"
            colored-border
            elevation="2"
            prominent 
            transition="scale-transition" 
            type="info"
        >
            Your browser supports WebAuthn! You can use the tool!
        </v-alert>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="showNotification = false">Dismiss</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
export default {
  name: "App",
  components: {},
  data() {
    return {
      showNotification: true,
      compatible: undefined,
      ua: ""
    };
  },
  methods: {
    featureDetection(){
      return !!(navigator.credentials && navigator.credentials.create && navigator.credentials.get && window.PublicKeyCredential);
    }
  },
  mounted() {
    this.ua = navigator.userAgent
    this.compatible = this.featureDetection()
  },
};
</script>

<style lang="css">
.footer {
  width: 100%;
  bottom: 0;
  position: absolute;
}

/* Inset, by Dan Eden */
hr {
  border: 0;
  height: 0;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
}

.logo {
  max-height: 140px;
  max-width: 100%;
}

.header {
  min-height: 180px;
}
</style>