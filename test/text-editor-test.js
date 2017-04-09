import Vue from 'vue';
import TextEditor from '../src/TextEditor.vue';
import expect from 'expect';

describe("<text-editor>", (done) => {
	it("should have the v-model value as input", () => {
		let vm = new Vue({
			data: { hi: { text: "hi" } },
			template: '<div><text-editor v-model="hi"></text-editor></div>',
			components: { 'text-editor': TextEditor }
		}).$mount();

		expect(vm.$el.querySelector("input").value).toBe(vm.hi.text);
	});

	it("should have a save and a cancel button", () => {
		let vm = new Vue({
			data: { hi: { text: "hi" } },
			template: '<div><text-editor v-model="hi"></text-editor></div>',
			components: { 'text-editor': TextEditor }
		}).$mount();

		let buttons = vm.$el.querySelectorAll("button");

		for (let i = 0; i < buttons.length; i++) {
			console.log(buttons[i].innerText)
			expect(buttons[`${i}`].innerText).toMatch(/(Save|Cancel)/);
		}
	});
});
