<template>
    <v-col>
        <v-card>
            <v-card-title>
                <h1 class="headline font-weight-thin">Welcome to Debauthn</h1>
            </v-card-title>
            <v-card-text>
                <v-alert
                class="mb-5 mt-5 pl-8"
                type=""
                colored-border
                border="left"
                color="primary"

                >
                    <div class="overline mb-6">What is Debauthn?</div>
                    DebAuthn serves as a debugger for <b><a href="https://www.w3.org/TR/webauthn/" target="_blank"> WebAuthn</a>, a new
                    standard for authenticating identities on the web</b>.
                    <v-divider class="mb-2 mt-2"></v-divider>
                    In brief, you can be registered and, afterwards, logged in. <b>In WebAuthn, this means, respectively, registering and authenticating a credential with an authenticator</b>.
                    <v-divider class="mb-2 mt-2"></v-divider>
                    DebAuthn mimics the functioning of the  WebAuthn protocol by using <b>session information</b>, storing the minimal necessary information at the Relying Party server
                    during 60 minutes. This allows testers to perform independent tests and <b>work with credentials</b> instead of users.  
                    <v-divider class="mb-2 mt-2"></v-divider>
                    As there are no users in the system, notice that the registered credentials are tight to the session id. That means that a registered credential in one device will not be available in a different device.
                    Thus, <b>the credentials are not linked to an user account, making them independent and not roaming credentials</b>. 
                    <v-divider class="mb-2 mt-2"></v-divider>
                    In order to better understand registering and authenticating operations, both of them are divided in three steps:
                    <ol class="ma-2">
                        <li><b>Options:</b> configure the operation</li>
                        <li><b>Authenticator:</b> call the authenticator</li>
                        <li><b>Validation:</b> validate the result of the operation</li>
                    </ol>            
                    <v-divider class="mb-2 mt-2"></v-divider>
                </v-alert>
            </v-card-text>
        </v-card>
        <v-card>
            <v-card-title class="overline">Browser compatibility check</v-card-title>
            <v-card-text>
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
                    border="left"
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
                    border="left"
                    colored-border
                    elevation="2"
                    prominent 
                    transition="scale-transition" 
                    type="info"
                    color="secondary"
                >
                    Your browser supports WebAuthn! You can use the tool!
                </v-alert>
            </v-card-text>
        </v-card>
    </v-col>
</template>

<script>
import axios from 'axios';
axios.defaults.headers.common['Content-Type'] = "application/json;charset=UTF-8";
export default {
    name: 'Dashboard',
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
}
</script>

<style scoped>

</style>