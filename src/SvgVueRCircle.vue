<template>
    <g>
        <circle :cx="item.x+currentDragX" :cy="item.y+currentDragY" :r="radius"
            :fill="item.bgcolor" :stroke="stroke" :stroke-width="strokewidth"
            @mousedown.stop="moveStart" @mousemove="move"
            @mouseup.stop="moveEnd" @mouseleave.stop="moveEnd">
        </circle>
        <resize-handle v-if="item.selected"
            :x="item.x+item.r-5+rszW+currentDragX"
            :y="item.y-5+rszH+currentDragY"
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
        return {
            ...draggableShapeData,
            ...resizeableShapeData
        };
    },
    props: ["item"],
    components: {ResizeHandle},
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

        /* Override for square */
        resize(diffX, diffY) {
            this.rszW = diffX;
            this.rszH = diffY;
        },

        /* Override */
        resizeEnd(diffX, diffY) {
            /* Evaluated formula, see radius() */
            this.item.r = Math.sqrt(Math.pow(diffY, 2)
                + Math.pow(this.item.r + diffX, 2));
            this.rszW = this.rszY = this.rszW = this.rszH = 0;
        }
    }
}
</script>

<style>
</style>
