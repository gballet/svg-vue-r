<template>
    <line :x1="item.x" :y1="item.y" :x2="item.x+item.width"
        :y2="item.y+item.height" :stroke-width="strokewidth"
        :stroke="stroke" v-on:click.stop="select">
    </line>
</template>

<script>
export default {
    props: ["item"],
    computed: {
        stroke: function() {
            console.log(this.item)
            if (this.item.selected)
                return 'black';
            else
                return this.item.fgcolor || 'black';
        },
        strokewidth: function() {
            console.log(this.item.selected)
            if (this.item.selected)
                return '3px';
            else
                return '1px';
        }
    },
    methods: {
        select: function() {
            this.$emit("select")
        }
    }
}
</script>

<style>
</style>
