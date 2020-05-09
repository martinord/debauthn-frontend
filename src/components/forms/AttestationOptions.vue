<template>
    <div class="pa-2 ma-2 elevation-3">
        <v-form class="pa-2"
            ref="form"
            v-model="valid"
            lazy-validation
        >
            <label>R.P.</label>
            <v-row>
                <v-col>
                    <v-text-field class="col"
                        v-model="form.rp.id"
                        label="R.P. id"
                        :rules="rules.required.concat(rules.rpId)"
                        outlined
                        rounded
                        required
                    ></v-text-field>
                </v-col>
                <v-col>
                    <v-text-field class="col"
                        v-model="form.rp.name"
                        label="R.P. name"
                        :rules="rules.required.concat(rules.rpName)"
                        outlined
                        rounded
                        required
                    ></v-text-field>
                </v-col>
            </v-row>
            <label>User</label>
            <v-row>
                <v-col>
                    <v-text-field
                        v-model="form.user.id"
                        label="User id"
                        :rules="rules.required.concat(rules.userId)"
                        outlined
                        rounded
                        required
                        hint="base64 string"
                    ></v-text-field>
                </v-col>        
                <v-col>
                    <v-text-field
                        v-model="form.user.name"
                        label="User name"
                        :rules="rules.required.concat(rules.userName)"
                        outlined
                        rounded
                        required
                    ></v-text-field>
                </v-col>
                <v-col>
                    <v-text-field
                        v-model="form.user.displayName"
                        label="R.P. name"
                        :rules="rules.required.concat(rules.userDisplayName)"
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
            

            <v-btn
                :disabled="!valid"
                text
                @click="onUpdate()"
            >
                Update
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
                pubKeyCredParams: []
            },
            valid: false, //stores validation of the form
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
                pubKeyCredParams: []
            }
        }
    },
    methods: {
        onUpdate() {
            console.log('Options were modified')
            if(this.valid)
                this.$emit('updated', this.form)
        }
    },
    watch: {
        options: function() {
            // load a deep copy of the object to the form to avoid data binding
            this.form = JSON.parse(JSON.stringify(this.options))
        }
    },
}
</script>

<style>
    
</style>