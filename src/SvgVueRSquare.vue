<template>
    <rect :x="item.x+currentDragX" :y="item.y+currentDragY" :width="item.width" :height="item.height"
        :fill="item.bgcolor" :stroke="stroke" :stroke-width="strokewidth"
        @mousedown.stop="moveStart" @mousemove="move"
        @mouseup.stop="moveEnd" @mouseleave.stop="moveEnd">
    </rect>
</template>

<script>
export default {
    data: () => {
        return {
            dragging: false,
            initDragX: null,    // drag start point, set with mousedown
            initDragY: null,
            currentDragX: 0,    // current drag offsets, updated with mousemove
            currentDragY: 0
        }
    },
    props: ["item"],            // can't use v-model because it's called from a
                                // v-for loop.
    computed: {
        stroke: function() {
            if (this.item.selected)
                return 'black';
            else
                return this.item.fgcolor || 'black';
        },
        strokewidth: function() {
            if (this.item.selected)
                return '3px';
            else
                return '1px';
        }
    },
    methods: {
        move: function(e) {
            if (this.initDragX) {
                if (Math.abs(e.offsetX-this.initDragX) + Math.abs(e.offsetY-this.initDragY) > 5)
                    // Quick opt: make sure that it's not already dragging
                    this.dragging = true;

                if (this.dragging) {
                    this.currentDragX = e.offsetX - this.initDragX;
                    this.currentDragY = e.offsetY - this.initDragY;
                }
            }
        },
        moveStart: function(e) {
            this.initDragX = e.offsetX;
            this.initDragY = e.offsetY;
        },
        moveEnd: function(e) {
            if (this.initDragX) {
                if (!this.dragging)
                    this.$emit("select");
                else {
                    this.dragging = false;
                    this.currentDragX = 0;
                    this.currentDragY = 0;
                    let diffX = e.offsetX - this.initDragX;
                    let diffY = e.offsetY - this.initDragY;
                    this.$emit('item', diffX, diffY);
                }

                this.initDragX = null;
                this.initDragY = null;
            }
        }
    }
}
</script>

<style>
</style>
