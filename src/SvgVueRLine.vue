<template>
    <g>
        <polygon :points="points" fill="rgba(0,0,0,0)" stroke="rgba(0,0,0,0)"
            @mousedown.stop="moveStart" @mousemove.stop="move"
            @mouseup.stop="moveEnd" @mouseleave.stop="moveEnd">
        </polygon>
        <line :x1="startX" :y1="startY" :x2="endX" :y2="endY"
            :stroke-width="strokewidth" :stroke="stroke">
        </line>
        <resize-handle v-if="item.selected" :x="startX-5" :y="startY-5"
            @resize-start="rszFrom = true"
            @resize-move="resize" @resize-end="resizeEnd">
        </resize-handle>
        <resize-handle v-if="item.selected" :x="endX-5" :y="endY-5"
            @resize-start="rszTo = true"
            @resize-move="resize" @resize-end="resizeEnd">
        </resize-handle>
    </g>
</template>

<script>
import {
    draggableShapeData,
    selectableShapeComputedProps,
    draggableShapeMethods
} from './shapes.js';
import ResizeHandle from './ResizeHandle.vue';

export default {
    data: () => {
        return {
            ...draggableShapeData,
            rszX: 0,
            rszY: 0,
            rszW: 0,
            rszH: 0,
            rszFrom: false,
            rszTo: false
        };
    },
    props: ["item"],
    components: {ResizeHandle},
    computed: {
        ...selectableShapeComputedProps,

        startX() {
            if (this.rszFrom)
                return this.item.x + this.currentDragX + this.rszW;
            else
                return this.item.x + this.currentDragX;
        },

        startY() {
            if (this.rszFrom)
                return this.item.y + this.currentDragY + this.rszH;
            else
                return this.item.y + this.currentDragY;
        },

        endX() {
            if (this.rszTo)
                return this.item.x + this.item.width + this.currentDragX + this.rszW;
            else
                return this.item.x + this.item.width + this.currentDragX;
        },

        endY() {
            if (this.rszTo)
                return this.item.y + this.item.height + this.currentDragY + this.rszH;
            else
                return this.item.y + this.item.height + this.currentDragY;
        },

        points() {
            /* Thickness of the halo around the line */
            const thickness = 3;

            if (this.item.width == 0 || this.item.height == 0)
            {
                return "0,0";
            } else {
                /* Line slope */
                const c = - this.item.height / this.item.width;

                // Pitch of the halo in (x,y) coordinates to provide an
                // a 2*thickness length along the line orthogonal to this.item
                const dx = thickness / Math.sqrt(1 + 1 / Math.pow(c,2));
                const dy = Math.max(Math.min(thickness, dx/c), -thickness);

                return `${this.item.x+dx},${this.item.y+dy}
                        ${this.item.x+this.item.width+dx},${this.item.y+this.item.height+dy}
                        ${this.item.x+this.item.width-dx},${this.item.y+this.item.height-dy}
                        ${this.item.x-dx},${this.item.y-dy}`;
            }
        }
    },
    methods: {
        ...draggableShapeMethods,

        resizeEnd(diffX, diffY) {
            if (this.rszFrom) {
                this.item.x += diffX;
                this.item.y += diffY;
                this.item.width = this.item.width - diffX;
                this.item.height = this.item.height - diffY;
            } else {
                this.item.width = this.item.width + diffX;
                this.item.height = this.item.height + diffY;
            }

            this.rszFrom = this.rszTo = false;
            this.rszW = this.rszH = 0;

        },

        resize(diffX, diffY) {
            this.rszW = diffX;
            this.rszH = diffY;
        }
    }
}
</script>

<style>
</style>
