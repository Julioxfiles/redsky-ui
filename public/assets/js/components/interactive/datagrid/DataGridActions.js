export default class DataGridActions {

    constructor(config) {
        this.config = config;

        this.globalActions = config.get(
            'globalActions',
            []
        );

        this.rowActions = config.get(
            'rowActions',
            []
        );
    }

    all() {
        return this.globalActions;
    }

    rows() {
        return this.rowActions;
    }

    get(name) {
        return this.globalActions.find(
            action => action.name === name
        ) ?? null;
    }

    getRowAction(name) {
        return this.rowActions.find(
            action => action.name === name
        ) ?? null;
    }

    has(name) {
        return this.get(name) !== null;
    }

    hasRowAction(name) {
        return this.getRowAction(name) !== null;
    }

    add(action) {
        this.globalActions.push(action);

        return this;
    }

    addRowAction(action) {
        this.rowActions.push(action);

        return this;
    }

    remove(name) {
        this.globalActions = this.globalActions.filter(
            action => action.name !== name
        );

        return this;
    }

    removeRowAction(name) {
        this.rowActions = this.rowActions.filter(
            action => action.name !== name
        );

        return this;
    }

    clear() {
        this.globalActions = [];

        return this;
    }

    clearRowActions() {
        this.rowActions = [];

        return this;
    }
}