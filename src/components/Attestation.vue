<template>
    <v-content>
        <v-banner>Attestation operation registers an authenticator in the system</v-banner>
        <!--TODO: include input for user-->
        <br>
        <v-content>
            <v-btn rounded type="button" class="btn btn-default" id="attestation" 
            @click="start">Attestation</v-btn>
        </v-content>

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
      showError: false
    }),
    methods: {
        start() {
            this.showSuccess = false;
            this.showError = false;
            // request options for sending to authenticator
            let url = "/attestation/options"
            axios.post(url, JSON.stringify({  }))
            .then((res) => {
                var options = PublicKeyCredentialCreationOptions.decode(res.data);
                // TODO: change with HTML input
                options.user.name = "john.p.smith@example.com";
                options.user.displayName =  "John P. Smith";
                // call to authenticator with options
                navigator.credentials.create({ publicKey: options })
                .then((response) => {
                    // send authenticator response and wait for verification
                    let url = "/attestation/result"
                    var data = AuthenticatorAttestationResponse.encode(response)
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
            this.showError = true;
            console.log("Catched error!")
            if(error.response.data) console.log(error.response.data)
            else console.log(error)
        }
    },
}
</script>

<style>
    
</style>