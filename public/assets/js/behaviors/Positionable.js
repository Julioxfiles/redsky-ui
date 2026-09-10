/**
 * RedSky Positionable Behavior
 *
 * Purpose:
 *
 * Provides reusable element positioning behavior
 * for floating and anchored RedSky UI components.
 *
 *
 * Responsibilities:
 *
 * - Calculate element positions relative to anchors.
 * - Support common placement directions.
 * - Apply calculated coordinates.
 * - Respect viewport boundaries.
 * - Support configurable offsets.
 * - Emit position lifecycle events.
 *
 *
 * Supported Components:
 *
 * - Tooltip
 * - Popover
 * - Dropdown
 * - Context Menu
 * - Floating Panel
 * - Select
 *
 *
 * Options:
 *
 * placement:
 *
 * Default placement direction.
 *
 * Available values:
 *
 * - top
 * - bottom
 * - left
 * - right
 *
 *
 * boundary:
 *
 * Position restriction area.
 *
 * Available values:
 *
 * - viewport
 * - none
 *
 *
 * offset:
 *
 * Distance between anchor and element.
 *
 *
 * Public API:
 *
 * - place()
 * - constrain()
 * - setPlacement()
 * - on()
 * - off()
 * - destroy()
 *
 *
 * Events:
 *
 * - beforePosition
 * - positionChange
 * - afterPosition
 *
 *
 * Example:
 *
 * const positionable =
 *     new Positionable(
 *         element,
 *         {
 *             placement: 'bottom'
 *         }
 *     );
 *
 *
 * positionable.place(
 *     button
 * );
 *
 *
 * The behavior does not:
 *
 * - Create HTML markup.
 * - Control visibility.
 * - Manage component state.
 * - Define CSS styles.
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


export class Positionable {


    constructor(
        element,
        options = {}
    ) {

        if (
            !(element instanceof HTMLElement)
        ) {

            throw new TypeError(
                'RedSky Positionable: Element must be an HTMLElement.'
            );
        }


        this.element =
            element;


        this.options = {

            placement:
                'bottom',

            boundary:
                'viewport',

            offset:
                8,

            ...options
        };


        this.events =
            new Map();
    }



    /**
     * Positions element relative to anchor.
     *
     * @param HTMLElement anchor
     * @param string placement
     *
     * @returns {Positionable}
     */
    place(
        anchor,
        placement = null
    ) {

        if (
            !(anchor instanceof HTMLElement)
        ) {

            return this;
        }


        if (
            !this.emitCancelable(
                'beforePosition',
                {
                    anchor
                }
            )
        ) {

            return this;
        }


        const direction =
            placement ||
            this.options.placement;


        const anchorRect =
            anchor.getBoundingClientRect();


        const elementRect =
            this.element.getBoundingClientRect();


        const scrollX =
            window.scrollX;


        const scrollY =
            window.scrollY;


        let left =
            anchorRect.left +
            scrollX;


        let top =
            anchorRect.bottom +
            scrollY +
            this.options.offset;


        switch (
            direction
        ) {

            case 'top':

                left =
                    anchorRect.left +
                    scrollX;


                top =
                    anchorRect.top +
                    scrollY -
                    elementRect.height -
                    this.options.offset;

                break;


            case 'left':

                left =
                    anchorRect.left +
                    scrollX -
                    elementRect.width -
                    this.options.offset;


                top =
                    anchorRect.top +
                    scrollY;

                break;


            case 'right':

                left =
                    anchorRect.right +
                    scrollX +
                    this.options.offset;


                top =
                    anchorRect.top +
                    scrollY;

                break;


            case 'bottom':

            default:

                left =
                    anchorRect.left +
                    scrollX;


                top =
                    anchorRect.bottom +
                    scrollY +
                    this.options.offset;

                break;
        }


        const position =
            this.options.boundary === 'viewport'
                ? this.constrain(
                    left,
                    top
                )
                : {
                    left,
                    top
                };


        this.element.style.position =
            'absolute';


        this.element.style.left =
            `${position.left}px`;


        this.element.style.top =
            `${position.top}px`;


        this.emit(
            'positionChange',
            {
                ...position,
                anchor,
                placement:
                    direction,
                source:
                    this
            }
        );


        this.emit(
            'afterPosition',
            position
        );


        return this;
    }



    /**
     * Changes default placement.
     *
     * @param string placement
     *
     * @returns {Positionable}
     */
    setPlacement(
        placement
    ) {

        this.options.placement =
            placement;


        return this;
    }



    /**
     * Keeps element inside viewport.
     *
     * @returns object
     */
    constrain(
        left,
        top
    ) {

        const width =
            this.element.offsetWidth;


        const height =
            this.element.offsetHeight;


        const maxLeft =
            window.scrollX +
            window.innerWidth -
            width;


        const maxTop =
            window.scrollY +
            window.innerHeight -
            height;


        return {

            left:
                Math.max(
                    window.scrollX,
                    Math.min(
                        left,
                        maxLeft
                    )
                ),


            top:
                Math.max(
                    window.scrollY,
                    Math.min(
                        top,
                        maxTop
                    )
                )
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



    emitCancelable(
        event,
        detail = null
    ) {

        const customEvent =
            new CustomEvent(
                event,
                {
                    detail,
                    cancelable:
                        true
                }
            );


        this.element.dispatchEvent(
            customEvent
        );


        return !customEvent.defaultPrevented;
    }



    emit(
        event,
        detail = null
    ) {

        this.element.dispatchEvent(
            new CustomEvent(
                event,
                {
                    detail
                }
            )
        );


        if (
            this.events.has(event)
        ) {

            this.events
                .get(event)
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

        this.events.clear();


        this.element =
            null;


        return this;
    }

}