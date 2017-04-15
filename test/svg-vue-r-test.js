import Vue from 'vue';
import SvgVueR from '../src/SvgVueR.vue';
import expect from 'expect';

describe("<svg-vue-r>", () => {
    beforeEach(() => {
        this.vm = new Vue({
            template: `<svg-vue-r ref="svgvuer"></svg-vue-r>`,
            components: {SvgVueR}
        }).$mount();
    });

    afterEach(() => {
        delete this.vm;
    });

    it("instantiates", () => {
        expect(this.vm.$refs.svgvuer.tool).toNotBe(undefined);
        expect(this.vm.$refs.svgvuer.items).toBeAn(Array);
        expect(this.vm.$refs.svgvuer.items.length).toEqual(0);
        expect(this.vm.$refs.svgvuer.drawing).toBeA('boolean');
        expect(this.vm.$refs.svgvuer.resizing).toBeA('boolean');
        expect(this.vm.$refs.svgvuer.bgcolor).toBeA('string');
        expect(this.vm.$refs.svgvuer.bgcolor.length).toBeGreaterThan(0);
        expect(this.vm.$refs.svgvuer.tools).toBeAn(Array);
        expect(this.vm.$refs.svgvuer.tools.length).toNotEqual(0);
    });

    it("should set the proper tool when asked", () => {
        expect(this.vm.$refs.svgvuer.tool).toNotEqual(this.vm.$refs.svgvuer.tools[1]);
        this.vm.$refs.svgvuer.setTool(this.vm.$refs.svgvuer.tools[1]);
        expect(this.vm.$refs.svgvuer.tool).toEqual(this.vm.$refs.svgvuer.tools[1]);
    });

    it("should set the proper color when asked", () => {
        expect(this.vm.$refs.svgvuer.bgcolor).toNotEqual('red');
        this.vm.$refs.svgvuer.setColor('red');
        expect(this.vm.$refs.svgvuer.bgcolor).toEqual('red');
    });

    /* TODO check that, when an item is slected, clicking on the color changes
    its color
    */
});
