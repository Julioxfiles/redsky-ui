/**
 * RedSky Modal Events
 *
 * Event management for RedSky Modal instances.
 *
 * No jQuery dependency.
 */

export class ModalEvents {

    constructor(modal) {

        this.modal =
            modal;

        this.events =
            new Map();
    }

    on(
        event,
        handler
    ) {

        if (
            typeof handler !==
            'function'
        ) {

            throw new TypeError(
                'RedSkyModal: Event handler must be a function.'
            );
        }

        if (
            !this.events.has(event)
        ) {

            this.events.set(
                event,
                new Set()
            );
        }

        this.events
            .get(event)
            .add(handler);

        return this.modal;
    }

    once(
        event,
        handler
    ) {

        if (
            typeof handler !==
            'function'
        ) {

            throw new TypeError(
                'RedSkyModal: Event handler must be a function.'
            );
        }

        const wrapper =
            (...args) => {

                this.off(
                    event,
                    wrapper
                );

                handler.apply(
                    this.modal,
                    args
                );
            };

        return this.on(
            event,
            wrapper
        );
    }

    off(
        event,
        handler
    ) {

        if (
            !this.events.has(event)
        ) {

            return this.modal;
        }

        if (handler) {

            this.events
                .get(event)
                .delete(handler);

            if (
                this.events
                    .get(event)
                    .size === 0
            ) {

                this.events.delete(
                    event
                );
            }

        } else {

            this.events.delete(
                event
            );
        }

        return this.modal;
    }

    emit(
        event,
        data = null
    ) {

        const handlers =
            this.events.get(
                event
            );

        if (!handlers) {
            return;
        }

        for (
            const handler of [
                ...handlers
            ]
        ) {

            handler.call(
                this.modal,
                data,
                this.modal
            );
        }
    }

    emitCancelable(
        event,
        data = null
    ) {

        const handlers =
            this.events.get(
                event
            );

        if (!handlers) {
            return true;
        }

        for (
            const handler of [
                ...handlers
            ]
        ) {

            const result =
                handler.call(
                    this.modal,
                    data,
                    this.modal
                );

            if (
                result === false
            ) {

                return false;
            }
        }

        return true;
    }

    clear() {

        this.events.clear();

        return this.modal;
    }

    has(event) {

        return this.events.has(
            event
        );
    }

    count(event) {

        if (
            !this.events.has(event)
        ) {

            return 0;
        }

        return this.events
            .get(event)
            .size;
    }
}
