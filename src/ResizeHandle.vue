<template>
    <rect :x="x" :y="y" width="10" height="10" stroke="black" fill="cyan"
        @mousemove="resize" @mouseleave.stop="resizeEnd"
        @mousedown.stop="resizeStart" @mouseup.stop="resizeEnd">
    </rect>
</template>

<script>
import {
    resizeableShapeData,
    resizeableShapeMethods
} from './shapes.js';

export default {
    props: ["x", "y"],
    data() {
        return {
            ...resizeableShapeData
        }
    },
    methods: {
        ...resizeableShapeMethods
    }
};
</script>
