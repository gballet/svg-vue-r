<template>
    <div>
        Tool: {{tool}}
        <br>
        <!-- TODO make this an iterated list -->
        <button v-on:click.prevent="tool='svg-vue-r-square'">Square</button>
        <button v-on:click.prevent="tool='svg-vue-r-circle'">Circle</button>
        <button v-on:click.prevent="tool='svg-vue-r-line'">Line</button>
        <button v-on:click.prevent="tool='select'">Select</button>
        <button v-on:click.prevent="tool='svg-vue-r-text'">Text</button>
        <svg v-bind:width="width"
            v-bind:height="height"
            v-on:mousedown="startDrawing"
            v-on:mousemove="refreshDrawing"
            v-on:mouseup="endDrawing">

            <!-- background -->
            <rect x=0 y=0 v-bind:width="width" v-bind:height="height" stroke="black" fill="white"></rect>

            <!-- Display all the components -->
            <component v-for="item in items"
                v-bind:is="item.type"
                :key="$index"
                v-bind:item="item"
                v-on:click.stop="selectItem(item)">
            </component>

            <!-- Visual feedback when drawing, for each primitive -->
            <rect v-bind:x="dx + Math.min(0, dwidth)" v-bind:y="dy + Math.min(0, dheight)" v-bind:width="Math.abs(dwidth)" v-bind:height="Math.abs(dheight)" v-if="tool == 'svg-vue-r-square'"></rect>
            <circle v-bind:cx="dx" v-bind:cy="dy" v-bind:r="dr" v-if="tool == 'svg-vue-r-circle'" fill="black"></circle>
            <line v-bind:x1="dx" v-bind:y1="dy" v-bind:x2="dx+dwidth" v-bind:y2="dy+dheight" stroke="black" v-if="tool == 'svg-vue-r-line'"></line>

            <!-- resizing indicator -->
            <rect v-bind:x="width-10" v-bind:y="height-10"
                width="10" height="10"
                v-on:mousedown.stop="resizeStart"
                v-on:mousemove.stop="resize"
                v-on:mouseup.stop="resizeEnd"></rect>
        </svg>
    </div>
</template>

<script>
export default {
    data: () => {
        return {
            tool: 'svg-vue-r-square',
            items: [],
            width: 400,
            height: 300,
            drawing: false,
            dx: 0,
            dy: 0,
            dwidth: 0,
            dheight: 0,
            dr: 0,
            resizing: false
        }
    },
    methods: {
        startDrawing: function(e) {
            this.dx = e.offsetX;
            this.dy = e.offsetY;
            this.dwidth = 0;
            this.dheight = 0;
            this.drawing = true;
        },
        refreshDrawing: function(e) {
            if (this.drawing) {
                this.dwidth = e.offsetX - this.dx;
                this.dheight = e.offsetY - this.dy;
                this.dr = Math.sqrt(this.dwidth * this.dwidth + this.dheight * this.dheight);
            }
        },
        endDrawing: function(e) {
            if (this.drawing) {
                this.drawing = false;
                 let new_item = {
                    type: this.tool
                };

                switch (this.tool) {
                    case 'svg-vue-r-square':
                    case 'svg-vue-r-line':
                        new_item.width = Math.abs(this.dwidth);
                        new_item.height = Math.abs(this.dheight);
                        new_item.x = this.dx + Math.min(this.dwidth, 0);
                        new_item.y = this.dy + Math.min(this.dheight, 0);
                        break;
                    case 'svg-vue-r-line':
                        new_item.width = this.dwidth;
                        new_item.height = this.dheight;
                        new_item.x = this.dx + Math.min(this.dwidth, 0);
                        new_item.y = this.dy + Math.min(this.dheight, 0);
                        break;
                    case 'svg-vue-r-circle':
                        new_item.x = this.dx;
                        new_item.y = this.dy;
                        new_item.r = Math.sqrt(this.dwidth * this.dwidth + this.dheight * this.dheight);
                        break;
                    case 'select':
                        break;
                    default:
                        alert("This isn't implemented");
                        break;
                }

                this.items.push(new_item);
                this.dx = this.dy = this.dheight = this.dwidth = this.dr = 0;
            }
        },
        resize: function(e) {
            if (this.resizing) {
                this.width = Math.max(e.pageX - this.resize_init_x + this.resize_init_width, 10);
                this.height = Math.max(e.pageY - this.resize_init_y + this.resize_init_height, 10);
            }
        },
        resizeStart: function(e) {
            this.resizing = true;
            this.resize_init_x = e.pageX;
            this.resize_init_y = e.pageY;
            this.resize_init_width = this.width;
            this.resize_init_height = this.height;
        },
        resizeEnd: function(e) {
            this.resizing = false;
        },
        selectItem: function(item) {
            console.log(item);
        }
    },
    components: {
        "svg-vue-r-square": {
            template: '<rect v-bind:x="item.x" v-bind:y="item.y" v-bind:width="item.width" v-bind:height="item.height" fill="blue" v-on:click.stop="select"></rect>',
            props: ["item"],
            methods: {
                select: function() {
                    
                }
            }
        },
        "svg-vue-r-circle": {
            template: '<circle v-bind:cx="item.x" v-bind:cy="item.y" v-bind:r="item.r" fill="red"></circle>',
            props: ["item"]
        },
        "svg-vue-r-line": {
            template: '<line v-bind:x1="item.x" v-bind:y1="item.y" v-bind:x2="item.x+item.width" v-bind:y2="item.y+item.height" stroke="black"></line>',
            props: ["item"]
        }
    }
}
</script>

<style></style>
