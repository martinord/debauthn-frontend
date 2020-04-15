<template>
    <div>
        <!--TODO: include input for user-->
        <button type="button" class="btn btn-default" id="attestation" 
            @click="start">Attestation</button>
    </div>
</template>

<script>
import axios from 'axios';
axios.defaults.headers.common['Content-Type'] = "application/json;charset=UTF-8";
import { PublicKeyCredentialCreationOptions, AuthenticatorAttestationResponse } 
    from '../models/attestation.model'


export default {
    name: "Attestation",
    methods: {
        start: () => {
            // request options for sending to authenticator
            let url = "https://localhost:5000/attestation/options"
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
                    let url = "https://localhost:5000/attestation/result"
                    var data = AuthenticatorAttestationResponse.encode(response)
                    axios.post(url, data)
                    .then((res) => {
                        if(res.data.audit.complete)
                            alert('Attestation successful')
                        else
                            alert('Attestation failed')
                    })            
                })
            })
        }
    },
}
</script>

<style>
    
</style>