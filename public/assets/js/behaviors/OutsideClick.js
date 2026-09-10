/**
 * RedSky OutsideClick Behavior
 *
 * Purpose:
 *
 * Provides reusable outside interaction detection
 * for interactive RedSky UI components.
 *
 *
 * Responsibilities:
 *
 * - Detect pointer interactions outside an element.
 * - Support pointer and mouse interactions.
 * - Allow temporary enabling and disabling.
 * - Ignore configured excluded elements.
 * - Emit outside interaction lifecycle events.
 * - Cleanly release document listeners.
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
 * - Modal Backdrop
 *
 *
 * Options:
 *
 * event:
 *
 * Defines the document interaction event.
 *
 * Default:
 *
 * pointerdown
 *
 *
 * exclude:
 *
 * Elements that should not trigger outside detection.
 *
 *
 * Events:
 *
 * - beforeOutsideClick
 * - outsideClick
 *
 *
 * Public API:
 *
 * - enable()
 * - disable()
 * - isEnabled()
 * - setExclude()
 * - on()
 * - off()
 * - destroy()
 *
 *
 * The behavior does not:
 *
 * - Hide or remove components.
 * - Change component state.
 * - Create HTML markup.
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


export class OutsideClick {


    constructor(
        element,
        options = {}
    ) {

        if (
            !(element instanceof HTMLElement)
        ) {

            throw new TypeError(
                'RedSky OutsideClick: Element must be an HTMLElement.'
            );
        }


        this.element =
            element;


        this.options = {

            event:
                'pointerdown',

            exclude:
                [],

            ...options
        };


        this.events =
            new Map();


        this.enabled =
            false;


        this.boundHandler =
            this.handleInteraction.bind(
                this
            );


        this.enable();
    }



    enable() {

        if (
            this.enabled
        ) {

            return this;
        }


        document.addEventListener(
            this.options.event,
            this.boundHandler
        );


        this.enabled =
            true;


        return this;
    }



    disable() {

        if (
            !this.enabled
        ) {

            return this;
        }


        document.removeEventListener(
            this.options.event,
            this.boundHandler
        );


        this.enabled =
            false;


        return this;
    }



    isEnabled() {

        return this.enabled;
    }



    setExclude(
        elements
    ) {

        this.options.exclude =
            Array.from(
                elements
            );


        return this;
    }



    handleInteraction(
        event
    ) {

        const target =
            event.target;


        if (
            this.element.contains(
                target
            )
        ) {

            return;
        }


        if (
            this.isExcluded(
                target
            )
        ) {

            return;
        }


        if (
            !this.emitCancelable(
                'beforeOutsideClick',
                event
            )
        ) {

            return;
        }


        this.emit(
            'outsideClick',
            event
        );
    }



    isExcluded(
        target
    ) {

        return this.options.exclude.some(
            element => {

                return (
                    element instanceof HTMLElement &&
                    element.contains(
                        target
                    )
                );
            }
        );
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
                    detail: {
                        detail,
                        source: this
                    },
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

        const payload = {

            detail,

            source:
                this
        };


        this.element.dispatchEvent(
            new CustomEvent(
                event,
                {
                    detail:
                        payload
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
                            payload
                        );
                    }
                );
        }


        return this;
    }



    destroy() {

        this.disable();


        this.events.clear();


        this.options.exclude =
            [];


        this.element =
            null;


        return this;
    }

}