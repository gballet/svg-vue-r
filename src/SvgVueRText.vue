<template>
    <g @click="editItem">
        <text ref="content" :x="item.x" :y="item.y">{{item.text}}</text>
        <rect :x="item.x" :y="item.y-textHeight" :width="textWidth" :height="textHeight" v-if="item.selected" stroke="black" fill="rgba(0,0,0,0)"></rect>
    </g>
</template>

<script>
export default {
    name: "svg-vue-r-text",
    props: ["item"],
    // There's a catch here, as in its "selected" state the text is sourrounded
    // by a rectangle. The dimensions of that rectangle depend on that of the
    // text, which means that it has to be rendered to have its size known and
    // have a reference available in this.$refs. For that, we use the `mounted`
    // lifecyle hook to set those dimensions.
    // I initially assumed that the text will not be selected immediately, and
    // therefore $refs will always be available when needed. Unfortunately, when
    // selecting the text after another object, the component gets recreted as
    // the text gets brought to the fore.
    mounted() {
        this.textWidth = this.$refs.content.clientWidth;
        this.textHeight = this.$refs.content.clientHeight;
    },
    data() {
        return {
            textWidth: 0,
            textHeight: 0
        }
    },
    watch: {
        // Dimensions need to be updated based on text changes.
        'item.text'() {
            // XXX this is the *old* value, so depending on the difference
            // in length from before and after, an adjustment will be needed.
            this.textWidth = this.$refs.content.clientWidth;
            this.textHeight = this.$refs.content.clientHeight;
        }
    },
    methods: {
        editItem() {
            console.log(this.$refs.content)
            this.$emit('select');
        }
    }
}
</script>
