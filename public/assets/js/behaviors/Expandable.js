/**
 * RedSky Expandable Behavior
 *
 * Purpose:
 *
 * Provides reusable expand and collapse state behavior
 * for RedSky UI components.
 *
 *
 * Responsibilities:
 *
 * - Manage expanded and collapsed states.
 * - Synchronize accessibility attributes.
 * - Support controlled and uncontrolled usage.
 * - Emit expansion lifecycle events.
 * - Allow state restoration.
 * - Cleanly release component references.
 *
 *
 * Supported Components:
 *
 * - Accordion
 * - Collapse
 * - Details Panel
 * - Dropdown Sections
 * - Expandable Cards
 *
 *
 * Options:
 *
 * expandedAttribute:
 *
 * Accessibility attribute used to expose state.
 *
 *
 * expandedClass:
 *
 * CSS class applied when expanded.
 *
 *
 * collapsedClass:
 *
 * CSS class applied when collapsed.
 *
 *
 * hiddenAttribute:
 *
 * Controls hidden attribute synchronization.
 *
 *
 * initialState:
 *
 * Initial expanded state.
 *
 *
 * Events:
 *
 * - beforeExpand
 * - expand
 * - afterExpand
 * - beforeCollapse
 * - collapse
 * - afterCollapse
 *
 *
 * Public API:
 *
 * - expand()
 * - collapse()
 * - toggle()
 * - setExpanded()
 * - isExpanded()
 * - isCollapsed()
 * - restore()
 * - on()
 * - off()
 * - destroy()
 *
 *
 * The behavior does not:
 *
 * - Create HTML markup.
 * - Define CSS styles.
 * - Manage animations.
 * - Remove DOM elements.
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


export class Expandable {


    constructor(
        element,
        options = {}
    ) {

        if (
            !(element instanceof HTMLElement)
        ) {

            throw new TypeError(
                'RedSky Expandable: Element must be an HTMLElement.'
            );
        }


        this.element =
            element;


        this.options = {

            expandedAttribute:
                'aria-expanded',

            expandedClass:
                'is-expanded',

            collapsedClass:
                'is-collapsed',

            hiddenAttribute:
                false,

            initialState:
                false,

            ...options
        };


        this.expanded =
            Boolean(
                this.options.initialState
            );


        this.events =
            new Map();


        this.syncState();
    }



    expand(
        detail = null
    ) {

        if (
            this.expanded
        ) {

            return this;
        }


        if (
            !this.emitCancelable(
                'beforeExpand',
                detail
            )
        ) {

            return this;
        }


        this.expanded =
            true;


        this.syncState();


        this.emit(
            'expand',
            detail
        );


        this.emit(
            'afterExpand',
            detail
        );


        return this;
    }



    collapse(
        detail = null
    ) {

        if (
            !this.expanded
        ) {

            return this;
        }


        if (
            !this.emitCancelable(
                'beforeCollapse',
                detail
            )
        ) {

            return this;
        }


        this.expanded =
            false;


        this.syncState();


        this.emit(
            'collapse',
            detail
        );


        this.emit(
            'afterCollapse',
            detail
        );


        return this;
    }



    toggle(
        detail = null
    ) {

        return this.expanded
            ? this.collapse(detail)
            : this.expand(detail);
    }



    setExpanded(
        state,
        detail = null
    ) {

        return state
            ? this.expand(detail)
            : this.collapse(detail);
    }



    isExpanded() {

        return this.expanded;
    }



    isCollapsed() {

        return !this.expanded;
    }



    restore() {

        this.syncState();


        return this;
    }



    initialize() {

        const value =
            this.element.getAttribute(
                this.options.expandedAttribute
            );


        if (
            value !== null
        ) {

            this.expanded =
                value === 'true';
        }


        this.syncState();


        return this;
    }



    syncState() {

        if (
            !this.element
        ) {

            return this;
        }


        this.element.setAttribute(
            this.options.expandedAttribute,
            this.expanded
                ? 'true'
                : 'false'
        );


        this.element.classList.toggle(
            this.options.expandedClass,
            this.expanded
        );


        this.element.classList.toggle(
            this.options.collapsedClass,
            !this.expanded
        );


        if (
            this.options.hiddenAttribute
        ) {

            this.element.hidden =
                !this.expanded;
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
                    detail: payload
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

        this.events.clear();


        this.element =
            null;


        return this;
    }

}