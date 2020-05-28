<template>
    <div>
        <div class="headline font-weight-thin">Registered Credentials</div>
        <v-alert
            v-if="error.happened"
            type="error"
            colored-border
            border="bottom"
            dismissible
        >
            Error connecting with backend: {{error.msg}}
        </v-alert>
        <v-alert
            class="ma-2"
            type="info"
            icon="mdi-key"
            colored-border
            border="bottom"
            prominent
            v-else-if="registeredCredentials.length<1"
        >
            <div class="overline mb-3">No registered credentials</div> 
            <v-divider class="mb-2"></v-divider>
            <b>Attestation</b> is the process that registers a credential in the system. 
            Then, the registered credentials will appear in this section and you will be able
            to authenticate them through <b>Assertion</b> operation.
            <b>Important: The registered credentials are stored within the session. This session lasts 60 minutes.</b>
            <v-divider class="mt-3 mb-2"></v-divider>
            <router-link to="/attestation">Register a credential</router-link>
        </v-alert>
        <v-row v-else v-for="credential in registeredCredentials" :key="credential.id">
            <v-col>
                <v-card hover>
                    <v-list-item>
                        <v-list-item-content>
                            <div class="overline mb-4">public-key credential</div>
                            <div class="font-weight-light mb-2"> id: {{credential.rawId}}</div>
                            <div class="font-weight-thin mb-1">counter:{{credential.counter}}</div>
                            <v-card class="mb-2 mt-2">
                                <v-list-item>
                                    <v-list-item-content>
                                         <div class="overline">public key</div>
                                    </v-list-item-content>
                                </v-list-item>
                                <v-card-text>
                                    {{credential.publicKey}}
                                </v-card-text>
                            </v-card>
                        </v-list-item-content>
                    </v-list-item>
                </v-card>
            </v-col>
        </v-row>
    </div>
</template>

<script>
import axios from 'axios';
axios.defaults.headers.common['Content-Type'] = "application/json;charset=UTF-8";
export default {
    name: 'Dashboard',
    data() {
        return {
            error: {happened: false, error: "An error occurred"},
            registeredCredentials: []
        }
    },
    methods: {
        fetchRegisteredCredentials(){
            let url = "/registered"
            axios.get(url)
            .then((res) => {
                this.registeredCredentials = res.data
            })
            .catch((error) => {
                this.error.happened = true
                this.error.msg = error
            })
        }
    },
    mounted(){
        this.fetchRegisteredCredentials();
    }
}
</script>

<style scoped>

</style>