<template>
    <div class="pa-2 ma-2 elevation-3">
        <v-form class="pa-2"
            ref="form"
            v-model="valid"
            lazy-validation
        >
            <label>R.P.</label>
            <v-row>
                <v-col class="col-12 col-sm-6">
                    <v-text-field class="col"
                        v-model="form.rp.id"
                        label="R.P. id"
                        :rules="rules.required.concat(rules.rpId)"
                        :disabled="!editable"
                        outlined
                        rounded
                        required
                    ></v-text-field>
                </v-col>
                <v-col class="col-12 col-sm-6">
                    <v-text-field class="col"
                        v-model="form.rp.name"
                        label="R.P. name"
                        :rules="rules.required.concat(rules.rpName)"
                        :disabled="!editable"
                        outlined
                        rounded
                        required
                    ></v-text-field>
                </v-col>
            </v-row>
            <label>User</label>
            <v-row>
                <v-col class="col-12 col-md-4">
                    <v-text-field
                        v-model="form.user.id"
                        label="User id"
                        :rules="rules.required.concat(rules.userId)"
                        :disabled="!editable"
                        outlined
                        rounded
                        required
                        hint="base64 string"
                    ></v-text-field>
                </v-col>        
                <v-col class="col-12 col-sm-6 col-md-4">
                    <v-text-field
                        v-model="form.user.name"
                        label="User name"
                        :rules="rules.required.concat(rules.userName)"
                        :disabled="!editable"
                        outlined
                        rounded
                        required
                    ></v-text-field>
                </v-col>
                <v-col class="col-12 col-sm-6 col-md-4">
                    <v-text-field
                        v-model="form.user.displayName"
                        label="User display name"
                        :rules="rules.required.concat(rules.userDisplayName)"
                        :disabled="!editable"
                        outlined
                        rounded
                        required
                    ></v-text-field>
                </v-col>
            </v-row>
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
            <v-row>
                <v-col>
                   <label>PubKeyCredParams</label>
                   <v-row>
                        <v-col class="col-12 col-sm-6 col-md-4">
                            <v-card :disabled="!editable" outlined>
                                <v-form>
                                    <v-list-item>
                                        <v-list-item-content>
                                            <div class="overline mb-4">{{"public-key"}}</div>
                                            <v-text-field
                                                v-model="newParam"
                                                label="COSE Algorithm Identifier"
                                                :disabled="!editable"
                                                hint="check IANA COSE algorithm codes"
                                            ></v-text-field>
                                        </v-list-item-content>
                                    </v-list-item>
                                    <v-card-actions>
                                        <v-btn 
                                            @click="addParam"
                                            fab x-small
                                            color="primary"
                                            class="ml-2 mb-2"
                                            :disabled="!editable || newParam == ''"
                                        >
                                            <v-icon> mdi-toy-brick-plus </v-icon>
                                        </v-btn>
                                    </v-card-actions>
                                </v-form>
                            </v-card>
                        </v-col>
                        <v-col 
                            class="col-12 col-sm-6 col-md-4"
                            v-for="param in form.pubKeyCredParams" :key="param.alg"
                        >
                            <v-card :disabled="!editable" hover>
                                <v-list-item>
                                    <v-list-item-content>
                                        <div class="overline mb-4">{{param.type}}</div>
                                        <div>{{param.alg}}</div>
                                    </v-list-item-content>
                                </v-list-item>
                                <v-card-actions>
                                    <v-icon 
                                        @click="deleteParam(param.alg)"
                                        class="ma-2"
                                        :disabled="!editable"
                                    >
                                        mdi-toy-brick-remove
                                    </v-icon>
                                </v-card-actions>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>

            <!-- optional -->

            <v-row>
                <v-col class="col-12 col-sm-6">
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
                <v-col class="col-12 col-sm-6">
                    <v-select
                        v-model="form.attestation"
                        label="Attestation Conveyance"
                        :items="rules.attestation"
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
                    <label>Exclude Credentials</label>
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
                    <v-row v-for="credential in form.excludeCredentials" :key="credential.id">
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
            <label>Authenticator Selection</label>
            <v-row>
                <v-col class="col-12 col-md-4">
                    <v-select
                        v-model="form.authenticatorSelection.authenticatorAttachment"
                        label="Authenticator Attachment"
                        :items="rules.authenticatorAttachment"
                        :disabled="!editable"
                        clearable
                        outlined
                        rounded
                        hint="optional"
                    ></v-select>
                </v-col>
                <v-col class="col-12 col-md-4">
                    <v-select
                        v-model="form.authenticatorSelection.residentKey"
                        label="Resident key"
                        :items="rules.residentKey"
                        :disabled="!editable"
                        clearable
                        outlined
                        rounded
                        hint="optional"
                    ></v-select>
                </v-col>
                <v-col class="col-12 col-md-4">
                    <v-select
                        v-model="form.authenticatorSelection.userVerification"
                        label="User verification"
                        :items="rules.userVerification"
                        :disabled="!editable"
                        clearable
                        outlined
                        rounded
                        hint="optional"
                    ></v-select>
                </v-col>
                <v-col>
                    <v-checkbox
                        v-model="form.authenticatorSelection.requireResidentKey"
                        label="Require Resident Key"
                        :disabled="!editable"
                        required
                        hint="optional"
                    ></v-checkbox>
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
    name: "AttestationOptions",
    props: ['options'],
    data() {
        return {
            form:{
                rp: {
                    id: "",
                    name: ""
                },
                user: {
                    id: "",
                    name: "",
                    displayName: ""
                },
                challenge: "",
                pubKeyCredParams: [],
            },
            newParam:"",
            newCredentialId:"",
            valid: false, //stores validation of the form
            editable: false,
            rules: {
                // main validation rules
                required: [v => !!v || 'This field is required'],
                // specific validation rules
                rpName: [],
                rpId: [],
                userId: [],
                userName: [],
                userDisplayName: [],
                challenge: [],
                pubKeyCredParams: [],
                timeout: [],
                attestation: ['none', 'indirect', 'direct'],
                excludeCredentials: [],
                authenticatorAttachment: ['platform', 'cross-platform'],
                userVerification: ['preferred', 'required', 'discouraged'],
                residentKey: ['preferred', 'required', 'discouraged']
            }
        }
    },
    methods: {
        onUpdate() {
            console.log('Options were modified')
            if(this.valid){
                if(this.form.authenticatorSelection.authenticatorAttachment == "")
                    delete this.form.authenticatorSelection.authenticatorAttachment
                if(this.form.authenticatorSelection.userVerification == "")
                    delete this.form.authenticatorSelection.userVerification
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

            if(!Object.prototype.hasOwnProperty.call(this.form, "authenticatorSelection")){
                this.form.authenticatorSelection = {
                    authenticatorAttachment: "",
                    requireResidentKey: false,
                    residentKey: "discouraged",
                    userVerification: ""
                }
            }

            if(!Object.prototype.hasOwnProperty.call(this.form, "extensions")){
                this.form.extensions = {
                    appid: "",
                    credProps: false,
                    hmacCreateSecret: false
                }
            }
        },
        addParam() {
            if(this.newParam === "") return
            if(this.form.pubKeyCredParams == undefined)
                this.form.pubKeyCredParams = []
            this.form.pubKeyCredParams.push({
                type:"public-key",
                alg: this.newParam
            })
            this.newParam = ""
        },
        deleteParam(alg){
            this.form.pubKeyCredParams = 
                this.form.pubKeyCredParams.filter(item => item.alg !== alg)

        },
        addCredential() {
            if(this.newCredentialId === "") return
            if(this.form.excludeCredentials == undefined)
                this.form.excludeCredentials = []
            this.form.excludeCredentials.push({
                type:"public-key",
                id: this.newCredentialId
            })
            this.newCredentialId = ""
        },
        deleteCredential(id){
            this.form.excludeCredentials = 
                this.form.excludeCredentials.filter(item => item.id !== id)

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