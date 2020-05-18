<template>
    <v-content>
        <v-banner>Assertion operation uses an authenticator to log into the system</v-banner>
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
                Assertion options
                <small>Request and edit Assertion options</small>
            </v-stepper-step>
            <v-stepper-content step="1">
                
                <assertion-options class="mb-5" 
                    :options="options"
                    @updated="options=$event"
                ></assertion-options>

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
                    color="grey lighten-3"
                >
                    <object-tree
                        :object="encoded_response.response">
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
                    <v-banner>You have successfully authenticated the credential through Assertion operation.</v-banner>
                    
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
import { PublicKeyCredentialRequestOptions, AuthenticatorAssertionResponse } 
    from '../models/assertion.model'
import AssertionOptions from './forms/AssertionOptions'
import ObjectTree from './ObjectTree';

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

            // request options for sending to authenticator
            let url = "/assertion/options"
            axios.post(url, JSON.stringify({  }))
            .then((res) => {
                this.options = res.data;
            })
            .catch((error) => {
                this.onError(error)
            })
        },
        authenticator() {
            this.removeDialogs();
            this.current_step = 2;
            this.response = {}
            this.encoded_response = {}
            this.loading = true

            navigator.credentials.get({
                publicKey: PublicKeyCredentialRequestOptions.decode(this.options) 
            })
            .then((response) => {
                this.response = response
                this.encoded_response = AuthenticatorAssertionResponse.encode(this.response)
                this.loading = false
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
            let url = "/assertion/result"
            var data = this.encoded_response
            axios.post(url, data)
            .then((res) => {
                this.validation = res.data
                if(this.validation.complete)
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
            this.showError = true;
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