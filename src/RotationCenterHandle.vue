<template>
    <circle :cx="x" :cy="y" r="5" stroke="black" fill="red"
        @click.stop="nextRotationCenter" @mousedown.stop="">
    </circle>
</template>

<script>
export default {
    props: ["x", "y"],
    methods: {
        nextRotationCenter() {
            this.$emit("next-rotation-center");
        }
    }
};
</script>
