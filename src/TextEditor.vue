<template>
    <div>
        Input text:
        <input v-model="value.text" />
        <input v-model.number="value.size" type="number" min="1" class="font-size" />
        <button @click="save">Save</button>
        <button @click="cancel">Cancel</button>
    </div>
</template>

<script>
export default {
    props: ["value"],
    data: function() {
        return {
            text: this.value.text,
            size: this.value.size
        }
    },
    methods: {
        save: function() {
            this.$emit('hide')
        },
        cancel: function() {
            this.value.text = this.text;
            this.value.size = this.size;
            this.$emit('hide');
        }
    }
};
</script>

<style>
.font-size {
    width: 3em;
}
</style>
