/**
 * RedSky Focusable Behavior
 *
 * Purpose:
 *
 * Provides reusable keyboard focus management
 * for interactive RedSky UI components.
 *
 *
 * Responsibilities:
 *
 * - Store the previously focused element.
 * - Move focus to component targets.
 * - Restore focus after closing.
 * - Support accessibility focus patterns.
 * - Manage focus lifecycle events.
 * - Provide optional focus trapping.
 * - Manage keyboard navigation inside trapped areas.
 *
 *
 * Supported Components:
 *
 * - Modal
 * - Dialog
 * - Popover
 * - Dropdown
 * - Menu
 * - Interactive Tooltip
 *
 *
 * Public API:
 *
 * - saveFocus()
 * - focus()
 * - focusElement()
 * - focusFirst()
 * - restore()
 * - clear()
 * - hasFocus()
 * - getFocusableElements()
 * - trapFocus()
 * - releaseFocusTrap()
 * - on()
 * - off()
 *
 *
 * Events:
 *
 * - focus
 * - restore
 * - focusTrapStart
 * - focusTrapEnd
 *
 *
 * The behavior does not:
 *
 * - Create HTML markup.
 * - Manage visibility.
 * - Control component state.
 * - Depend on any UI library.
 *
 *
 * This file contains only public browser-side behavior.
 *
 * Do not place sensitive information here.
 *
 *
 * No jQuery dependency.
 */


export class Focusable {


    constructor(
        element,
        options = {}
    ) {

        if (
            !(element instanceof HTMLElement)
        ) {

            throw new TypeError(
                'RedSky Focusable: Element must be an HTMLElement.'
            );
        }


        this.element =
            element;


        this.options = {

            autoFocus:
                true,

            restoreFocus:
                true,

            preventScroll:
                true,

            trapFocus:
                false,

            ...options
        };


        this.previousElement =
            null;


        this.events =
            new Map();


        this.boundKeydown =
            this.handleKeydown.bind(
                this
            );


        if (
            this.options.trapFocus
        ) {

            this.trapFocus();
        }
    }



    saveFocus() {

        this.previousElement =
            document.activeElement;


        return this;
    }



    focus() {

        if (
            !(this.element instanceof HTMLElement)
        ) {

            return this;
        }


        this.element.focus(
            {
                preventScroll:
                    this.options.preventScroll
            }
        );


        this.emit(
            'focus'
        );


        return this;
    }



    focusElement(
        target
    ) {

        if (
            !(target instanceof HTMLElement)
        ) {

            return this;
        }


        target.focus(
            {
                preventScroll:
                    this.options.preventScroll
            }
        );


        this.emit(
            'focus',
            target
        );


        return this;
    }



    focusFirst() {

        const target =
            this.getFocusableElements()[0];


        if (
            target
        ) {

            this.focusElement(
                target
            );
        }


        return this;
    }



    focusLast() {

        const elements =
            this.getFocusableElements();


        const target =
            elements[
                elements.length - 1
            ];


        if (
            target
        ) {

            this.focusElement(
                target
            );
        }


        return this;
    }



    getFocusableElements() {

        if (
            !this.element
        ) {

            return [];
        }


        return Array.from(
            this.element.querySelectorAll(
                [
                    'a[href]',
                    'button:not([disabled])',
                    'input:not([disabled])',
                    'select:not([disabled])',
                    'textarea:not([disabled])',
                    '[tabindex]:not([tabindex="-1"])'
                ].join(',')
            )
        );
    }



    trapFocus() {

        document.addEventListener(
            'keydown',
            this.boundKeydown
        );


        this.emit(
            'focusTrapStart'
        );


        return this;
    }



    releaseFocusTrap() {

        document.removeEventListener(
            'keydown',
            this.boundKeydown
        );


        this.emit(
            'focusTrapEnd'
        );


        return this;
    }



    handleKeydown(
        event
    ) {

        if (
            event.key !== 'Tab'
        ) {

            return;
        }


        const elements =
            this.getFocusableElements();


        if (
            elements.length === 0
        ) {

            return;
        }


        const first =
            elements[0];


        const last =
            elements[
                elements.length - 1
            ];


        if (
            event.shiftKey &&
            document.activeElement === first
        ) {

            event.preventDefault();


            last.focus();
        }


        else if (
            !event.shiftKey &&
            document.activeElement === last
        ) {

            event.preventDefault();


            first.focus();
        }
    }



    restore() {

        if (
            !this.options.restoreFocus
        ) {

            return this;
        }


        if (
            this.previousElement instanceof HTMLElement &&
            document.contains(
                this.previousElement
            )
        ) {

            this.previousElement.focus(
                {
                    preventScroll:
                        this.options.preventScroll
                }
            );


            this.emit(
                'restore',
                this.previousElement
            );
        }


        return this;
    }



    hasFocus() {

        return (
            this.element instanceof HTMLElement &&
            (
                document.activeElement === this.element ||
                this.element.contains(
                    document.activeElement
                )
            )
        );
    }



    clear() {

        this.previousElement =
            null;


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



    emit(
        event,
        detail = null
    ) {

        const payload = {

            detail,

            source:
                this
        };


        if (
            this.element
        ) {

            this.element.dispatchEvent(
                new CustomEvent(
                    event,
                    {
                        detail:
                            payload
                    }
                )
            );
        }


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

        this.releaseFocusTrap();


        this.events.clear();


        this.clear();


        this.element =
            null;


        return this;
    }

}