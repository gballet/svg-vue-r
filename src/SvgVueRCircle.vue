<template>
    <circle v-bind:cx="item.x" v-bind:cy="item.y" v-bind:r="item.r"
        v-bind:fill="item.bgcolor" v-bind:stroke="stroke"
        v-bind:stroke-width="strokewidth" v-on:click.stop="select">
    </circle>
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
