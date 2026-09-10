export default class DataGridSelection {

    constructor(config) {
        this.config = config;

        this.enabled = config.get('selectable', false);
        this.mode = config.get('selectionMode', 'single');

        this.selected = [];
    }

    isEnabled() {
        return this.enabled;
    }

    getMode() {
        return this.mode;
    }

    isMultiple() {
        return this.mode === 'multiple';
    }

    select(row) {
        if (!this.enabled) {
            return;
        }

        if (this.isMultiple()) {
            if (!this.selected.includes(row)) {
                this.selected.push(row);
            }

            return;
        }

        this.selected = [row];
    }

    unselect(row) {
        this.selected = this.selected.filter(
            selected => selected !== row
        );
    }

    clear() {
        this.selected = [];
    }

    isSelected(row) {
        return this.selected.includes(row);
    }

    all() {
        return this.selected;
    }

    count() {
        return this.selected.length;
    }
}