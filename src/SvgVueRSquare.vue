<template>
    <rect :x="item.x+currentDragX" :y="item.y+currentDragY" :width="item.width" :height="item.height"
        :fill="item.bgcolor" :stroke="stroke" :stroke-width="strokewidth"
        @mousedown.stop="moveStart" @mousemove="move"
        @mouseup.stop="moveEnd" @mouseleave.stop="moveEnd">
    </rect>
</template>

<script>
import {
    draggableShapeData,
    selectableShapeComputedProps,
    draggableShapeMethods
} from './shapes.js';

export default {
    data: () => {
        return {
            ...draggableShapeData
        };
    },
    props: ["item"],            // can't use v-model because it's called from a
                                // v-for loop.
    computed: {
        ...selectableShapeComputedProps
    },
    methods: {
        ...draggableShapeMethods
    }
}
</script>

<style>
</style>
