/**
 * RedSky Draggable Behavior
 *
 * Purpose:
 *
 * Provides reusable drag-and-drop positioning behavior
 * for RedSky HTML components.
 *
 *
 * Responsibilities:
 *
 * - Detect pointer interaction on a drag handle.
 * - Calculate pointer offsets.
 * - Move elements during dragging.
 * - Preserve final position.
 * - Support viewport and custom boundaries.
 * - Provide drag lifecycle events.
 * - Prevent unwanted text selection.
 * - Manage pointer lifecycle safely.
 * - Cleanly remove event listeners.
 *
 *
 * Supported Components:
 *
 * - Modal
 * - Tooltip
 * - Popover
 * - Panel
 * - Floating Window
 *
 *
 * Options:
 *
 * boundary:
 *
 * Defines the drag restriction area.
 *
 * Available values:
 *
 * - viewport
 * - HTMLElement
 *
 *
 * Events:
 *
 * - dragStart
 * - dragMove
 * - dragEnd
 *
 *
 * Example:
 *
 * const draggable =
 *     new Draggable(
 *         element
 *     );
 *
 *
 * draggable.on(
 *     'dragEnd',
 *     position => {
 *
 *         console.log(
 *             position
 *         );
 *     }
 * );
 *
 *
 * The behavior does not:
 *
 * - Create HTML markup.
 * - Define CSS layouts.
 * - Manage component rendering.
 * - Control component visibility.
 * - Depend on any UI library.
 *
 *
 * This file contains only public client-side behavior.
 *
 * Do not place sensitive information here.
 *
 *
 * No jQuery dependency.
 */


export class Draggable {


    constructor(
        element,
        options = {}
    ) {

        if (
            !(element instanceof HTMLElement)
        ) {

            throw new TypeError(
                'RedSky Draggable: Element must be an HTMLElement.'
            );
        }


        this.element =
            element;


        this.handle =
            element.querySelector(
                '[data-drag-handle]'
            ) ||
            element;


        this.options = {

            boundary:
                'viewport',

            ...options
        };


        this.dragging =
            false;


        this.enabled =
            true;


        this.pointerId =
            null;


        this.offsetX =
            0;


        this.offsetY =
            0;


        this.startPosition = {

            x: 0,

            y: 0
        };


        this.events =
            new Map();


        this.boundHandlers = {

            start:
                this.start.bind(
                    this
                ),

            move:
                this.move.bind(
                    this
                ),

            end:
                this.end.bind(
                    this
                ),

            cancel:
                this.end.bind(
                    this
                )
        };


        this.bind();
    }



    bind() {

        this.handle.style.touchAction =
            'none';


        this.handle.addEventListener(
            'pointerdown',
            this.boundHandlers.start
        );


        return this;
    }



    enable() {

        this.enabled =
            true;


        return this;
    }



    disable() {

        this.enabled =
            false;


        return this;
    }



    start(
        event
    ) {

        if (
            !this.enabled
        ) {

            return;
        }


        this.dragging =
            true;


        this.pointerId =
            event.pointerId;


        this.handle.setPointerCapture(
            event.pointerId
        );


        const rect =
            this.element.getBoundingClientRect();


        this.offsetX =
            event.clientX -
            rect.left;


        this.offsetY =
            event.clientY -
            rect.top;


        this.startPosition = {

            x: rect.left,

            y: rect.top
        };


        document.addEventListener(
            'pointermove',
            this.boundHandlers.move
        );


        document.addEventListener(
            'pointerup',
            this.boundHandlers.end
        );


        document.addEventListener(
            'pointercancel',
            this.boundHandlers.cancel
        );


        document.body.style.userSelect =
            'none';


        this.emit(
            'dragStart',
            {
                x: rect.left,

                y: rect.top,

                event,

                source: this
            }
        );
    }



    move(
        event
    ) {

        if (
            !this.dragging
        ) {

            return;
        }


        let left =
            event.clientX -
            this.offsetX;


        let top =
            event.clientY -
            this.offsetY;


        const position =
            this.applyBoundary(
                left,
                top
            );


        this.setPosition(
            position.left,
            position.top
        );


        this.emit(
            'dragMove',
            {

                x:
                    position.left,

                y:
                    position.top,

                deltaX:
                    position.left -
                    this.startPosition.x,

                deltaY:
                    position.top -
                    this.startPosition.y,

                event,

                source:
                    this
            }
        );
    }



    end(
        event
    ) {

        if (
            !this.dragging
        ) {

            return;
        }


        this.dragging =
            false;


        this.pointerId =
            null;


        document.removeEventListener(
            'pointermove',
            this.boundHandlers.move
        );


        document.removeEventListener(
            'pointerup',
            this.boundHandlers.end
        );


        document.removeEventListener(
            'pointercancel',
            this.boundHandlers.cancel
        );


        document.body.style.userSelect =
            '';


        const position =
            this.getPosition();


        this.emit(
            'dragEnd',
            {

                x:
                    position.x,

                y:
                    position.y,

                event,

                source:
                    this
            }
        );
    }



    setPosition(
        x,
        y
    ) {

        this.element.style.left =
            `${x}px`;


        this.element.style.top =
            `${y}px`;


        return this;
    }



    getPosition() {

        const rect =
            this.element.getBoundingClientRect();


        return {

            x:
                rect.left,

            y:
                rect.top
        };
    }



    isDragging() {

        return this.dragging;
    }



    applyBoundary(
        left,
        top
    ) {

        if (
            this.options.boundary === 'viewport'
        ) {

            const rect =
                this.element.getBoundingClientRect();


            return {

                left:
                    Math.max(
                        0,
                        Math.min(
                            left,
                            window.innerWidth -
                            rect.width
                        )
                    ),


                top:
                    Math.max(
                        0,
                        Math.min(
                            top,
                            window.innerHeight -
                            rect.height
                        )
                    )
            };
        }


        if (
            this.options.boundary instanceof HTMLElement
        ) {

            const boundary =
                this.options.boundary
                    .getBoundingClientRect();


            const rect =
                this.element.getBoundingClientRect();


            return {

                left:
                    Math.max(
                        boundary.left,
                        Math.min(
                            left,
                            boundary.right -
                            rect.width
                        )
                    ),


                top:
                    Math.max(
                        boundary.top,
                        Math.min(
                            top,
                            boundary.bottom -
                            rect.height
                        )
                    )
            };
        }


        return {

            left,

            top
        };
    }



    on(
        event,
        callback
    ) {

        if (
            !this.events.has(event)
        ) {

            this.events.set(
                event,
                []
            );
        }


        this.events
            .get(event)
            .push(
                callback
            );


        return this;
    }



    off(
        event,
        callback
    ) {

        if (
            !this.events.has(event)
        ) {

            return this;
        }


        this.events.set(
            event,
            this.events
                .get(event)
                .filter(
                    listener =>
                        listener !== callback
                )
        );


        return this;
    }



    emit(
        event,
        detail = null
    ) {

        if (
            !this.events.has(event)
        ) {

            return this;
        }


        this.events
            .get(event)
            .forEach(
                callback => {

                    callback(
                        detail
                    );
                }
            );


        return this;
    }



    destroy() {

        this.end();


        this.handle.removeEventListener(
            'pointerdown',
            this.boundHandlers.start
        );


        this.events.clear();


        this.element =
            null;


        this.handle =
            null;


        return this;
    }

}