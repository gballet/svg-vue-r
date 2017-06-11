import {
    draggableShapeData,
    draggableShapeMethods,
    selectableShapeComputedProps
} from '../src/shapes.js';
import expect from 'expect';

const fakeStartX = 123;
const fakeStartY = 456;
const fakeTempX = 147;
const fakeTempY = 258;
const fakeEndX = 789;
const fakeEndY = 369;

describe("shape trait", () => {
    beforeEach(() => {
        this.fakeInstance = {
            ...draggableShapeData,
            ...draggableShapeMethods,
            ...selectableShapeComputedProps,
            $emit(signal, ...args) {
                this.emitted = signal;
                this.emitArgs = args;
            },
            item: {
                fgcolor: 'blue'
            }
        }
    });

    afterEach(() => {
        delete this.fakeInstance;
    });

    it("should provide the proper initial state for drag & drop", () => {
        expect(draggableShapeData.dragging).toBe(false);
        expect(draggableShapeData.initDragX).toBe(null);
        expect(draggableShapeData.initDragY).toBe(null);
        expect(draggableShapeData.currentDragX).toEqual(0);
        expect(draggableShapeData.currentDragY).toEqual(0);
    });

    it("should save the initial coordinates at the start", () => {
        expect(this.fakeInstance.initDragX).toBe(null);

        /* Simulate a click event */
        this.fakeInstance.moveStart({offsetX: fakeStartX, offsetY: fakeStartY});

        expect(this.fakeInstance.initDragX).toNotBe(null);
        expect(this.fakeInstance.initDragX).toBe(fakeStartX);
        expect(this.fakeInstance.currentDragX).toBe(0);
    });

    it("should update state when moving", () => {
        expect(this.fakeInstance.initDragX).toBe(null);
        expect(this.fakeInstance.currentDragX).toBe(0);
        expect(this.fakeInstance.dragging).toBe(false);

        /* Simulate a click event */
        this.fakeInstance.moveStart({offsetX: fakeStartX, offsetY: fakeStartY});

        /* Simulate a move event */
        this.fakeInstance.move({offsetX: fakeTempX, offsetY: fakeTempY});

        expect(this.fakeInstance.initDragX).toBe(fakeStartX);
        expect(this.fakeInstance.currentDragX).toBe(fakeTempX-fakeStartX);
        expect(this.fakeInstance.dragging).toBe(true);
    });

    it("should end up in the correct state", () => {
        expect(this.fakeInstance.initDragX).toBe(null);
        expect(this.fakeInstance.currentDragX).toBe(0);

        /* Simulate a click event */
        this.fakeInstance.moveStart({offsetX: fakeStartX, offsetY: fakeStartY});

        /* Simulate a move event */
        this.fakeInstance.move({offsetX: fakeTempX, offsetY: fakeTempY});

        /* Simulate mouse up */
        this.fakeInstance.moveEnd({offsetX: fakeEndX, offsetY: fakeEndY});

        expect(this.fakeInstance.initDragX).toBe(null);
        expect(this.fakeInstance.initDragY).toBe(null);
        expect(this.fakeInstance.dragging).toBe(false);
        expect(this.fakeInstance.emitted).toEqual('item');
        expect(this.fakeInstance.emitArgs).toBeA(Array);
        expect(this.fakeInstance.emitArgs.length).toEqual(2);
    });

    it("should emit a select event if the mouse hasn't moved", () => {
        expect(this.fakeInstance.initDragX).toBe(null);
        expect(this.fakeInstance.currentDragX).toBe(0);

        /* Simulate a click event */
        this.fakeInstance.moveStart({offsetX: fakeStartX, offsetY: fakeStartY});

        /* Simulate mouse up */
        this.fakeInstance.moveEnd({offsetX: fakeStartX+2, offsetY: fakeStartY+1});

        expect(this.fakeInstance.dragging).toBe(false);
        expect(this.fakeInstance.emitted).toEqual('select');
    });

    it("should thicken the stroke when the shape is selected", () => {
        expect(this.fakeInstance.stroke()).toBe('blue');
        expect(this.fakeInstance.strokewidth()).toBe('1px');

        this.fakeInstance.item.selected = true;

        expect(this.fakeInstance.stroke()).toBe('black');
        expect(this.fakeInstance.strokewidth()).toBe('3px');
    });
});
