<template>
    <g>
        <rect :x="item.x+currentDragX" :y="item.y+currentDragY"
            :width="item.width+rszW" :height="item.height+rszH"
            :fill="item.bgcolor" :stroke="stroke" :stroke-width="strokewidth"
            @mousedown.stop="moveStart" @mousemove="move"
            @mouseup.stop="moveEnd" @mouseleave.stop="moveEnd">
        </rect>
        <resize-handle v-if="item.selected"
            :x="item.x+item.width-5+rszW+currentDragX"
            :y="item.y+item.height-5+rszH+currentDragY"
            @resize-move="resize" @resize-end="resizeEnd">
        </resize-handle>
    </g>
</template>

<script>
import {
    draggableShapeData,
    selectableShapeComputedProps,
    draggableShapeMethods,
    resizeableShapeData,
    resizeableShapeMethods
} from './shapes.js';
import ResizeHandle from './ResizeHandle.vue';

export default {
    data: () => {
        console.log(resizeableShapeData)
        return {
            ...draggableShapeData,
            ...resizeableShapeData
        };
    },
    props: ["item"],            // can't use v-model because it's called from a
                                // v-for loop.
    components: {
        ResizeHandle,
    },
    computed: {
        ...selectableShapeComputedProps
    },
    methods: {
        ...draggableShapeMethods,

        resizeEnd(diffX, diffY) {
            this.item.width = Math.max(this.item.width + diffX, 0);
            this.item.height = Math.max(this.item.height + diffY, 0);
            this.rszW = this.rszY = this.rszW = this.rszH = 0;
        },

        resize(diffX, diffY) {
            this.rszW = Math.max(diffX, -this.item.width);
            this.rszH = Math.max(diffY, -this.item.height);
        },

        nextRotationCenter() {
            this.rcIndex = this.rcIndex % 9;
        },
    }
}
</script>

<style>
</style>
