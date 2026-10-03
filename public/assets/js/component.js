/**
 * RedSky Component
 *
 * Base class for RedSky UI components.
 *
 * Responsibilities:
 *
 * - Store component DOM reference.
 * - Read component configuration.
 * - Manage lifecycle.
 * - Provide event helpers.
 * - Provide destroy handling.
 *
 * This class does not:
 *
 * - Create HTML markup.
 * - Define CSS styles.
 * - Implement component behavior.
 *
 * No jQuery dependency.
 */

export class Component {


    constructor(
        element
    ) {

        if (
            !(element instanceof HTMLElement)
        ) {

            throw new TypeError(
                'RedSky Component: Element must be an HTMLElement.'
            );
        }


        this.element =
            element;


        this.events =
            new Map();


        this.initialized =
            false;


        this.initialize();
    }



    /**
     * Initializes component.
     *
     * @returns {Component}
     */
    initialize() {

        this.initialized =
            true;


        return this;
    }



    /**
     * Returns component element.
     *
     * @returns {HTMLElement}
     */
    getElement() {

        return this.element;
    }



    /**
     * Reads data attribute.
     *
     * Example:
     *
     * data-modal-size="large"
     *
     * getData('modal-size')
     *
     * @param {string} name
     *
     * @returns {string|null}
     */
    getData(
        name
    ) {

        return this.element.dataset[
            this.camelCase(name)
        ] ?? null;
    }



    /**
     * Determines whether data attribute exists.
     *
     * @param {string} name
     *
     * @returns {boolean}
     */
    hasData(
        name
    ) {

        return (
            this.getData(name) !== null
        );
    }



    /**
     * Converts value to boolean.
     *
     * @param {string|boolean|null} value
     *
     * @returns {boolean}
     */
    boolean(
        value
    ) {

        return (
            value === true ||
            value === 'true'
        );
    }



    /**
     * Adds event listener.
     *
     * @param {string} event
     * @param {Function} callback
     *
     * @returns {Component}
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


        this.element.addEventListener(
            event,
            callback
        );


        return this;
    }



    /**
     * Emits custom event.
     *
     * @param {string} event
     * @param {*} detail
     *
     * @returns {Component}
     */
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


        return this;
    }



    /**
     * Removes component events.
     *
     * @returns {Component}
     */
    removeEvents() {

        this.events.forEach(
            (
                callbacks,
                event
            ) => {

                callbacks.forEach(
                    callback => {

                        this.element.removeEventListener(
                            event,
                            callback
                        );

                    }
                );

            }
        );


        this.events.clear();


        return this;
    }



    /**
     * Converts kebab-case to camelCase.
     *
     * @param {string} value
     *
     * @returns {string}
     */
    camelCase(
        value
    ) {

        return value.replace(
            /-([a-z])/g,
            (
                match,
                letter
            ) => {

                return letter.toUpperCase();

            }
        );
    }



    /**
     * Destroys component.
     *
     * @returns {Component}
     */
    destroy() {

        this.removeEvents();


        this.element =
            null;


        this.initialized =
            false;


        return this;
    }

}

