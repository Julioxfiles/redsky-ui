/**
 * RedSky Toggleable Behavior
 *
 * Purpose:
 *
 * Provides reusable open/close toggle behavior
 * for RedSky UI components.
 *
 *
 * Responsibilities:
 *
 * - Manage opened and closed states.
 * - Toggle component state.
 * - Synchronize accessibility attributes.
 * - Support programmatic state control.
 * - Emit toggle lifecycle events.
 * - Allow external event listeners.
 *
 *
 * Supported Components:
 *
 * - Dropdown
 * - Accordion
 * - Collapse
 * - Popover
 * - Tooltip
 * - Menu
 * - Drawer
 *
 *
 * Events:
 *
 * - beforeToggle
 * - toggle
 * - afterToggle
 * - open
 * - close
 *
 *
 * Public API:
 *
 * - toggle()
 * - open()
 * - close()
 * - setOpen()
 * - isOpen()
 * - on()
 * - off()
 *
 *
 * This file contains only public client-side behavior.
 * Do not place sensitive information here.
 *
 *
 * No jQuery dependency.
 */


export class Toggleable {


    constructor(
        element,
        options = {}
    ) {

        if (
            !(element instanceof HTMLElement)
        ) {

            throw new TypeError(
                'RedSky Toggleable: Element must be an HTMLElement.'
            );
        }


        this.element =
            element;


        this.options = {

            attribute:
                'data-open',

            expandedAttribute:
                'aria-expanded',

            visibleClass:
                'is-open',

            initialState:
                false,

            ...options
        };


        this.opened =
            Boolean(
                this.options.initialState ||
                this.element.hasAttribute(
                    this.options.attribute
                )
            );


        this.events =
            new Map();


        this.sync();
    }



    toggle(
        detail = null
    ) {

        return this.opened
            ? this.close(detail)
            : this.open(detail);
    }



    open(
        detail = null
    ) {

        if (
            this.opened
        ) {

            return this;
        }


        if (
            !this.emitCancelable(
                'beforeToggle',
                {
                    state: 'open',
                    detail
                }
            )
        ) {

            return this;
        }


        this.opened =
            true;


        this.sync();


        this.emit(
            'open',
            detail
        );


        this.emit(
            'toggle',
            {
                state: 'open',
                detail
            }
        );


        this.emit(
            'afterToggle',
            {
                state: 'open',
                detail
            }
        );


        return this;
    }



    close(
        detail = null
    ) {

        if (
            !this.opened
        ) {

            return this;
        }


        if (
            !this.emitCancelable(
                'beforeToggle',
                {
                    state: 'close',
                    detail
                }
            )
        ) {

            return this;
        }


        this.opened =
            false;


        this.sync();


        this.emit(
            'close',
            detail
        );


        this.emit(
            'toggle',
            {
                state: 'close',
                detail
            }
        );


        this.emit(
            'afterToggle',
            {
                state: 'close',
                detail
            }
        );


        return this;
    }



    setOpen(
        state,
        detail = null
    ) {

        return state
            ? this.open(detail)
            : this.close(detail);
    }



    isOpen() {

        return this.opened;
    }



    sync() {

        if (
            !this.element
        ) {

            return this;
        }


        this.element.classList.toggle(
            this.options.visibleClass,
            this.opened
        );


        this.element.setAttribute(
            this.options.expandedAttribute,
            this.opened
                ? 'true'
                : 'false'
        );


        if (
            this.opened
        ) {

            this.element.setAttribute(
                this.options.attribute,
                ''
            );

        } else {

            this.element.removeAttribute(
                this.options.attribute
            );
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
                    detail: {
                        source:
                            this,

                        data:
                            detail
                    },

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

        const event =
            new CustomEvent(
                name,
                {
                    detail: {
                        source:
                            this,

                        data:
                            detail
                    }
                }
            );


        this.element.dispatchEvent(
            event
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

        this.events.clear();


        this.element =
            null;


        return this;
    }

}