<template>
    <g>
        <rect :x="item.x+currentDragX" :y="item.y+currentDragY"
            :width="item.width+rszW" :height="item.height+rszH"
            :fill="item.bgcolor" :stroke="stroke" :stroke-width="strokewidth"
            @mousedown.stop="moveStart" @mousemove="move"
            @mouseup.stop="moveEnd" @mouseleave.stop="moveEnd">
        </rect>
        <rect v-if="item.selected"
            :x="item.x+item.width-5+rszW+currentDragX"
            :y="item.y+item.height-5+rszH+currentDragY"
            width="10" height="10" stroke="black" fill="cyan"
            @mousemove="resize" @mouseleave.stop="resizeEnd"
            @mousedown.stop="resizeStart" @mouseup.stop="resizeEnd">
        </rect>
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
    computed: {
        ...selectableShapeComputedProps
    },
    methods: {
        ...draggableShapeMethods,
        ...resizeableShapeMethods
    }
}
</script>

<style>
</style>
