/**
 * RedSky Selectable Behavior
 *
 * Purpose:
 *
 * Provides reusable selection behavior for
 * RedSky UI components.
 *
 *
 * Responsibilities:
 *
 * - Manage selected and unselected states.
 * - Support single and multiple selection modes.
 * - Synchronize accessibility attributes.
 * - Emit selection lifecycle events.
 * - Allow external listeners.
 * - Maintain independent component state.
 *
 *
 * Supported Components:
 *
 * - DataGrid
 * - List
 * - Menu
 * - Tabs
 * - Cards
 * - Dropdown Options
 *
 *
 * Events:
 *
 * - beforeSelect
 * - select
 * - afterSelect
 * - beforeDeselect
 * - deselect
 * - afterDeselect
 *
 *
 * Public API:
 *
 * - select()
 * - deselect()
 * - toggle()
 * - isSelected()
 * - setSelected()
 * - getState()
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


export class Selectable {


    constructor(
        element,
        options = {}
    ) {

        if (
            !(element instanceof HTMLElement)
        ) {

            throw new TypeError(
                'RedSky Selectable: Element must be an HTMLElement.'
            );
        }


        this.element =
            element;


        this.options = {

            selectedAttribute:
                'data-selected',

            ariaAttribute:
                'aria-selected',

            selectedClass:
                'is-selected',

            multiple:
                false,

            initialState:
                false,

            ...options
        };


        this.selected =
            Boolean(
                this.options.initialState ||
                this.element.hasAttribute(
                    this.options.selectedAttribute
                )
            );


        this.events =
            new Map();


        this.sync();
    }



    select(
        detail = null
    ) {

        if (
            this.selected
        ) {

            return this;
        }


        if (
            !this.emitCancelable(
                'beforeSelect',
                detail
            )
        ) {

            return this;
        }


        this.selected =
            true;


        this.sync();


        this.emit(
            'select',
            detail
        );


        this.emit(
            'afterSelect',
            detail
        );


        return this;
    }



    deselect(
        detail = null
    ) {

        if (
            !this.selected
        ) {

            return this;
        }


        if (
            !this.emitCancelable(
                'beforeDeselect',
                detail
            )
        ) {

            return this;
        }


        this.selected =
            false;


        this.sync();


        this.emit(
            'deselect',
            detail
        );


        this.emit(
            'afterDeselect',
            detail
        );


        return this;
    }



    toggle(
        detail = null
    ) {

        return this.selected
            ? this.deselect(detail)
            : this.select(detail);
    }



    setSelected(
        state,
        detail = null
    ) {

        return state
            ? this.select(detail)
            : this.deselect(detail);
    }



    isSelected() {

        return this.selected;
    }



    getState() {

        return {

            selected:
                this.selected,

            element:
                this.element
        };
    }



    sync() {

        if (
            !this.element
        ) {

            return this;
        }


        this.element.classList.toggle(
            this.options.selectedClass,
            this.selected
        );


        if (
            this.selected
        ) {

            this.element.setAttribute(
                this.options.selectedAttribute,
                ''
            );


            this.element.setAttribute(
                this.options.ariaAttribute,
                'true'
            );

        } else {

            this.element.removeAttribute(
                this.options.selectedAttribute
            );


            this.element.setAttribute(
                this.options.ariaAttribute,
                'false'
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


        const listeners =
            this.events.get(
                event
            );


        this.events.set(
            event,
            listeners.filter(
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