export default class DataGridPersistence {

    constructor(config) {
        this.config = config;

        this.enabled = config.get(
            'persistPreferences',
            false
        );

        this.key = config.get(
            'persistenceKey',
            null
        );

        this.url = config.get(
            'persistenceUrl',
            null
        );

        this.method = (
            config.get('persistenceMethod', 'POST')
        ).toUpperCase();

        this.options = {
            columnOrder: true,
            columnWidths: true,
            visibleColumns: true,
            sorting: true,
            pageSize: true,
            ...config.get('persistenceOptions', {})
        };
    }

    isEnabled() {
        return this.enabled;
    }

    getKey() {
        return this.key;
    }

    getUrl() {
        return this.url;
    }

    getMethod() {
        return this.method;
    }

    getOptions() {
        return this.options;
    }

    shouldPersist(option) {
        return (
            this.enabled &&
            this.options[option] === true
        );
    }

    load() {
        if (!this.enabled || !this.key) {
            return {};
        }

        const value = localStorage.getItem(this.key);

        if (!value) {
            return {};
        }

        try {
            return JSON.parse(value);
        } catch (error) {
            console.error(
                'RedSky DataGrid: invalid persisted preferences.',
                error
            );

            return {};
        }
    }

    save(preferences) {
        if (!this.enabled || !this.key) {
            return;
        }

        localStorage.setItem(
            this.key,
            JSON.stringify(preferences)
        );
    }

    clear() {
        if (!this.key) {
            return;
        }

        localStorage.removeItem(this.key);
    }
}