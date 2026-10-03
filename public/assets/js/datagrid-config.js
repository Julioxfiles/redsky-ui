export default class DataGridConfig {

    constructor(element) {
        this.element = element;
        this.config = this.read();
    }

    read() {
        const value = this.element.dataset.datagridConfig;

        if (!value) {
            return {};
        }

        try {
            return JSON.parse(value);
        } catch (error) {
            console.error('RedSky DataGrid: invalid configuration.', error);

            return {};
        }
    }

    get(name, defaultValue = null) {
        return this.config[name] ?? defaultValue;
    }

    has(name) {
        return Object.prototype.hasOwnProperty.call(
            this.config,
            name
        );
    }

    all() {
        return this.config;
    }
}