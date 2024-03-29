<template>
    <v-col>
        <v-alert
            class="mb-5"
            type="info"
            icon="mdi-login"
            colored-border
            border="bottom"
            prominent
            color="primary"
        >
            <div class="overline mb-3">Assertion ceremony</div>
            
            This section allows to <b>authenticate with a credential through Assertion operation</b>.
            
            <v-divider class="mb-2 mt-2"></v-divider>
            
            In order to authenticate (log in) with a credential, it should be already registered in the system.
            
            <v-divider class="mb-2 mt-2"></v-divider>
            
            <b>The authenticator will sign a challenge from the server with the private key of a registered credential.</b>
            
            <v-divider class="mb-2 mt-2"></v-divider>
        </v-alert>

        <!-- dinamic alert on error -->

        <v-alert class="mt-2 mb-2"
            border="right"
            colored-border
            elevation="2" 
            dismissible 
            transition="scale-transition" 
            type="error" 
            v-model="showError"
        >
            {{ error }}
        </v-alert>

        <v-stepper class="mt-12" v-model="current_step" vertical>

            <v-stepper-step 
                editable 
                :complete="current_step > 1"
                :rules="[() => !errorOnStep[0]]" 
                step="1"
            >
                Authentication options
                <small>Assertion options</small>
            </v-stepper-step>
            <v-stepper-content step="1">
                
                <v-banner 
                    class="mb-5 elevation-3"
                >
                    <b>The following form shows the Assertion options fetched from the server.</b>
                    <hr class="ma-2">
                    Here you can modify the options before they are sent to the authenticator.
                    Also, you can fetch new options from the server with the reload button at the bottom. 
                </v-banner>

                <assertion-options class="mb-5" 
                    :options="options"
                    @updated="options=$event"
                ></assertion-options>
                <v-container 
                    class="mb-8"
                    v-if="loading"
                >
                    <v-progress-linear
                        indeterminate
                        color="primary darken-1"
                    ></v-progress-linear>
                </v-container>

                <v-btn
                    color="primary"
                    :disabled="errorOnStep[0] || loading"
                    @click="authenticator()"
                >
                Continue
                </v-btn>

                <v-icon
                    class="ml-4 mr-4"
                    @click="request()"
                >
                    mdi-reload
                </v-icon>
            </v-stepper-content>

            <v-stepper-step 
                :complete="current_step > 2" 
                :rules="[() => !errorOnStep[1]]"
                step="2"
            >
                Call the authenticator
                <small>Request authenticator through WebAuthn API</small>
            </v-stepper-step>
            <v-stepper-content step="2">

                <v-banner 
                    class="mb-5 elevation-3"
                >
                    <b>The authenticator has been requested</b>
                    <hr class="ma-2">
                    Once the authenticator responds with the information it will be shown in this section.
                    You can navigate through the encoded infromation by clicking on the fields.  
                </v-banner>

                <v-card
                    class="mb-12"
                    color="grey lighten-3"
                >
                    <object-tree
                        :object="response">
                    </object-tree>
                </v-card>
                <v-container 
                    class="mb-8"
                    v-if="loading"
                >
                    <v-progress-linear
                        indeterminate
                        color="primary darken-1"
                    ></v-progress-linear>
                </v-container>
                
                <v-btn
                    color="primary"
                    :disabled="errorOnStep[1] || loading"
                    @click="post()"
                >
                Continue
                </v-btn>

                <v-icon
                    class="ml-4 mr-4"
                    @click="authenticator()"
                >
                    mdi-reload
                </v-icon>
            </v-stepper-content>

            <v-stepper-step 
                :rules="[() => !errorOnStep[2]]"
                step="3"
            >
                Validation
                <small>Send result and request its validation</small>
            </v-stepper-step>
            <v-stepper-content step="3">

                <v-banner 
                    class="mb-5 elevation-3"
                >
                    <b>The result has been posted to the server, parsed and validated</b>
                    <hr class="ma-2">
                    You can navigate through the infromation by clicking on the fields.
                    Here you will find information about your authenticator as well as
                    the decoded data exchanged during the operation. 
                </v-banner>

                <v-card
                    class="mb-12"
                    color="grey lighten-3"
                > 
                    <object-tree
                        :object="validation.authenticationInfo"
                    ></object-tree>
                </v-card>
                <v-container 
                    class="mb-8"
                    v-if="loading"
                >
                    <v-progress-linear
                        indeterminate
                        color="primary darken-1"
                    ></v-progress-linear>
                </v-container>

                <v-btn
                    color="primary"
                    :disabled="errorOnStep[2] || loading"
                    @click="start()"
                >
                Finish
                </v-btn>
            </v-stepper-content>
        </v-stepper>

        <!-- dinamic success dialog -->

        <v-dialog
            v-model="showSuccess"
            max-width="700"
        >
            <v-card>
                <v-card-title class="overline">Successfully authenticated</v-card-title>

                <v-card-text>
                    <v-alert 
                        type="info" 
                        colored-border 
                        icon="mdi-alert-circle-check"
                    >
                        <b>The server has validated the signature so you have successfully logged in through Assertion operation.</b>
                        
                        <hr class="ma-3">
                        
                        All information is shown in this page. Close this dialog to navigate through it.
                        
                        <hr class="ma-3">
                        
                        You can also check the credential <b>counter</b> in the registered credentials in the <router-link to="/">dashboard</router-link>.
                    </v-alert>
                    
                    <v-alert 
                        v-for="warning in this.validation.warnings" :key="warning"
                        type="warning"
                    >
                        {{ warning[0] }}: {{ warning[1] }}
                    </v-alert>
                
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn
                        color="primary darken-1"
                        text
                        @click="showSuccess = false"
                    >
                        Close
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-col>
</template>

