<template>
    <g :transform="`translate(${currentDragX+item.x}, ${currentDragY+item.y}) rotate(${item.rotation||0}, ${rcX} ${rcY})`">
        <rect x="0" y="0" :width="item.width+rszW" :height="item.height+rszH"
            :fill="item.bgcolor" :stroke="stroke" :stroke-width="strokewidth"
            @mousedown.stop="moveStart" @mousemove="move"
            @mouseup.stop="moveEnd" @mouseleave.stop="moveEnd">
        </rect>
        <resize-handle v-if="item.selected"
            :x="item.width-5+rszW"
            :y="item.height-5+rszH"
            @resize-move="resize" @resize-end="resizeEnd">
        </resize-handle>
        <rotation-center-handle v-if="item.selected"
            :x="rcX" :y="rcY"
            @next-rotation-center="nextRotationCenter">
        </rotation-center-handle>
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
import RotationCenterHandle from './RotationCenterHandle.vue';

export default {
    data: () => {
        console.log(this)
        return {
            ...draggableShapeData,
            ...resizeableShapeData,

            /* Initial rotation center position: center of shape */
            rcIndex: 0 /* 4 */,

            /* Coordinates of the rotation center */
            rcX: /*this.item.x + this.item.width / 2*/ 0,
            rcY: /*this.item.y + this.item.height / 2*/ 0
        };
    },
    props: ["item"],            // can't use v-model because it's called from a
                                // v-for loop.
    components: {
        ResizeHandle,
        RotationCenterHandle
    },
    computed: {
        ...selectableShapeComputedProps
    },
    methods: {
        ...draggableShapeMethods,

        resizeEnd(diffX, diffY) {
            if (!this.item.rotation) this.item.rotation = 0;
            const radAngle = this.item.rotation * Math.PI / 180;

            this.item.width = Math.max(this.item.width
                + diffX*Math.cos(radAngle) + diffY*Math.sin(radAngle),
                0);
            this.item.height = Math.max(this.item.height
                - diffX*Math.sin(radAngle) + diffY*Math.cos(radAngle),
                0);
            this.rszW = this.rszY = this.rszW = this.rszH = 0;
        },

        resize(diffX, diffY) {
            if (!this.item.rotation) this.item.rotation = 0;
            const radAngle = this.item.rotation * Math.PI / 180;

            this.rszW = Math.max(
                diffX*Math.cos(radAngle) + diffY*Math.sin(radAngle),
                -this.item.width);
            this.rszH = Math.max(
                -diffX*Math.sin(radAngle) + diffY*Math.cos(radAngle),
                -this.item.height);
        },

        nextRotationCenter() {
            this.rcIndex = (this.rcIndex+1) % 9;

            this.rcX = Math.floor(this.rcIndex % 3) * this.item.width / 2;
            this.rcY = Math.floor(this.rcIndex / 3) * this.item.height / 2;
        }
    }
}
</script>

<style>
</style>
