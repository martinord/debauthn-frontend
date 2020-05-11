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
                <v-col>
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
                <v-col>
                    <v-text-field
                        v-model="form.rp.id"
                        label="R.P. id"
                        :rules="rules.rpId"
                        :disabled="!editable"
                        outlined
                        rounded
                        hint="optional"
                    ></v-text-field>
                </v-col>
                <v-col>
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
                    <v-text-field
                        v-model="form.allowCredentials"
                        label="Allow Credentials"
                        :rules="rules.allowCredentials"
                        disabled
                        outlined
                        rounded
                        hint="optional"
                    ></v-text-field>
                </v-col>
            </v-row>
            

            <v-btn
                v-if="!editable"
                text
                @click="editable=true"
            >
                Edit options
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
                challenge: ""
            },
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
                if(this.form.rp.id == "") delete this.form.rp
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
            if(!this.form.rp)
                this.form.rp = {id:""}
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