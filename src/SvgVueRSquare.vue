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
    draggableShapeMethods
} from './shapes.js';

export default {
    data: () => {
        return {
            ...draggableShapeData,
            rszX: 0,
            rszY: 0,
            rszW: 0,
            rszH: 0,
            resizing: false
        };
    },
    props: ["item"],            // can't use v-model because it's called from a
                                // v-for loop.
    computed: {
        ...selectableShapeComputedProps
    },
    methods: {
        ...draggableShapeMethods,

        resizeStart(e) {
            this.rszX = e.offsetX;
            this.rszY = e.offsetY;
            this.resizing = true;
        },

        resizeEnd(e) {
            if (this.resizing) {
                this.item.width = Math.max(this.item.width + e.offsetX - this.rszX, 0);
                this.item.height = Math.max(this.item.height + e.offsetY - this.rszY, 0);
                this.rszW = this.rszY = this.rszW = this.rszH = 0;
                this.resizing = false;
            }
        },

        resize(e) {
            if (this.resizing) {
                this.rszW = Math.max(e.offsetX - this.rszX, -this.item.width);
                this.rszH = Math.max(e.offsetY - this.rszY, -this.item.height);
            }
        }
    }
}
</script>

<style>
</style>
