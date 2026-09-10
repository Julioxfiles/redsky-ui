/**
 * RedSky Resizable Behavior
 *
 * Purpose:
 *
 * Provides reusable resize behavior for
 * RedSky UI components.
 *
 *
 * Responsibilities:
 *
 * - Allow components to be resized by the user.
 * - Manage resize handles.
 * - Track width and height changes.
 * - Support minimum and maximum dimensions.
 * - Support multiple resize directions.
 * - Emit resize lifecycle events.
 * - Cleanly release event listeners.
 *
 *
 * Supported Components:
 *
 * - Modal
 * - Panel
 * - Window
 * - Dialog
 * - Drawer
 * - Data Viewer
 *
 *
 * Options:
 *
 * direction:
 *
 * Resize direction.
 *
 * Available values:
 *
 * - bottom-right
 * - bottom-left
 * - top-right
 * - top-left
 * - horizontal
 * - vertical
 *
 *
 * minWidth:
 *
 * Minimum allowed width.
 *
 *
 * minHeight:
 *
 * Minimum allowed height.
 *
 *
 * maxWidth:
 *
 * Maximum allowed width.
 *
 *
 * maxHeight:
 *
 * Maximum allowed height.
 *
 *
 * preserveAspectRatio:
 *
 * Keeps width and height proportional.
 *
 *
 * Events:
 *
 * - beforeResize
 * - resizeStart
 * - resize
 * - resizeEnd
 *
 *
 * Public API:
 *
 * - enable()
 * - disable()
 * - resizeTo()
 * - getSize()
 * - setHandle()
 * - on()
 * - off()
 * - destroy()
 *
 *
 * This file contains only public client-side behavior.
 *
 * Do not place sensitive information here.
 *
 *
 * No jQuery dependency.
 */


export class Resizable {


    constructor(
        element,
        options = {}
    ) {

        if (
            !(element instanceof HTMLElement)
        ) {

            throw new TypeError(
                'RedSky Resizable: Element must be an HTMLElement.'
            );
        }


        this.element =
            element;


        this.options = {

            direction:
                'bottom-right',

            minWidth:
                100,

            minHeight:
                100,

            maxWidth:
                null,

            maxHeight:
                null,

            preserveAspectRatio:
                false,

            createHandle:
                true,

            ...options
        };


        this.resizing =
            false;


        this.startX =
            0;


        this.startY =
            0;


        this.startWidth =
            0;


        this.startHeight =
            0;


        this.handle =
            null;


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
                )
        };


        this.initialize();
    }



    initialize() {

        if (
            this.options.createHandle
        ) {

            this.createHandle();
        }


        this.bind();


        return this;
    }



    createHandle() {

        this.handle =
            document.createElement(
                'div'
            );


        this.handle.setAttribute(
            'data-resize-handle',
            this.options.direction
        );


        this.element.append(
            this.handle
        );


        return this;
    }



    setHandle(
        handle
    ) {

        if (
            !(handle instanceof HTMLElement)
        ) {

            return this;
        }


        this.unbind();


        this.handle =
            handle;


        this.bind();


        return this;
    }



    bind() {

        if (
            !this.handle
        ) {

            return this;
        }


        this.handle.addEventListener(
            'pointerdown',
            this.boundHandlers.start
        );


        return this;
    }



    unbind() {

        if (
            !this.handle
        ) {

            return this;
        }


        this.handle.removeEventListener(
            'pointerdown',
            this.boundHandlers.start
        );


        return this;
    }



    start(
        event
    ) {

        if (
            !this.emitCancelable(
                'beforeResize',
                event
            )
        ) {

            return;
        }


        event.preventDefault();


        this.resizing =
            true;


        const rect =
            this.element.getBoundingClientRect();


        this.startX =
            event.clientX;


        this.startY =
            event.clientY;


        this.startWidth =
            rect.width;


        this.startHeight =
            rect.height;


        this.handle.setPointerCapture(
            event.pointerId
        );


        document.addEventListener(
            'pointermove',
            this.boundHandlers.move
        );


        document.addEventListener(
            'pointerup',
            this.boundHandlers.end
        );


        this.emit(
            'resizeStart',
            {
                size:
                    this.getSize(),

                source:
                    this
            }
        );
    }



    move(
        event
    ) {

        if (
            !this.resizing
        ) {

            return;
        }


        event.preventDefault();


        let width =
            this.startWidth;


        let height =
            this.startHeight;


        const deltaX =
            event.clientX -
            this.startX;


        const deltaY =
            event.clientY -
            this.startY;


        switch (
            this.options.direction
        ) {

            case 'horizontal':

                width +=
                    deltaX;

                break;


            case 'vertical':

                height +=
                    deltaY;

                break;


            default:

                width +=
                    deltaX;

                height +=
                    deltaY;

                break;
        }


        if (
            this.options.preserveAspectRatio
        ) {

            const ratio =
                this.startWidth /
                this.startHeight;


            height =
                width /
                ratio;
        }


        width =
            this.limit(
                width,
                this.options.minWidth,
                this.options.maxWidth
            );


        height =
            this.limit(
                height,
                this.options.minHeight,
                this.options.maxHeight
            );


        this.applySize(
            width,
            height
        );


        this.emit(
            'resize',
            {
                width,
                height,

                source:
                    this
            }
        );
    }



    end() {

        if (
            !this.resizing
        ) {

            return;
        }


        this.resizing =
            false;


        document.removeEventListener(
            'pointermove',
            this.boundHandlers.move
        );


        document.removeEventListener(
            'pointerup',
            this.boundHandlers.end
        );


        this.emit(
            'resizeEnd',
            {
                size:
                    this.getSize(),

                source:
                    this
            }
        );
    }



    resizeTo(
        width,
        height
    ) {

        width =
            this.limit(
                width,
                this.options.minWidth,
                this.options.maxWidth
            );


        height =
            this.limit(
                height,
                this.options.minHeight,
                this.options.maxHeight
            );


        this.applySize(
            width,
            height
        );


        return this;
    }



    applySize(
        width,
        height
    ) {

        this.element.style.width =
            `${width}px`;


        this.element.style.height =
            `${height}px`;


        return this;
    }



    getSize() {

        return {

            width:
                this.element.offsetWidth,

            height:
                this.element.offsetHeight
        };
    }



    limit(
        value,
        min,
        max
    ) {

        if (
            min !== null &&
            value < min
        ) {

            value =
                min;
        }


        if (
            max !== null &&
            value > max
        ) {

            value =
                max;
        }


        return value;
    }



    enable() {

        if (
            this.handle
        ) {

            this.handle.hidden =
                false;
        }


        return this;
    }



    disable() {

        if (
            this.handle
        ) {

            this.handle.hidden =
                true;
        }


        return this;
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



    emitCancelable(
        name,
        detail = null
    ) {

        const event =
            new CustomEvent(
                name,
                {
                    detail,
                    cancelable:
                        true
                }
            );


        this.element.dispatchEvent(
            event
        );


        return !event.defaultPrevented;
    }



    emit(
        name,
        detail = null
    ) {

        this.element.dispatchEvent(
            new CustomEvent(
                name,
                {
                    detail
                }
            )
        );


        if (
            this.events.has(name)
        ) {

            this.events
                .get(name)
                .forEach(
                    callback => {

                        callback(
                            detail
                        );
                    }
                );
        }


        return this;
    }



    destroy() {

        this.end();


        this.unbind();


        if (
            this.handle &&
            this.options.createHandle
        ) {

            this.handle.remove();
        }


        this.events.clear();


        this.handle =
            null;


        this.element =
            null;


        return this;
    }

}