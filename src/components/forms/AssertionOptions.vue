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
            }
        }
    },
    methods: {
        onUpdate() {
            console.log('Options were modified')
            if(this.valid){
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