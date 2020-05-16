<template>
    <v-treeview
        rounded
        hoverable
        activatable
        open-on-click
        :items="items"
    >
    </v-treeview>
</template>

<script>
export default {
    name: "ObjectTree",
    props: ['object'],
    data() {
        return {
           items:[]
        }
    },
    methods: {
        parseObject(o) {
            if(typeof o !== 'object')
                return [{name: JSON.stringify(o)}]
            var myItems = []
            for(let [key, value] of Object.entries(o)) {
                let propName = key, propChildren = []
                if(value !== null)
                    propChildren = this.parseObject(value)
                myItems.push({
                    name: propName,
                    children: propChildren
                })
            }
            return myItems
        }
    },
    watch: {
        object: function() {
            this.items = this.parseObject(this.object)
        }
    }
    
}
</script>

<style scoped>

</style>