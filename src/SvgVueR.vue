<template>
    <div>
        Choose color:
        <button v-on:click="setColor(color)" :key="index"
            v-for="(color, index) in ['blue', 'red', 'green', 'yellow', 'black', 'white']">
            <div :class="`colorbutton${bgcolor == color ? ' current-color' : ''}`" :style="'background-color:' + color"></div>
        </button>
        <br>
        <text-editor v-if="editingItem >= 0"
            @hide="editingItem=-1"
            v-model="items[editingItem]">
        </text-editor>
        <svg :width="width" :height="height"
            @mousedown="startDrawing"
            @mousemove="refreshDrawing"
            @mouseup="endDrawing"
            @keyup.delete="removeSelected"
            @keyup.esc="deselectItem"
            tabindex="0" ondragstart="return false;">

            <!-- background -->
            <rect x=0 y=0 :width="width" :height="height" fill="white"></rect>

            <!-- Display all the components -->
            <component v-for="(item, index) in items"
                :is="item.type"
                :key="index"
                :item="item"
                @item="(diffx, diffy) => moveItem(index, diffx, diffy)"
                @select="selectItem(item, index)">
            </component>

            <!-- Visual feedback when drawing, for each primitive -->
            <rect :x="dx + Math.min(0, dwidth)" :y="dy + Math.min(0, dheight)" :width="Math.abs(dwidth)" :height="Math.abs(dheight)" v-if="tool == 'svg-vue-r-square'"></rect>
            <circle :cx="dx" :cy="dy" :r="dr" v-if="tool == 'svg-vue-r-circle'" fill="black"></circle>
            <line :x1="dx" :y1="dy" :x2="dx+dwidth" :y2="dy+dheight" stroke="black" v-if="tool == 'svg-vue-r-line'"></line>

            <!-- The frame, has to be drawn after to be above objects that extend beyond boundaries -->
            <rect x=0 y=0 :width="width" :height="height" stroke="black" fill="none"></rect>

            <!-- resizing indicator -->
            <rect :x="width-10" :y="height-10" width="10" height="10"
                @mousedown.stop="resizeStart" @mousemove.stop="resize"
                @mouseup.stop="resizeEnd" @mouseleave="resizeEnd">
            </rect>
        </svg>
        <br>
        Choose tool:
        <button @click.prevent="setTool(_tool)" v-for="(_tool, index) in tools" :key="index">
            <span :class="tool == _tool ? 'active-tool' : 'inactive-tool'">{{capitalize(_tool.split("-")[3])}}</span>
        </button>
    </div>
</template>

<script>
const systemTools = ["svg-vue-r-square", "svg-vue-r-circle", "svg-vue-r-line", "svg-vue-r-select", "svg-vue-r-text"]

import TextEditor from './TextEditor.vue';
import SvgVueRSquare from './SvgVueRSquare.vue';
import SvgVueRCircle from './SvgVueRCircle.vue';
import SvgVueRLine from './SvgVueRLine.vue';
import SvgVueRText from './SvgVueRText.vue';

export default {
    name: "svg-vue-r",
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
            resizing: false,
            bgcolor: "blue",
            tools: systemTools,
            editingItem: -1
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
                    type: this.tool,
                    bgcolor: this.bgcolor,
                    selected: false
                };

                switch (this.tool) {
                    case 'svg-vue-r-square':
                        new_item.width = Math.abs(this.dwidth);
                        new_item.height = Math.abs(this.dheight);
                        new_item.x = this.dx + Math.min(this.dwidth, 0);
                        new_item.y = this.dy + Math.min(this.dheight, 0);
                        break;
                    case 'svg-vue-r-line':
                        new_item.width = this.dwidth;
                        new_item.height = this.dheight;
                        new_item.x = this.dx;
                        new_item.y = this.dy;
                        break;
                    case 'svg-vue-r-circle':
                        new_item.x = this.dx;
                        new_item.y = this.dy;
                        new_item.r = Math.sqrt(this.dwidth * this.dwidth + this.dheight * this.dheight);
                        break;
                    case 'svg-vue-r-select':
                        this.deselectItem();
                        this.editingItem = -1;
                        break;
                    case 'svg-vue-r-text':
                        this.editingItem = this.items.length;
                        new_item.text = "Please enter the text";
                        new_item.x = this.dx;
                        new_item.y = this.dy;
                        new_item.size = 12;
                        break;
                    default:
                        alert("This isn't implemented");
                        break;
                }

                if (this.tool != "svg-vue-r-select")
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

        // When clicking on an item, make sure it appears as selected
        selectItem: function(item, index) {
            if (this.tool == 'svg-vue-r-select') {
                /* Unselect the previous object */
                this.deselectItem();

                /* Bring the object to the fore */
                this.items.splice(index, 1);
                this.items.push(item);

                /* Set halo */
                item.selected = true;

                /* If text, set editing mode */
                if (item.type == "svg-vue-r-text")
                    this.editingItem = this.items.length-1;
                else
                    this.editingItem = -1;
            }
        },

        /* Make sure that all items are un-selected */
        deselectItem: function() {
            // NOTE at the moment, the selectd item is always the
            // last one. Howerver, in the future there might be more
            // than one selected item (for grouping) so let's take the
            // safer, longer approach.
            this.items.forEach((item) => item.selected = false);
        },

        /* Change the tool that is currently active */
        setTool: function(tool) {
            // In case an item is selected, un-select it to avoid key binding
            // conflicts.
            this.deselectItem();

            this.tool = tool;
        },

        // Set either the color of the currently selected item, or the default
        // color for the next items to be created.
        setColor: function(color) {
            this.bgcolor = color;

            this.items.forEach((item) => { if (item.selected) item.bgcolor = color; });
        },

        // If an item is selected and either `delete` or `backspace` is pressed,
        // this function will delete it.
        removeSelected: function() {
            // NOTE at the moment only one item is selected, and it's the
            // last one. In the future, go over all selected items and remove
            // each one of them.
            if (this.items[this.items.length-1].selected) {
                this.items.splice(this.items.length-1, 1);
                this.editingItem = -1;
            }
        },

        capitalize: (str) => str.charAt(0).toUpperCase() + str.slice(1),

        // This is called when the user is done dragging an element. It will move
        // the item by the deltas passed as parameters. The index is also pased
        // as the user must be able to drag objects that they didn't select.
        moveItem: function(index, diffX, diffY) {
            if (index >= 0) {
                this.items[index].x += diffX;
                this.items[index].y += diffY;
            }
        }
    },
    components: {
        "text-editor": TextEditor,
        "svg-vue-r-square": SvgVueRSquare,
        "svg-vue-r-circle": SvgVueRCircle,
        "svg-vue-r-line": SvgVueRLine,
        'svg-vue-r-text': SvgVueRText
    },
}
</script>

<style>
    .colorbutton {
        width: 10px;
        height: 10px;
        border: solid 1px black;
    }

    .active-tool {
        font-weight: bold;
    }

    .inactive-tool {

    }

    .current-color {
        border: solid 3px black;
    }
</style>
