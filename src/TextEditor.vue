<template>
    <div class="text-editor" :style="{top: value.y + 24 + 'px'}"> 
        <label class="edited-text">
            <textarea rows="4" placeholder="Please enter the text" v-model="value.text"></textarea>
        </label>
        <div class="text-editor-options">
            <div>
                <button @click="save">Save</button>
                <button @click="cancel">Cancel</button>
            </div>
            <div>
                <label class="font-size">
                    Font Size:
                    <input type="number" min="1" v-model.number="value.size">
                </label>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ["value"],
    data: function() {
        return {
            text: this.value.text,
            size: this.value.size
        }
    },
    methods: {
        save: function() {
            this.$emit('hide')
        },
        cancel: function() {
            this.value.text = this.text;
            this.value.size = this.size;
            this.$emit('hide');
        }
    }
};
</script>

<style>
.text-editor{
    position:absolute;
    top:40%;
    left:0;
    right:0;
    margin:0 auto;
    width:62%;
    background:#fff;
    box-shadow:0 2px 8px rgba(0,0,0,.1);
    padding:12px;
    border:1px solid #f8f8f8;
    border-radius:2px;
    z-index:1;
}
label.edited-text{
    display:block;
    overflow:hidden;
    position:relative;
}
label.edited-text > textarea{
    width:100%;
    background-color:#fafafa;
    resize:none;
    padding:8px;
    border:none;
    box-sizing:border-box;
    margin:0;
}
.text-editor-options{
    position:relative;
    overflow:hidden;
    height:40px;
}
.text-editor-options > div{
    float:left;
    height:inherit;
}
.text-editor-options > div:first-of-type{
    width:62%;
}
.text-editor-options > div:first-of-type > button{
    margin-top:12px;
}
.text-editor-options > div:last-of-type{
    width:38%;
    text-align:right;
}
label.font-size{
    display:inline-block;
    width:50px;
    text-align:left;
    margin:0;
    font-size:10px;
    font-weight:bold;
    font-family:monospace;
    word-spacing: -2px;
    letter-spacing: -1px;
}
label.font-size > input{
    width:100%;
    padding:0;
    margin:2px 0 0 0;
    box-sizing:border-box;
}



</style>
