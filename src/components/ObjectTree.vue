<template>
    <v-row class="pa-1">
        <v-col class="col-12 col-md-4 ma-1">
            <h4 mb-1>Explorer</h4>
            <v-treeview
                rounded
                :active.sync="active"
                selection-type="independent"
                return-object
                activatable
                open-on-click
                :items="items"
            >
                <template v-slot:prepend="{ item }">
                    <v-icon v-if="item.value">
                        mdi-code-json
                    </v-icon>
                    <v-icon v-else-if="item.children.length > 0">
                        mdi-file-tree
                    </v-icon>
                    <v-icon v-else>
                        mdi-file-alert
                    </v-icon>
                </template>
            </v-treeview>
        </v-col>
        <v-divider vertical></v-divider>
        <v-col class="col-12 col-md-7 ma-1" style="align-self: center">
            <div
                v-if="!selected"
                class="grey--text pl-2"
            >
                Select a field
            </div>
            <v-card
                mx-auto
                v-else
                dark
            >
                <v-card-text>
                    {{ selected.value }}
                </v-card-text>
            </v-card>
        </v-col>
        
    </v-row>
</template>

<script>
export default {
    name: "ObjectTree",
    props: ['object'],
    data() {
        return {
           items:[],
           active: [],
           n: 0
        }
    },
    methods: {
        parseObject(o) {
            var myItems = []
            for(let [key, value] of Object.entries(o)) {
                let propName = key, propChildren = [], propValue = ""
                if(value !== null){
                    if(typeof value !== 'object')
                        propValue = JSON.stringify(value)
                    else
                        propChildren = this.parseObject(value)
                }
                myItems.push({
                    id: this.n++,
                    name: propName,
                    children: propChildren,
                    value: propValue
                })
            }
            return myItems
        }
    },
    watch: {
        object: function() {
            this.items = this.parseObject(this.object)
        }
    },
    computed: {
        selected() {
            if (!this.active.length) return undefined

            return this.active[0]
        }
    }
    
}
</script>

<style scoped>

</style>