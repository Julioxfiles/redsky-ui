export default class DataGridSorting {

    constructor(config) {
        this.config = config;

        this.enabled = config.get('sortable', false);
        this.sorts = config.get('sorts', []);
    }

    isEnabled() {
        return this.enabled;
    }

    all() {
        return this.sorts;
    }

    get(field) {
        return this.sorts.find(
            sort => sort.field === field
        ) ?? null;
    }

    has(field) {
        return this.get(field) !== null;
    }

    add(field, direction = 'asc') {
        if (!this.enabled) {
            return;
        }

        direction = direction.toLowerCase();

        if (!['asc', 'desc'].includes(direction)) {
            throw new Error(
                `Invalid sort direction: ${direction}`
            );
        }

        const existing = this.get(field);

        if (existing) {
            existing.direction = direction;
            return;
        }

        this.sorts.push({
            field,
            direction
        });
    }

    remove(field) {
        this.sorts = this.sorts.filter(
            sort => sort.field !== field
        );
    }

    clear() {
        this.sorts = [];
    }

    toggle(field) {
        const existing = this.get(field);

        if (!existing) {
            this.add(field, 'asc');
            return;
        }

        if (existing.direction === 'asc') {
            existing.direction = 'desc';
            return;
        }

        this.remove(field);
    }
}