<template>
    <v-content>
        <v-banner>Assertion operation uses an authenticator to log into the system</v-banner>
        <!--TODO: include input for user-->
        <br>
        <v-content>
            <v-btn rounded @click="start">Assertion</v-btn>
        </v-content>

        <br>

        <!-- dinamic alert on error -->

        <v-alert
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

        <!-- dinamic success dialog -->

        <v-dialog
            v-model="showSuccess"
            max-width="700"
        >
            <v-card>
                <v-card-title class="headline">Successful</v-card-title>

                <v-card-text>
                You have successfully authenticated the credential through Assertion operation.
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

export default {
    name: "Assertion",
    data: () => ({
      showSuccess: false,
      showError: false,
      error: "An error occurred"
    }),
    methods: {
        start() {
            this.showSuccess = false;
            this.showError = false;
            // request options for sending to authenticator
            let url = "/assertion/options"
            axios.post(url, JSON.stringify({  }))
            .then((res) => {
                var options = (res.data)
                options = PublicKeyCredentialRequestOptions.decode(options)
                // call to a.uthenticator with options
                navigator.credentials.get({ publicKey: options })
                .then((response) => {
                    // send authenticator response and wait for verification
                    let url = "/assertion/result"
                    var data = AuthenticatorAssertionResponse.encode(response)
                    axios.post(url, data)
                    .then((res) => {
                        if(res.data.audit.complete)
                            this.showSuccess = true
                    })
                    .catch((error) => {
                        this.onError(error)
                    })            
                })
            })
        },
        onError(error) {
            console.log("Catched error!")
            if(error.response.data) this.error = error.response.data
            else this.error = error
            this.showError = true;
        }
    },
}
</script>

<style>
    
</style>