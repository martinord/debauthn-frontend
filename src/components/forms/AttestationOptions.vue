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
                    <!-- disabled temporaly: array -->
                    <v-text-field
                        v-model="form.pubKeyCredParams"
                        label="Public Key Credential Parameters"
                        :rules="rules.required.concat(rules.pubKeyCredParams)"
                        outlined
                        rounded
                        disabled
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
                <v-col class="col-12 col-md-4">
                    <v-text-field
                        v-model="form.excludeCredentials"
                        label="Exclude Credentials"
                        :rules="rules.excludeCredentials"
                        disabled
                        outlined
                        rounded
                        hint="optional"
                    ></v-text-field>
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
                <v-col>
                    <v-checkbox
                        v-model="form.authenticatorSelection.requiresResidentKey"
                        label="Requires Resident Key"
                        :disabled="!editable"
                        required
                        hint="optional"
                    ></v-checkbox>
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
                userVerification: ['preferred', 'required', 'discouraged']
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
                    requiresResidentKey: false,
                    userVerification: ""
                }
            }
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