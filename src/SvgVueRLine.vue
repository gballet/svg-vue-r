<template>
    <line :x1="item.x+currentDragX" :y1="item.y+currentDragY"
        :x2="item.x+item.width+currentDragX" :y2="item.y+item.height+currentDragY"
        :stroke-width="strokewidth" :stroke="stroke"
        @mousedown.stop="moveStart" @mousemove.stop="move"
        @mouseup.stop="moveEnd" @mouseleave.stop="moveEnd">
    </line>
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
