
export default class DataGridColumns {

    constructor(config) {
        this.config = config;
        this.columns = config.get('columns', []);
    }

    all() {
        return this.columns;
    }

    get(field) {
        return this.columns.find(
            column => column.field === field
        ) ?? null;
    }

    has(field) {
        return this.get(field) !== null;
    }

    visible() {
        return this.columns.filter(
            column => column.visible !== false
        );
    }

    count() {
        return this.columns.length;
    }

    visibleCount() {
        return this.visible().length;
    }
}