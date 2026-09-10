 /**
 * RedSky Closable Behavior
 *
 * Purpose:
 *
 * Provides reusable open and close lifecycle behavior
 * for RedSky UI components.
 *
 *
 * Responsibilities:
 *
 * - Manage component open and closed states.
 * - Provide common close operations.
 * - Provide common open operations.
 * - Trigger lifecycle events.
 * - Allow close and open operations to be canceled.
 * - Keep state management independent from rendering.
 *
 *
 * Supported Components:
 *
 * - Modal
 * - Alert
 * - Toast
 * - Tooltip
 * - Popover
 * - Dropdown
 * - Drawer
 * - Floating Panel
 *
 *
 * Public API:
 *
 * - open()
 * - close()
 * - restore()
 * - toggle()
 * - isOpen()
 * - isClosed()
 * - canOpen()
 * - canClose()
 * - on()
 * - off()
 *
 *
 * Events:
 *
 * - beforeOpen
 * - open
 * - afterOpen
 * - beforeClose
 * - close
 * - afterClose
 *
 *
 * Example:
 *
 * const closable =
 *     new Closable(
 *         element
 *     );
 *
 *
 * closable.on(
 *     'close',
 *     () => {
 *
 *         console.log(
 *             'Component closed'
 *         );
 *     }
 * );
 *
 *
 * closable.close();
 *
 *
 * The behavior does not:
 *
 * - Create HTML markup.
 * - Define CSS styles.
 * - Define animations.
 * - Remove elements from the DOM.
 * - Control visibility rules.
 * - Depend on any UI library.
 *
 *
 * This file contains only public client-side logic.
 *
 * Do not place sensitive information here.
 *
 *
 * No jQuery dependency.
 */


export class Closable {


    constructor(
        element,
        options = {}
    ) {

        if (
            !(element instanceof HTMLElement)
        ) {

            throw new TypeError(
                'RedSky Closable: Element must be an HTMLElement.'
            );
        }


        this.element =
            element;


        this.options = {

            open:
                true,

            ...options
        };


        this.state =
            this.options.open
                ? 'open'
                : 'closed';


        this.events =
            new Map();
    }



    /**
     * Opens the component.
     *
     * @returns {Closable}
     */
    open() {

        if (
            this.isOpen()
        ) {

            return this;
        }


        if (
            !this.canOpen()
        ) {

            return this;
        }


        if (
            !this.emitCancelable(
                'beforeOpen'
            )
        ) {

            return this;
        }


        this.state =
            'open';


        this.emit(
            'open'
        );


        this.emit(
            'afterOpen'
        );


        return this;
    }



    /**
     * Closes the component.
     *
     * @returns {Closable}
     */
    close() {

        if (
            this.isClosed()
        ) {

            return this;
        }


        if (
            !this.canClose()
        ) {

            return this;
        }


        if (
            !this.emitCancelable(
                'beforeClose'
            )
        ) {

            return this;
        }


        this.state =
            'closed';


        this.emit(
            'close'
        );


        this.emit(
            'afterClose'
        );


        return this;
    }



    /**
     * Restores component to open state.
     *
     * Does not emit beforeOpen.
     *
     * @returns {Closable}
     */
    restore() {

        this.state =
            'open';


        return this;
    }



    /**
     * Toggles component state.
     *
     * @returns {Closable}
     */
    toggle() {

        if (
            this.isOpen()
        ) {

            return this.close();
        }


        return this.open();
    }



    /**
     * Determines whether component is open.
     *
     * @returns {boolean}
     */
    isOpen() {

        return this.state === 'open';
    }



    /**
     * Determines whether component is closed.
     *
     * @returns {boolean}
     */
    isClosed() {

        return this.state === 'closed';
    }



    /**
     * Determines whether component can open.
     *
     * @returns {boolean}
     */
    canOpen() {

        return true;
    }



    /**
     * Determines whether component can close.
     *
     * @returns {boolean}
     */
    canClose() {

        return true;
    }



    /**
     * Registers event listener.
     *
     * @param string event
     * @param Function callback
     *
     * @returns {Closable}
     */
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



    /**
     * Removes event listener.
     *
     * @param string event
     * @param Function callback
     *
     * @returns {Closable}
     */
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



    /**
     * Emits event.
     *
     * @param string event
     * @param mixed detail
     *
     * @returns {Closable}
     */
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



    /**
     * Emits cancelable lifecycle event.
     *
     * Returning false cancels operation.
     *
     * @param string event
     *
     * @returns {boolean}
     */
    emitCancelable(
        event
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
                callback() === false
            ) {

                return false;
            }
        }


        return true;
    }



    /**
     * Destroys behavior instance.
     *
     * @returns {Closable}
     */
    destroy() {

        this.events.clear();


        this.element =
            null;


        return this;
    }

}