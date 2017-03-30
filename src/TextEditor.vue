<template>
    <div>
        Input text:
        <input v-model="value.text" />
        <button @click="save">Save</button>
        <button @click="cancel">Cancel</button>
    </div>
</template>

<script>
export default {
    props: ["value"],
    data: function() {
        return {
            text: this.value.text
        }
    },
    methods: {
        save: function() {
            this.$emit('hide')
        },
        cancel: function() {
            this.value.text = this.text
            this.$emit('hide')
        }
    }
};
</script>

<style>
</style>
