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
    it("should provide the proper initial state for drag & drop", () => {
        expect(draggableShapeData.dragging).toBe(false);
        expect(draggableShapeData.initDragX).toBe(null);
        expect(draggableShapeData.initDragY).toBe(null);
        expect(draggableShapeData.currentDragX).toEqual(0);
        expect(draggableShapeData.currentDragY).toEqual(0);
    });

    it("should save the initial coordinates at the start", () => {
        let fakeInstance = {
            ...draggableShapeData,
            ...draggableShapeMethods
        };

        expect(fakeInstance.initDragX).toBe(null);

        /* Simulate a click event */
        fakeInstance.moveStart({offsetX: fakeStartX, offsetY: fakeStartY});

        expect(fakeInstance.initDragX).toNotBe(null);
        expect(fakeInstance.initDragX).toBe(fakeStartX);
        expect(fakeInstance.currentDragX).toBe(0);
    });

    it("should update state when moving", () => {
        let fakeInstance = {
            ...draggableShapeData,
            ...draggableShapeMethods
        };

        expect(fakeInstance.initDragX).toBe(null);
        expect(fakeInstance.currentDragX).toBe(0);
        expect(fakeInstance.dragging).toBe(false);

        /* Simulate a click event */
        fakeInstance.moveStart({offsetX: fakeStartX, offsetY: fakeStartY});

        /* Simulate a move event */
        fakeInstance.move({offsetX: fakeTempX, offsetY: fakeTempY});

        expect(fakeInstance.initDragX).toBe(fakeStartX);
        expect(fakeInstance.currentDragX).toBe(fakeTempX-fakeStartX);
        expect(fakeInstance.dragging).toBe(true);
    });

    it("should end up in the correct state", () => {
        let fakeInstance = {
            ...draggableShapeData,
            ...draggableShapeMethods,
            $emit(signal, ...args) {
                this.emitted = signal;
                this.emitArgs = args;
            }
        };

        expect(fakeInstance.initDragX).toBe(null);
        expect(fakeInstance.currentDragX).toBe(0);

        /* Simulate a click event */
        fakeInstance.moveStart({offsetX: fakeStartX, offsetY: fakeStartY});

        /* Simulate a move event */
        fakeInstance.move({offsetX: fakeTempX, offsetY: fakeTempY});

        /* Simulate mouse up */
        fakeInstance.moveEnd({offsetX: fakeEndX, offsetY: fakeEndY});

        expect(fakeInstance.initDragX).toBe(null);
        expect(fakeInstance.initDragY).toBe(null);
        expect(fakeInstance.dragging).toBe(false);
        expect(fakeInstance.emitted).toEqual('item');
        expect(fakeInstance.emitArgs).toBeA(Array);
        expect(fakeInstance.emitArgs.length).toEqual(2);
    });

    it("should emit a select event if the mouse hasn't moved", () => {
        let fakeInstance = {
            ...draggableShapeData,
            ...draggableShapeMethods,
            $emit(signal, ...args) {
                this.emitted = signal;
                this.emitArgs = args;
            }
        };

        expect(fakeInstance.initDragX).toBe(null);
        expect(fakeInstance.currentDragX).toBe(0);

        /* Simulate a click event */
        fakeInstance.moveStart({offsetX: fakeStartX, offsetY: fakeStartY});

        /* Simulate mouse up */
        fakeInstance.moveEnd({offsetX: fakeStartX+2, offsetY: fakeStartY+1});

        expect(fakeInstance.dragging).toBe(false);
        expect(fakeInstance.emitted).toEqual('select');
    });

    it("should thicken the stroke when the shape is selected", () => {
        let fakeInstance = {
            ...selectableShapeComputedProps,
            item: {
                fgcolor: 'blue'
            }
        };

        expect(fakeInstance.stroke()).toBe('blue');
        expect(fakeInstance.strokewidth()).toBe('1px');

        fakeInstance.item.selected = true;

        expect(fakeInstance.stroke()).toBe('black');
        expect(fakeInstance.strokewidth()).toBe('3px');
    });
});
