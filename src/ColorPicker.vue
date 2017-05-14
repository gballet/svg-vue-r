<template>
    <span class="color-picker">
        <span class="fa fa-square"
            :style="'color: ' + value + ';'"
            @click="showList = !showList">
        </span>
        <span v-for="(color, index) in ['blue', 'red', 'green', 'yellow', 'black', 'white']"
            :key="index" class="fa fa-square" :style="'color: ' + color + ';'"
            @click="selectColor(color)" v-if="showList">
        </span>
    </span>
</template>

<script>
export default {
    data() {
        return {
            showList: false
        }
    },
    props: ["value"],
    methods: {
        selectColor(color) {
            this.value = color;
            this.showList = false;
        }
    }
};
</script>

<style>
.color-picker {
    background-color: #aaa;
    min-height: 32px;
}
</style>
