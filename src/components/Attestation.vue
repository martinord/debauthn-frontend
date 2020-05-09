<template>
    <v-content>
        
        <v-banner>Attestation operation registers an authenticator in the system</v-banner>
        <!--TODO: include input for user-->

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

            <v-stepper-step editable :complete="current_step > 1" step="1">
                Request Attestation options
                <small>Send a request to obtain Attestation options</small>
            </v-stepper-step>
            <v-stepper-content step="1">
                <v-card
                    class="mb-12"
                    color="grey lighten-1"
                >
                    {{ options }}
                </v-card>

                <v-btn
                    color="primary"
                    @click="authenticator()"
                >
                Continue
                </v-btn>

                <v-btn 
                    text
                    @click="request()"
                >
                Reload
                </v-btn>
            </v-stepper-content>

            <v-stepper-step :complete="current_step > 2" step="2">
                Call the authenticator
                <small>Request authenticator through WebAuthn API</small>
            </v-stepper-step>
            <v-stepper-content step="2">
                <v-card
                    class="mb-12"
                    color="grey lighten-1"                    
                >
                    {{ response }}
                </v-card>

                <v-btn
                    color="primary"
                    @click="post()"
                >
                Continue
                </v-btn>

                <v-btn 
                    text
                    @click="authenticator()"
                >
                Reload
                </v-btn>
            </v-stepper-content>

            <v-stepper-step step="3">
                Post the response and validate
                <small>Send result and request its validation</small>
            </v-stepper-step>
            <v-stepper-content step="3">
                <v-card
                    class="mb-12"
                    color="grey lighten-1"
                >
                    {{ validation }}
                </v-card>

                <v-btn
                    color="primary"
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
                <v-card-title class="headline">Successful</v-card-title>

                <v-card-text>
                You have successfully registered the credential through Attestation operation.
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn
                        color="green darken-1"
                        text
                        @click="showSuccess = false"
                    >
                        Close
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-content>
</template>

<script>
import axios from 'axios';
axios.defaults.headers.common['Content-Type'] = "application/json;charset=UTF-8";
import { PublicKeyCredentialCreationOptions, AuthenticatorAttestationResponse } 
    from '../models/attestation.model'


export default {
    name: "Attestation",
    data: () => ({
      showSuccess: false,
      showError: false,
      error: "An error occurred",
      current_step: 1,
      options:{},
      response: {},
      validation: {}
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
            this.request()
        },
        request() {
            this.removeDialogs();
            this.current_step = 1;

            // request options for sending to authenticator
            let url = "/attestation/options"
            axios.post(url, JSON.stringify({  }))
            .then((res) => {
                this.options = PublicKeyCredentialCreationOptions.decode(res.data);
                // TODO: change with HTML input
                this.options.user.name = "john.p.smith@example.com";
                this.options.user.displayName =  "John P. Smith";
            })
            .catch((error) => {
                this.onError(error)
            })
        },
        authenticator() {
            this.removeDialogs();
            this.current_step = 2;
            this.response = {}

            navigator.credentials.create({ publicKey: this.options })
            .then((response) => {
                this.response = response
            })
            .catch((error) => {
                this.onError(error)
            })
        },
        post() {
            this.removeDialogs();
            this.current_step = 3;
            this.validation = {}

            // send authenticator response and wait for verification
            let url = "/attestation/result"
            var data = AuthenticatorAttestationResponse.encode(this.response)
            axios.post(url, data)
            .then((res) => {
                this.validation = res.data
                if(res.data.audit.complete)
                    this.showSuccess = true
            })
            .catch((error) => {
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
            this.showError = true
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