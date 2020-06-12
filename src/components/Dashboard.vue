<template>
    <div>
        <div class="headline font-weight-thin">Welcome to Debauthn</div>
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

        <v-divider class="mb-2 mt-2"></v-divider>
        
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
            color="primary lighten-3"
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
        <v-row v-if="registeredCredentials.length > 0">
            <v-btn color="error accent-1" class="ma-2" @click="showConfirm = true">Delete all</v-btn>
            <v-dialog v-model="showConfirm" max-width="700">
                <v-alert type="warning" prominent colored-border border="left">
                    <b class="headline">Delete all registered credentials?</b>
                    <p>
                        Are you sure you want to delete all registered credentials from the server?
                        <b>It cannot be undone!</b>
                    </p>
                    <div>
                        <v-btn class="mr-2" outlined @click="showConfirm = false">Cancel</v-btn>
                        <v-btn color="warning" @click="deleteRegisteredCredentials()">Yes</v-btn>
                    </div>
                </v-alert>
            </v-dialog>
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
            registeredCredentials: [],
            showConfirm: false
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
        },
        deleteRegisteredCredentials(){
            this.showConfirm = false

            let url = "/registered"
            axios.delete(url)
            .then(
                this.registeredCredentials = []
            )
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