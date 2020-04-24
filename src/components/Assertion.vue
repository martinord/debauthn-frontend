<template>
    <div>
        <!--TODO: include input for user-->
        <button type="button" class="btn btn-default" id="attestation" 
            @click="start">Assertion</button>
    </div>
</template>

<script>
import axios from 'axios';
axios.defaults.headers.common['Content-Type'] = "application/json;charset=UTF-8";
import { PublicKeyCredentialRequestOptions, AuthenticatorAssertionResponse } 
    from '../models/assertion.model'

export default {
    name: "Assertion",
    methods: {
        start: () => {
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
                            alert('Assertion successful')
                        else
                            alert('Assertion failed')
                    })            
                })
            })
        }
    },
}
</script>

<style>
    
</style>