<script>
import axios from 'axios';
axios.defaults.headers.common['Content-Type'] = "application/json;charset=UTF-8";
import AssertionOptions from './forms/AssertionOptions'
import ObjectTree from './ObjectTree';
import * as SimpleWebAuthnBrowser from '../assets/js/index.umd.min.js'


export default {
    name: "Assertion",
    components: {
        'assertion-options': AssertionOptions,
        'object-tree': ObjectTree
    },
    data: () => ({
      showSuccess: false,
      showError: false,
      error: "An error occurred",
      loading: true,
      current_step: 1,
      errorOnStep: [false, false, false],
      options:{},
      response: {},
      validation: {},
    }),
    methods: {
        removeDialogs() {
            this.showSuccess = false;
            this.showError = false;
        },
        start() {
            this.options = {},
            this.response = {},
            this.validation = {}
            this.loading = true
            this.request()
        },
        request() {
            this.removeDialogs();
            this.current_step = 1;
            this.loading = true;

            // request options for sending to authenticator
            let url = "/assertion/options"
            axios.get(url)
            .then((res) => {
                this.options = res.data;
                this.loading = false
                this.errorOnStep[0] = false
            })
            .catch((error) => {
                this.errorOnStep[0] = true
                this.onError(error)
            })
        },
        authenticator() {
            this.removeDialogs();
            this.current_step = 2;
            this.response = {}
            this.loading = true

            SimpleWebAuthnBrowser.startAuthentication(this.options)
            .then((response) => {
                this.response = response
                this.loading = false
                this.errorOnStep[1] = false
            })
            .catch((error) => {
                this.errorOnStep[1] = true
                this.onError(error)
            })
        },
        post() {
            this.removeDialogs();
            this.current_step = 3;
            this.validation = {}
            this.loading = true

            // send authenticator response and wait for verification
            let url = "/assertion/result"
            var data = this.response
            axios.post(url, data)
            .then((res) => {
                this.validation = res.data
                if(this.validation.verified) {
                    this.showSuccess = true
                    this.$emit('updatedCredential')
                }
                this.loading = false
                this.errorOnStep[2] = false
            })
            .catch((error) => {
                this.errorOnStep[2] = true
                this.onError(error)
            })
        },
        all() {
            this.request();
            this.authenticator();
            this.post();
        },
        onError(error) {
            console.log("Catched error!")
            if(error.response && error.response.data) 
                this.error = error.response.data
            else this.error = error
            this.showError = true;
            this.loading = false
        }
    },
    mounted() {
        // launch on mounted element
        this.start()
    },
}
</script>

<style>
    
</style>