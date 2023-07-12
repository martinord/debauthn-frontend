<template>
    <div class="pa-2 ma-2 elevation-3">
        <v-form class="pa-2"
            ref="form"
            v-model="valid"
            lazy-validation
        >
            <v-row>
                <v-col>
                    <v-text-field
                        v-model="form.challenge"
                        label="Challenge"
                        :rules="rules.required.concat(rules.challenge)"
                        :disabled="!editable"
                        outlined
                        rounded
                        required
                        hint="base64 string"
                    ></v-text-field>
                </v-col>
            </v-row>

            <!-- optional -->
            
            <v-row>
                <v-col class="col-12 col-md-4">
                    <v-text-field
                        v-model="form.timeout"
                        label="Timeout"
                        :rules="rules.timeout"
                        :disabled="!editable"
                        outlined
                        rounded
                        hint="optional"
                    ></v-text-field>
                </v-col>
                <v-col class="col-12 col-md-4">
                    <v-text-field
                        v-model="form.rpId"
                        label="R.P. id"
                        :rules="rules.rpId"
                        :disabled="!editable"
                        outlined
                        rounded
                        hint="optional"
                    ></v-text-field>
                </v-col>
                <v-col class="col-12 col-md-4">
                    <v-select
                        v-model="form.userVerification"
                        label="User Verification"
                        :items="rules.userVerification"
                        :disabled="!editable"
                        clearable
                        outlined
                        rounded
                        hint="optional"
                    ></v-select>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <label>Allow Credentials</label>
                    <v-row>
                        <v-col>
                            <v-card :disabled="!editable" outlined>
                                <v-form>
                                    <v-list-item>
                                        <v-list-item-content>
                                            <div class="overline mb-4">{{"public-key"}}</div>
                                            <v-text-field
                                                v-model="newCredentialId"
                                                label="Credential id"
                                                :disabled="!editable"
                                                hint="base64"
                                            ></v-text-field>
                                        </v-list-item-content>
                                    </v-list-item>
                                    <v-card-actions>
                                        <v-btn 
                                            @click="addCredential"
                                            fab x-small
                                            color="primary"
                                            class="ml-2 mb-2"
                                            :disabled="!editable || newCredentialId == ''"
                                        >
                                            <v-icon> mdi-key-plus </v-icon>
                                        </v-btn>
                                    </v-card-actions>
                                </v-form>
                            </v-card>
                        </v-col>
                    </v-row>
                    <v-row v-for="credential in form.allowCredentials" :key="credential.id">
                        <v-col>
                            <v-card :disabled="!editable" hover>
                                <v-list-item>
                                    <v-list-item-content>
                                        <div class="overline mb-4">{{credential.type}}</div>
                                        <div>{{credential.id}}</div>
                                    </v-list-item-content>
                                </v-list-item>
                                <v-card-actions>
                                    <v-icon 
                                        @click="deleteCredential(credential.id)"
                                        class="ma-2"
                                        :disabled="!editable"
                                    >
                                        mdi-key-remove
                                    </v-icon>
                                </v-card-actions>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>

            <label>WebAuthn Extensions</label>
            <v-row>
                <v-col class="col-12 col-sm-6">
                    <v-text-field class="col"
                        v-model="form.extensions.appid"
                        label="AppID"
                        :disabled="!editable"
                        outlined
                        rounded
                        required
                        hint="optional"
                    ></v-text-field>
                </v-col>
                <v-col>
                    <v-checkbox
                        v-model="form.extensions.credProps"
                        label="Credential properties"
                        :disabled="!editable"
                        required
                        hint="optional"
                    ></v-checkbox>
                </v-col>
                <v-col>
                    <v-checkbox
                        v-model="form.extensions.hmacCreateSecret"
                        label="Create HMAC secret"
                        :disabled="!editable"
                        required
                        hint="optional"
                    ></v-checkbox>
                </v-col>
            </v-row>

            <v-btn
                v-if="!editable"
                fab small
                color="primary"
                @click="editable=true"
            >
                <v-icon>mdi-pencil</v-icon>
            </v-btn>

            <v-btn
                v-if="editable"
                :disabled="!valid"
                color="success"
                @click="onUpdate()"
            >
                Update
            </v-btn>

            <v-btn
                v-if="editable"
                text
                @click="onCancel()"
            >
                Cancel
            </v-btn>
        </v-form>
    </div>
</template>

<script>

export default {
    name: "AssertionOptions",
    props: ['options'],
    data() {
        return {
            form:{
                challenge: "",
                allowCredentials: []
            },
            newCredentialId:"",
            valid: false, //stores validation of the form
            editable: false,
            rules: {
                // main validation rules
                required: [v => !!v || 'This field is required'],
                // specific validation rules
                challenge: [],
                timeout: [],
                rpId: [],
                userVerification: ['required', 'preferred', 'discouraged'],
                allowCredentials: []
            }
        }
    },
    methods: {
        onUpdate() {
            console.log('Options were modified')
            if(this.valid){
                if(this.form.extensions.appid == "")
                    delete this.form.extensions.appid
                this.$emit('updated', this.form)
                this.editable = false
            }
        },
        onCancel() {
            this.loadOptions()
            this.editable = false
        },
        loadOptions() {
             // load a deep copy of the object to the form to avoid data binding
            this.form = JSON.parse(JSON.stringify(this.options))

            if(!Object.prototype.hasOwnProperty.call(this.form, "extensions")){
                this.form.extensions = {
                    appid: "",
                    credProps: false,
                    hmacCreateSecret: false
                }
            }
        },
        addCredential() {
            if(this.newCredentialId === "") return
            if(this.form.allowCredentials == undefined)
                this.form.allowCredentials = []
            this.form.allowCredentials.push({
                type:"public-key",
                id: this.newCredentialId
            })
            this.newCredentialId = ""
        },
        deleteCredential(id){
            this.form.allowCredentials = 
                this.form.allowCredentials.filter(item => item.id !== id)

        }
    },
    watch: {
        options: function() {
           this.loadOptions()
        }
    },
}
</script>

<style>
    
</style>