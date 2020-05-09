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
                        outlined
                        rounded
                        required
                        hint="base64 string"
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
    name: "AssertionOptions",
    props: ['options'],
    data() {
        return {
            form:{
                challenge: ""
            },
            valid: false, //stores validation of the form
            rules: {
                // main validation rules
                required: [v => !!v || 'This field is required'],
                // specific validation rules
                challenge: [],
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