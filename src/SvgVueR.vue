<template>
    <div>
        Color: {{bgcolor}}
        <br>
        Choose color:
        <button v-on:click="setColor(color)" :key="index"
            v-for="(color, index) in ['blue', 'red', 'green', 'yellow', 'black', 'white']">
            <div class="colorbutton" :style="'background-color:' + color"></div>
        </button>
        <br>
        Choose tool:
        <button @click.prevent="setTool(_tool)" v-for="(_tool, index) in tools" :key="index">
            <span :class="tool == _tool ? 'active-tool' : 'inactive-tool'">{{capitalize(_tool.split("-")[3])}}</span>
        </button>
        <svg v-bind:width="width"
            v-bind:height="height"
            v-on:mousedown="startDrawing"
            v-on:mousemove="refreshDrawing"
            v-on:mouseup="endDrawing"
            @keyup.delete="removeSelected"
            tabindex="0">

            <!-- background -->
            <rect x=0 y=0 v-bind:width="width" v-bind:height="height" fill="white"></rect>

            <!-- Display all the components -->
            <component v-for="(item, index) in items"
                v-bind:is="item.type"
                :key="index"
                v-bind:item="item"
                v-on:select="selectItem(item, index)">
            </component>

            <!-- Visual feedback when drawing, for each primitive -->
            <rect v-bind:x="dx + Math.min(0, dwidth)" v-bind:y="dy + Math.min(0, dheight)" v-bind:width="Math.abs(dwidth)" v-bind:height="Math.abs(dheight)" v-if="tool == 'svg-vue-r-square'"></rect>
            <circle v-bind:cx="dx" v-bind:cy="dy" v-bind:r="dr" v-if="tool == 'svg-vue-r-circle'" fill="black"></circle>
            <line v-bind:x1="dx" v-bind:y1="dy" v-bind:x2="dx+dwidth" v-bind:y2="dy+dheight" stroke="black" v-if="tool == 'svg-vue-r-line'"></line>

            <!-- The frame, has to be drawn after to be above objects that extend beyond boundaries -->
            <rect x=0 y=0 v-bind:width="width" v-bind:height="height" stroke="black" fill="none"></rect>

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
const systemTools = ["svg-vue-r-square", "svg-vue-r-circle", "svg-vue-r-line", "svg-vue-r-select", "svg-vue-r-text"]

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
            resizing: false,
            bgcolor: "blue",
            tools: systemTools
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
                        console.log(new_item);
                        break;
                    case 'svg-vue-r-circle':
                        new_item.x = this.dx;
                        new_item.y = this.dy;
                        new_item.r = Math.sqrt(this.dwidth * this.dwidth + this.dheight * this.dheight);
                        break;
                    case 'svg-vue-r-select':
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

        // When clicking on an item, make sure it appears as selected
        selectItem: function(item, index) {
            /* Unselect the previous object */
            this.deselectItem();

            /* Bring the object to the fore */
            this.items.splice(index, 1);
            this.items.push(item);

            /* Set halo */
            item.selected = true;
        },

        /* Make sure that all items are un-selected */
        deselectItem: function() {
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
            let selected_index = this.items.findIndex((item) => item.selected);

            if (selected_index >= 0)
                this.items.splice(selected_index, 1);
        },

        capitalize: (str) => str.charAt(0).toUpperCase() + str.slice(1)
    },
    components: {
        "svg-vue-r-square": {
            template: `
            <rect v-bind:x="item.x" v-bind:y="item.y" v-bind:width="item.width"
                v-bind:height="item.height" v-bind:fill="item.bgcolor"
                v-bind:stroke="stroke" v-bind:stroke-width="strokewidth"
                v-on:click.stop="select">
            </rect>
            `,
            props: ["item"],
            computed: {
                stroke: function() {
                    console.log(this.item)
                    if (this.item.selected)
                        return 'black';
                    else
                        return this.item.fgcolor || 'black';
                },
                strokewidth: function() {
                    console.log(this.item.selected)
                    if (this.item.selected)
                        return '3px';
                    else
                        return '1px';
                }
            },
            methods: {
                select: function() {
                    this.$emit("select")
                }
            }
        },
        "svg-vue-r-circle": {
            template: `
            <circle v-bind:cx="item.x" v-bind:cy="item.y" v-bind:r="item.r"
                v-bind:fill="item.bgcolor" v-bind:stroke="stroke"
                v-bind:stroke-width="strokewidth" v-on:click.stop="select">
            </circle>`,
            props: ["item"],
            computed: {
                stroke: function() {
                    console.log(this.item)
                    if (this.item.selected)
                        return 'black';
                    else
                        return this.item.fgcolor || 'black';
                },
                strokewidth: function() {
                    console.log(this.item.selected)
                    if (this.item.selected)
                        return '3px';
                    else
                        return '1px';
                }
            },
            methods: {
                select: function() {
                    this.$emit("select")
                }
            }
        },
        "svg-vue-r-line": {
            template: `
            <line :x1="item.x" :y1="item.y" :x2="item.x+item.width"
                :y2="item.y+item.height" :stroke-width="strokewidth"
                :stroke="stroke" v-on:click.stop="select">
            </line>
            `,
            props: ["item"],
            computed: {
                stroke: function() {
                    console.log(this.item)
                    if (this.item.selected)
                        return 'black';
                    else
                        return this.item.fgcolor || 'black';
                },
                strokewidth: function() {
                    console.log(this.item.selected)
                    if (this.item.selected)
                        return '3px';
                    else
                        return '1px';
                }
            },
            methods: {
                select: function() {
                    this.$emit("select")
                }
            }
        }
    }
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
</style>
