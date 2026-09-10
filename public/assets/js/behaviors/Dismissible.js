/**
 * RedSky Dismissible Behavior
 *
 * Purpose:
 *
 * Provides reusable user-triggered dismissal behavior
 * for RedSky UI components.
 *
 *
 * Responsibilities:
 *
 * - Handle user dismissal interactions.
 * - Support Escape key dismissal.
 * - Support outside click dismissal.
 * - Support delayed automatic dismissal.
 * - Provide dismissal lifecycle events.
 * - Allow dismissal cancellation.
 * - Allow components to restore dismissed state.
 *
 *
 * Supported Components:
 *
 * - Alert
 * - Toast
 * - Notification
 * - Tooltip
 * - Popover
 * - Modal
 * - Dropdown
 * - Floating Panel
 *
 *
 * Public API:
 *
 * - dismiss()
 * - restore()
 * - reset()
 * - isDismissed()
 * - startTimer()
 * - stopTimer()
 * - enableEscape()
 * - disableEscape()
 * - enableOutsideClick()
 * - disableOutsideClick()
 * - on()
 * - off()
 *
 *
 * Events:
 *
 * - beforeDismiss
 * - dismiss
 * - afterDismiss
 * - restore
 *
 *
 * The behavior does not:
 *
 * - Create HTML markup.
 * - Define CSS.
 * - Control animations.
 * - Remove DOM elements.
 * - Depend on any UI framework.
 *
 *
 * This file contains only public client-side behavior.
 *
 * Do not place sensitive information here.
 *
 *
 * No jQuery dependency.
 */


export class Dismissible {


    constructor(
        element,
        options = {}
    ) {

        if (
            !(element instanceof HTMLElement)
        ) {

            throw new TypeError(
                'RedSky Dismissible: Element must be an HTMLElement.'
            );
        }


        this.element =
            element;


        this.options = {

            dismissOnEscape:
                true,

            dismissOnOutsideClick:
                false,

            delay:
                null,

            ...options
        };


        this.dismissed =
            false;


        this.timer =
            null;


        this.events =
            new Map();


        this.boundHandlers = {

            keydown:
                this.handleKeydown.bind(
                    this
                ),

            outsideClick:
                this.handleOutsideClick.bind(
                    this
                )
        };


        this.bind();
    }



    bind() {

        if (
            this.options.dismissOnEscape
        ) {

            this.enableEscape();
        }


        if (
            this.options.dismissOnOutsideClick
        ) {

            this.enableOutsideClick();
        }


        if (
            this.options.delay !== null
        ) {

            this.startTimer();
        }


        return this;
    }



    dismiss(
        event = null
    ) {

        if (
            this.dismissed
        ) {

            return this;
        }


        if (
            !this.emitCancelable(
                'beforeDismiss',
                {
                    event,
                    source: this
                }
            )
        ) {

            return this;
        }


        this.dismissed =
            true;


        this.emit(
            'dismiss',
            {
                event,
                source: this
            }
        );


        this.emit(
            'afterDismiss',
            {
                source: this
            }
        );


        return this;
    }



    restore() {

        this.dismissed =
            false;


        this.emit(
            'restore',
            {
                source: this
            }
        );


        return this;
    }



    reset() {

        this.stopTimer();


        this.dismissed =
            false;


        return this;
    }



    isDismissed() {

        return this.dismissed;
    }



    startTimer() {

        this.stopTimer();


        if (
            this.options.delay === null
        ) {

            return this;
        }


        this.timer =
            setTimeout(
                () => {

                    this.dismiss();

                },
                this.options.delay
            );


        return this;
    }



    stopTimer() {

        if (
            this.timer !== null
        ) {

            clearTimeout(
                this.timer
            );


            this.timer =
                null;
        }


        return this;
    }



    enableEscape() {

        document.addEventListener(
            'keydown',
            this.boundHandlers.keydown
        );


        return this;
    }



    disableEscape() {

        document.removeEventListener(
            'keydown',
            this.boundHandlers.keydown
        );


        return this;
    }



    enableOutsideClick() {

        document.addEventListener(
            'click',
            this.boundHandlers.outsideClick
        );


        return this;
    }



    disableOutsideClick() {

        document.removeEventListener(
            'click',
            this.boundHandlers.outsideClick
        );


        return this;
    }



    handleKeydown(
        event
    ) {

        if (
            event.key === 'Escape'
        ) {

            this.dismiss(
                event
            );
        }
    }



    handleOutsideClick(
        event
    ) {

        if (
            !this.element.contains(
                event.target
            )
        ) {

            this.dismiss(
                event
            );
        }
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



    emitCancelable(
        event,
        detail = null
    ) {

        if (
            !this.events.has(event)
        ) {

            return true;
        }


        for (
            const callback of this.events.get(event)
        ) {

            if (
                callback(detail) === false
            ) {

                return false;
            }
        }


        return true;
    }



    destroy() {

        this.disableEscape();

        this.disableOutsideClick();

        this.stopTimer();

        this.events.clear();


        this.element =
            null;


        return this;
    }

}