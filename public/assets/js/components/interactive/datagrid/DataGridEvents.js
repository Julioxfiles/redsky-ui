export default class DataGridEvents {

    constructor(config) {
        this.config = config;
        this.listeners = {};
    }

    on(event, callback) {
        if (typeof callback !== 'function') {
            throw new TypeError(
                'DataGrid event listener must be a function.'
            );
        }

        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }

        this.listeners[event].push(callback);

        return this;
    }

    off(event, callback = null) {
        if (!this.listeners[event]) {
            return this;
        }

        if (callback === null) {
            delete this.listeners[event];

            return this;
        }

        this.listeners[event] = this.listeners[event].filter(
            listener => listener !== callback
        );

        return this;
    }

    emit(event, ...args) {
        if (!this.listeners[event]) {
            return this;
        }

        this.listeners[event].forEach(
            listener => listener(...args)
        );

        return this;
    }

    has(event) {
        return (
            Array.isArray(this.listeners[event]) &&
            this.listeners[event].length > 0
        );
    }

    clear() {
        this.listeners = {};

        return this;
    }
}