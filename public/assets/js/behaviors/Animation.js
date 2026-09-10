/**
 * RedSky Animation Behavior
 *
 * Purpose:
 *
 * Provides reusable animation lifecycle handling
 * for RedSky UI components.
 *
 *
 * Responsibilities:
 *
 * - Apply animation classes.
 * - Detect animation completion.
 * - Coordinate enter and leave transitions.
 * - Prevent conflicting animations.
 * - Allow components to control animation timing.
 * - Emit animation lifecycle events.
 *
 *
 * Supported Components:
 *
 * - Modal
 * - Alert
 * - Tooltip
 * - Popover
 * - Dropdown
 * - Floating Panel
 *
 *
 * Public Methods:
 *
 * - enter()
 * - leave()
 * - finish()
 * - cleanup()
 * - isAnimating()
 * - on()
 * - off()
 * - destroy()
 *
 *
 * Events:
 *
 * - animationStart
 * - animationEnd
 * - animationCancel
 *
 *
 * Example:
 *
 * const animation =
 *     new Animation(
 *         element,
 *         {
 *             name: 'fade'
 *         }
 *     );
 *
 *
 * animation.enter();
 *
 *
 * The behavior does not:
 *
 * - Create HTML markup.
 * - Define CSS animations.
 * - Change component state.
 * - Control visibility rules.
 * - Depend on any UI library.
 *
 *
 * No jQuery dependency.
 */


export class Animation {


    constructor(
        element,
        options = {}
    ) {

        if (
            !(element instanceof HTMLElement)
        ) {

            throw new TypeError(
                'RedSky Animation: Element must be an HTMLElement.'
            );
        }


        this.element =
            element;


        this.options = {

            name:
                'fade',

            duration:
                200,

            ...options
        };


        this.state =
            'idle';


        this.events =
            new Map();


        this.boundEnd =
            this.handleEnd.bind(
                this
            );
    }



    /**
     * Starts enter animation.
     *
     * @returns {Animation}
     */
    enter() {

        return this.start(
            'enter'
        );
    }



    /**
     * Starts leave animation.
     *
     * @returns {Animation}
     */
    leave() {

        return this.start(
            'leave'
        );
    }



    /**
     * Starts animation lifecycle.
     *
     * @param string type
     *
     * @returns {Animation}
     */
    start(
        type
    ) {

        if (
            this.state !== 'idle'
        ) {

            this.cancel();
        }


        this.state =
            type;


        this.element.classList.add(
            `redsky-animation-${type}`
        );


        this.element.classList.add(
            `redsky-animation-${this.options.name}`
        );


        this.emit(
            'animationStart',
            {
                type
            }
        );


        this.listen();


        requestAnimationFrame(
            () => {

                if (
                    this.state !== type
                ) {

                    return;
                }


                this.element.classList.add(
                    'redsky-animation-active'
                );
            }
        );


        return this;
    }



    /**
     * Registers animation listeners.
     *
     * @returns {Animation}
     */
    listen() {

        this.element.addEventListener(
            'transitionend',
            this.boundEnd
        );


        this.element.addEventListener(
            'animationend',
            this.boundEnd
        );


        return this;
    }



    /**
     * Removes animation listeners.
     *
     * @returns {Animation}
     */
    unbind() {

        this.element.removeEventListener(
            'transitionend',
            this.boundEnd
        );


        this.element.removeEventListener(
            'animationend',
            this.boundEnd
        );


        return this;
    }



    /**
     * Handles animation completion.
     *
     * @param Event event
     *
     * @returns {Animation}
     */
    handleEnd(
        event
    ) {

        this.finish(
            event
        );


        return this;
    }



    /**
     * Completes current animation.
     *
     * @param mixed detail
     *
     * @returns {Animation}
     */
    finish(
        detail = null
    ) {

        if (
            this.state === 'idle'
        ) {

            return this;
        }


        const type =
            this.state;


        this.cleanup();


        this.emit(
            'animationEnd',
            {
                type,
                detail
            }
        );


        return this;
    }



    /**
     * Cancels current animation.
     *
     * @returns {Animation}
     */
    cancel() {

        if (
            this.state === 'idle'
        ) {

            return this;
        }


        const type =
            this.state;


        this.cleanup();


        this.emit(
            'animationCancel',
            {
                type
            }
        );


        return this;
    }



    /**
     * Removes animation classes.
     *
     * @returns {Animation}
     */
    cleanup() {

        this.unbind();


        this.element.classList.remove(
            'redsky-animation-enter',
            'redsky-animation-leave',
            'redsky-animation-active'
        );


        this.element.classList.remove(
            `redsky-animation-${this.options.name}`
        );


        this.state =
            'idle';


        return this;
    }



    /**
     * Determines if animation is running.
     *
     * @returns {boolean}
     */
    isAnimating() {

        return this.state !== 'idle';
    }



    /**
     * Adds event listener.
     *
     * @param string event
     * @param Function callback
     *
     * @returns {Animation}
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
     * @returns {Animation}
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
     * Emits behavior event.
     *
     * @param string event
     * @param mixed detail
     *
     * @returns {Animation}
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
     * Destroys animation instance.
     *
     * @returns {Animation}
     */
    destroy() {

        this.cancel();


        this.events.clear();


        this.element =
            null;


        return this;
    }

}