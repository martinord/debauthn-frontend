<template>
    <v-content>
        
        <v-banner>Attestation operation registers an authenticator in the system</v-banner>

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
                Attestation options
                <small>Request and edit Attestation options</small>
            </v-stepper-step>
            <v-stepper-content step="1">

                <attestation-options class="mb-5"
                    :options="options"
                    @updated="options=$event"
                ></attestation-options>

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
                <v-card
                    class="mb-12"
                    color="grey lighten-3"                    
                >
                    <object-tree
                        :object="encoded_response">
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
                <v-card
                    class="mb-12"
                    color="grey lighten-3"
                >
                    <object-tree
                        :object="validation.data"
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
                <v-card-title class="headline">Successful</v-card-title>

                <v-card-text>
                    <v-banner>You have successfully registered the credential through Attestation operation.</v-banner>
                    
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
import AttestationOptions from './forms/AttestationOptions'
import ObjectTree from './ObjectTree';

export default {
    name: "Attestation",
    components: {
        'attestation-options': AttestationOptions,
        'object-tree': ObjectTree
    },
    data: () => ({
      showSuccess: false,
      showError: false,
      error: "An error occurred",
      current_step: 1,
      errorOnStep: [false, false, false],
      loading: true,
      options:{},
      response: {},
      validation: {},
      encoded_response: {}
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
            let url = "/attestation/options"
            axios.post(url, JSON.stringify({  }))
            .then((res) => {
                this.options = res.data;
                this.options.user.name = "john.p.smith@example.com";
                this.options.user.displayName =  "John P. Smith";
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
            this.encoded_response = {}
            this.loading = true
            
            navigator.credentials.create({ 
                publicKey: PublicKeyCredentialCreationOptions.decode(this.options) 
            })
            .then((response) => {
                this.response = response
                this.encoded_response = AuthenticatorAttestationResponse.encode(this.response)
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
            let url = "/attestation/result"
            var data = this.encoded_response
            axios.post(url, data)
            .then((res) => {
                this.validation = res.data
                if(this.validation.complete)
                    this.showSuccess = true
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
            this.showError = true
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