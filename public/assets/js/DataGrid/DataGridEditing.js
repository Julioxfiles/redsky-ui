export default class DataGridEditing {

    constructor(config) {
        this.config = config;

        this.enabled = config.get('editable', false);
        this.mode = config.get('editMode', 'cell');
        this.autoSave = config.get('autoSave', false);
        this.saveUrl = config.get('saveUrl', null);
        this.saveMethod = config.get('saveMethod', 'POST');
        this.validateEdits = config.get(
            'validateEdits',
            true
        );

        this.editing = null;
    }

    isEnabled() {
        return this.enabled;
    }

    getMode() {
        return this.mode;
    }

    isCellMode() {
        return this.mode === 'cell';
    }

    isRowMode() {
        return this.mode === 'row';
    }

    isAutoSave() {
        return this.autoSave;
    }

    shouldValidate() {
        return this.validateEdits;
    }

    getSaveUrl() {
        return this.saveUrl;
    }

    getSaveMethod() {
        return this.saveMethod;
    }

    start(row, field = null) {
        if (!this.enabled) {
            return false;
        }

        this.editing = {
            row,
            field
        };

        return true;
    }

    stop() {
        this.editing = null;

        return this;
    }

    isEditing() {
        return this.editing !== null;
    }

    getEditing() {
        return this.editing;
    }

    isEditingRow(row) {
        return this.editing?.row === row;
    }

    isEditingCell(row, field) {
        return (
            this.editing?.row === row &&
            this.editing?.field === field
        );
    }
}