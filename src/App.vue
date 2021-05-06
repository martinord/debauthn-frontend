<template>
  <v-app id="inspire">
      <!-- header -->
      <v-app-bar
        app
        color="white"
        flat
      >
        <!-- TODO: profile -->

        <v-container class="py-0 fill-height">
          <v-avatar
            @click="$router.push({path:'/'})"
            class="mr-10"
            color="primary"
            size="35"
          >
            <img
              src="favicon.ico"
            >
          </v-avatar>

          <v-btn text to="/">Dashboard</v-btn>
          <v-btn text to="/register">Register</v-btn>
          <v-btn text to="/authenticate">Authenticate</v-btn>

          <v-spacer></v-spacer>

          <img
            height="40"
            src="./assets/header.png"
          >
        </v-container>

      </v-app-bar>


     <v-main class="primary lighten-4">
      <v-container>
        <v-row>
          <v-col cols="3">
            <v-sheet rounded="lg">
              <registered-credentials ref="registeredCredentials"></registered-credentials>
            </v-sheet>
          </v-col>

          <v-col cols="9">
            <v-sheet
              min-height="70vh"
              rounded="lg"
            >
              <router-view @updatedCredential="updatedCredentialHandler"></router-view>
            </v-sheet>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <!-- footer -->

    <v-footer absolute>
      <div class="font-thin overline">Developed by <a href="https://github.com/martinord" target="_blank">martinord</a></div>
      <v-spacer></v-spacer>
      <div class="font-thin overline">DebAuthn - WebAuthn Authenticator Debugging Tool</div>
    </v-footer>
    
  </v-app>
</template>

<script>
import RegisteredCredentials from './components/RegisteredCredentials';

export default {
  name: "App",
  components: {
    'registered-credentials': RegisteredCredentials
  },
  methods: {
    updatedCredentialHandler() {
      this.$refs.registeredCredentials.fetchRegisteredCredentials()
    }
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