<template>
    <circle :cx="item.x+currentDragX" :cy="item.y+currentDragY" :r="item.r"
        :fill="item.bgcolor" :stroke="stroke" :stroke-width="strokewidth"
        @mousedown.stop="moveStart" @mousemove="move"
        @mouseup.stop="moveEnd" @mouseleave.stop="moveEnd">
    </circle>
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
    props: ["item"],
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
