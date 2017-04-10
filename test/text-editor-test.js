import Vue from 'vue';
import TextEditor from '../src/TextEditor.vue';
import expect from 'expect';

describe("<text-editor>", (done) => {
	beforeEach(() => {
		this.vm = new Vue({
			data: { hi: { text: "hi" } },
			template: '<div><text-editor ref="texteditor" v-model="hi"></text-editor></div>',
			components: { 'text-editor': TextEditor }
		}).$mount();
	});

	afterEach(() => {
		delete this.vm;
	})

	it("should have the v-model value as input", () => {
		expect(this.vm.$el.querySelector("input").value).toBe(this.vm.hi.text);
	});

	it("should have a save and a cancel button", () => {
		let buttons = this.vm.$el.querySelectorAll("button");

		for (let i = 0; i < buttons.length; i++) {
			expect(buttons[`${i}`].innerText).toMatch(/(Save|Cancel)/);
		}
	});

	it("should save the value upon clicking 'Save'", (done) => {
		const initialValue = this.vm.$data.hi.text;
		const targetValue = "changed value";

		// Set the input to a different value
		this.vm.$refs.texteditor.value.text = targetValue;

		Vue.nextTick(() => {
			// Initial value should be saved in "text"
			expect(this.vm.$refs.texteditor.text).toEqual(initialValue);

			// Bindings should be updated with the new value
			expect(this.vm.$data.hi.text).toNotEqual(initialValue);
			expect(this.vm.$refs.texteditor.value.text).toNotEqual(initialValue);

			// "click" on save
			this.vm.$refs.texteditor.save();

			// Data bindings should be updated
			expect(this.vm.$data.hi.text).toEqual(targetValue);
			expect(this.vm.$refs.texteditor.value.text).toEqual(targetValue);

			done();
		});
	});

	it("should set the initial value back upon clicking 'Cancel'", (done) => {
		const initialValue = this.vm.$data.hi.text;

		// Set the input to a different value
		this.vm.$refs.texteditor.value.text = "changed value";

		Vue.nextTick(() => {
			// Initial value should be saved in "text"
			expect(this.vm.$refs.texteditor.text).toEqual(initialValue);

			// Bindings should be updated with the new value
			expect(this.vm.$data.hi.text).toNotEqual(initialValue);
			expect(this.vm.$refs.texteditor.value.text).toNotEqual(initialValue);

			// "click" on cancel
			this.vm.$refs.texteditor.cancel();

			// Data bindings should be back to normal
			expect(this.vm.$data.hi.text).toEqual(initialValue);
			expect(this.vm.$refs.texteditor.value.text).toEqual(initialValue);

			done();
		});
	});
});
