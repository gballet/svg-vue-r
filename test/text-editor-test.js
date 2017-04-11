import Vue from 'vue';
import TextEditor from '../src/TextEditor.vue';
import expect, {spyOn} from 'expect';

describe("<text-editor>", (done) => {
	beforeEach(() => {
		this.vm = new Vue({
			data: { hi: { text: "hi" }, hidecalled: false },
			template: '<div><text-editor ref="texteditor" v-model="hi" @hide="hide"></text-editor></div>',
			components: { 'text-editor': TextEditor },
			methods: {
				hide: function() {
					// Spys don't work across nextTick so we have to be a bit
					// creative.
					this.hidecalled = true;
				}
			}
		}).$mount();
	});

	afterEach(() => {
		delete this.vm;
	});

	it("should have an input field", () => {
		expect(this.vm.$el.querySelector("input")).toNotBe(null);
	});

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

	it("should call the 'hide' callback when clicking on cancel", (done) => {
		var hideSpy = spyOn(this.vm, 'hide');

		expect(this.vm.hidecalled).toBe(false);

		// "click" on cancel
		this.vm.$refs.texteditor.cancel();

		Vue.nextTick(() => {
			expect(this.vm.hidecalled).toBe(true);
			done();
		});
	});

	it("should call the 'hide' callback when clicking on save", (done) => {
		var hideSpy = spyOn(this.vm, 'hide');

		expect(this.vm.hidecalled).toBe(false);

		// "click" on save
		this.vm.$refs.texteditor.save();

		Vue.nextTick(() => {
			expect(this.vm.hidecalled).toBe(true);
			done();
		});
	});
});
