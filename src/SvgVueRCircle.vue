<template>
    <g>
        <circle :cx="item.x+currentDragX" :cy="item.y+currentDragY" :r="radius"
            :fill="item.bgcolor" :stroke="stroke" :stroke-width="strokewidth"
            @mousedown.stop="moveStart" @mousemove="move"
            @mouseup.stop="moveEnd" @mouseleave.stop="moveEnd">
        </circle>
        <rect v-if="item.selected"
            :x="item.x+item.r-5+rszW+currentDragX"
            :y="item.y-5+rszH+currentDragY"
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
        return {
            ...draggableShapeData,
            ...resizeableShapeData
        };
    },
    props: ["item"],
    computed: {
        ...selectableShapeComputedProps,
        radius() {
            // If the circle is being resized, use a calculated radius based
            // on the mouse move. Otherwise, use the registered radius.
            if (this.rszW != 0 || this.rszH != 0) {
                const initX = this.item.x+this.item.r;
                const initY = this.item.y;

                return Math.sqrt(
                    Math.pow(initY + this.rszH - this.item.y, 2)
                    + Math.pow(initX + this.rszW - this.item.x, 2));
            } else {
                return this.item.r;
            }
        }
    },
    methods: {
        ...draggableShapeMethods,
        ...resizeableShapeMethods,

        /* Override for square */
        resize(e) {
            if (this.resizing) {
                this.rszW = e.offsetX - this.rszX;
                this.rszH = e.offsetY - this.rszY;
            }
        },

        /* Override */
        resizeEnd(e) {
            if (this.resizing) {
                /* Evaluated formula, see radius() */
                this.item.r = Math.sqrt(Math.pow(this.rszH, 2)
                    + Math.pow(this.item.r + this.rszW, 2));
                this.rszW = this.rszY = this.rszW = this.rszH = 0;
                this.resizing = false;
            }
        }
    }
}
</script>

<style>
</style>
