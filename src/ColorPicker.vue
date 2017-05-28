<template>
    <span class="color-picker">
        <span :class="['fa', value == 'none' ? 'fa-ban' : 'fa-square']"
            :style="value == 'none' ? '' : 'color: ' + value + ';'"
            @click="showList = !showList">
        </span>
        <span v-if="showList" class="fa fa-ban" @click="selectColor('none')">
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
            this.showList = false;
            this.$emit('input', color);
        }
    }
};
</script>

<style>
.color-picker {
    background-color: #ccc;
    min-height: 100%;
    padding: 5px;
}
</style>
