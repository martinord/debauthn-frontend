<template>
    <v-col>
        <div class="overline mb-6">Registered credentials</div>
        <v-row>
            <v-expansion-panels focusable>
                <v-expansion-panel v-for="(credential, index) in registeredCredentials" :key="credential.id">
                    <v-expansion-panel-header>
                        Public key Credential {{index}}
                    </v-expansion-panel-header>
                    <v-expansion-panel-content class="mb-2 mt-2">
                        <div class="font-weight-thin mb-1">counter: {{credential.counter}}</div>
                        <v-card class="mb-2 mt-2">
                            <v-card-title class="overline">  Identifier </v-card-title>
                            <v-card-text>
                                {{credential.rawId}}
                            </v-card-text>
                        </v-card>
                        <v-card class="mb-2 mt-2">
                            <v-card-title class="overline">  public key </v-card-title>
                            <v-card-text>
                                {{credential.publicKey}}
                            </v-card-text>
                        </v-card>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>
        </v-row>

        <v-row v-if="registeredCredentials.length > 0">
            <v-btn color="primary" class="ma-2" @click="showConfirm = true">Delete all</v-btn>
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
    </v-col>
</template>

<script>
import axios from 'axios';
axios.defaults.headers.common['Content-Type'] = "application/json;charset=UTF-8";
export default {
    name: 'RegisteredCredentials',
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