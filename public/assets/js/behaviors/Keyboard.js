/**
 * RedSky Keyboard Behavior
 *
 * Purpose:
 *
 * Provides reusable keyboard interaction handling
 * for interactive RedSky UI components.
 *
 *
 * Responsibilities:
 *
 * - Listen for keyboard events.
 * - Handle configurable keyboard actions.
 * - Support common accessibility keys.
 * - Support configurable key mappings.
 * - Emit keyboard lifecycle events.
 * - Manage keyboard listeners lifecycle.
 *
 *
 * Supported Components:
 *
 * - Modal
 * - Dropdown
 * - Tooltip
 * - Popover
 * - Menu
 * - Tabs
 * - Dialog
 *
 *
 * Options:
 *
 * escape:
 *
 * Enables Escape key handling.
 *
 *
 * enter:
 *
 * Enables Enter key handling.
 *
 *
 * space:
 *
 * Enables Space key handling.
 *
 *
 * arrows:
 *
 * Enables arrow key handling.
 *
 *
 * home:
 *
 * Enables Home key handling.
 *
 *
 * end:
 *
 * Enables End key handling.
 *
 *
 * preventDefault:
 *
 * Prevents default browser behavior.
 *
 *
 * stopPropagation:
 *
 * Stops event propagation.
 *
 *
 * Events:
 *
 * - keyboardEscape
 * - keyboardEnter
 * - keyboardSpace
 * - keyboardArrow
 * - keyboardHome
 * - keyboardEnd
 * - keyboardTab
 *
 *
 * Public API:
 *
 * - enable()
 * - disable()
 * - isEnabled()
 * - on()
 * - off()
 * - destroy()
 *
 *
 * The behavior does not:
 *
 * - Create HTML markup.
 * - Define CSS styles.
 * - Control component state.
 * - Manage focus.
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


export class Keyboard {


    constructor(
        element,
        options = {}
    ) {

        if (
            !(element instanceof HTMLElement)
        ) {

            throw new TypeError(
                'RedSky Keyboard: Element must be an HTMLElement.'
            );
        }


        this.element =
            element;


        this.options = {

            escape:
                true,

            enter:
                false,

            space:
                false,

            arrows:
                false,

            home:
                false,

            end:
                false,

            tab:
                false,

            preventDefault:
                false,

            stopPropagation:
                false,

            ...options
        };


        this.enabled =
            false;


        this.events =
            new Map();


        this.boundKeydown =
            this.handleKeydown.bind(
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


        this.element.addEventListener(
            'keydown',
            this.boundKeydown
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


        this.element.removeEventListener(
            'keydown',
            this.boundKeydown
        );


        this.enabled =
            false;


        return this;
    }



    isEnabled() {

        return this.enabled;
    }



    handleKeydown(
        event
    ) {

        const key =
            event.key;


        const config = {

            Escape:
                [
                    'escape',
                    'keyboardEscape'
                ],

            Enter:
                [
                    'enter',
                    'keyboardEnter'
                ],

            ' ':
                [
                    'space',
                    'keyboardSpace'
                ],

            ArrowUp:
                [
                    'arrows',
                    'keyboardArrow'
                ],

            ArrowDown:
                [
                    'arrows',
                    'keyboardArrow'
                ],

            ArrowLeft:
                [
                    'arrows',
                    'keyboardArrow'
                ],

            ArrowRight:
                [
                    'arrows',
                    'keyboardArrow'
                ],

            Home:
                [
                    'home',
                    'keyboardHome'
                ],

            End:
                [
                    'end',
                    'keyboardEnd'
                ],

            Tab:
                [
                    'tab',
                    'keyboardTab'
                ]
        };


        if (
            !config[key]
        ) {

            return this;
        }


        const [
            option,
            eventName
        ] =
            config[key];


        if (
            !this.options[option]
        ) {

            return this;
        }


        if (
            this.options.preventDefault
        ) {

            event.preventDefault();
        }


        if (
            this.options.stopPropagation
        ) {

            event.stopPropagation();
        }


        this.emit(
            eventName,
            event
        );


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


        this.element =
            null;


        return this;
    }

}