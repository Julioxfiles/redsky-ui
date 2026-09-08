import DataGridConfig from './DataGridConfig.js';
import DataGridColumns from './DataGridColumns.js';
import DataGridSelection from './DataGridSelection.js';
import DataGridSorting from './DataGridSorting.js';
import DataGridPagination from './DataGridPagination.js';
import DataGridEditing from './DataGridEditing.js';
import DataGridActions from './DataGridActions.js';
import DataGridAjax from './DataGridAjax.js';
import DataGridPersistence from './DataGridPersistence.js';
import DataGridEvents from './DataGridEvents.js';

export default class DataGrid {

    constructor(element) {
        this.element = element;

        this.config = new DataGridConfig(element);
        this.columns = new DataGridColumns(this.config);
        this.selection = new DataGridSelection(this.config);
        this.sorting = new DataGridSorting(this.config);
        this.pagination = new DataGridPagination(this.config);
        this.editing = new DataGridEditing(this.config);
        this.actions = new DataGridActions(this.config);
        this.ajax = new DataGridAjax(this.config);
        this.persistence = new DataGridPersistence(this.config);
        this.events = new DataGridEvents(this.config);
    }

    init() {
        this.element.classList.add('redsky-datagrid');

        this.restorePreferences();

        this.bindSorting();
        this.bindSelection();
        this.bindPagination();
        this.bindEditing();
        this.bindActions();

        this.updateSortIndicators();

        return this;
    }

    getConfig() {
        return this.config;
    }

    getColumns() {
        return this.columns;
    }

    getSelection() {
        return this.selection;
    }

    getSorting() {
        return this.sorting;
    }

    getPagination() {
        return this.pagination;
    }

    getEditing() {
        return this.editing;
    }

    getActions() {
        return this.actions;
    }

    getAjax() {
        return this.ajax;
    }

    getPersistence() {
        return this.persistence;
    }

    getEvents() {
        return this.events;
    }

    /*
     * Sorting
     */

    bindSorting() {
        if (!this.sorting.isEnabled()) {
            return;
        }

        this.element
            .querySelectorAll(
                'th[data-sortable="true"]'
            )
            .forEach(header => {

                header.style.cursor = 'pointer';

                header.addEventListener(
                    'click',
                    () => {
                        const field =
                            header.dataset.column;

                        if (!field) {
                            return;
                        }

                        this.sorting.toggle(field);

                        this.sortRows();
                        this.updateSortIndicators();

                        this.savePreferences();

                        this.events.emit(
                            'sort',
                            this.sorting.all()
                        );
                    }
                );
            });
    }

    sortRows() {
        const tbody = this.element.querySelector('tbody');

        if (!tbody) {
            return;
        }

        const rows = [
            ...tbody.querySelectorAll('tr')
        ];

        if (rows.length === 0) {
            return;
        }

        const sorts = this.sorting.all();

        if (sorts.length === 0) {
            return;
        }

        rows.sort((a, b) => {

            for (const sort of sorts) {

                const aCell =
                    a.querySelector(
                        `[data-column="${CSS.escape(sort.field)}"]`
                    );

                const bCell =
                    b.querySelector(
                        `[data-column="${CSS.escape(sort.field)}"]`
                    );

                if (!aCell || !bCell) {
                    continue;
                }

                const aValue =
                    aCell.textContent.trim();

                const bValue =
                    bCell.textContent.trim();

                const aNumber = Number(aValue);
                const bNumber = Number(bValue);

                let result;

                if (
                    aValue !== '' &&
                    bValue !== '' &&
                    !Number.isNaN(aNumber) &&
                    !Number.isNaN(bNumber)
                ) {
                    result = aNumber - bNumber;
                } else {
                    result = aValue.localeCompare(
                        bValue
                    );
                }

                if (result !== 0) {
                    return sort.direction === 'desc'
                        ? -result
                        : result;
                }
            }

            return 0;
        });

        rows.forEach(row => tbody.appendChild(row));
    }

    updateSortIndicators() {
        this.element
            .querySelectorAll('th[data-column]')
            .forEach(header => {

                header.removeAttribute(
                    'data-sort-direction'
                );

                const field =
                    header.dataset.column;

                const sort =
                    this.sorting.get(field);

                if (sort) {
                    header.setAttribute(
                        'data-sort-direction',
                        sort.direction
                    );
                }
            });
    }

    /*
     * Selection
     */

    bindSelection() {
        if (!this.selection.isEnabled()) {
            return;
        }

        this.element
            .querySelectorAll(
                '[data-datagrid-selection="checkbox"]'
            )
            .forEach(cell => {

                if (
                    cell.querySelector(
                        'input[type="checkbox"]'
                    )
                ) {
                    return;
                }

                const checkbox =
                    document.createElement('input');

                checkbox.type = 'checkbox';

                cell.appendChild(checkbox);

                checkbox.addEventListener(
                    'change',
                    event => {

                        const row =
                            cell.closest('tr');

                        if (!row) {
                            return;
                        }

                        if (event.target.checked) {
                            this.selection.select(row);

                            row.classList.add(
                                'redsky-datagrid-selected'
                            );
                        } else {
                            this.selection.unselect(row);

                            row.classList.remove(
                                'redsky-datagrid-selected'
                            );
                        }

                        this.events.emit(
                            'selectionChange',
                            this.selection.all()
                        );
                    }
                );
            });

        const selectAll =
            this.element.querySelector(
                '[data-datagrid-selection="select-all"]'
            );

        if (selectAll) {

            const checkbox =
                document.createElement('input');

            checkbox.type = 'checkbox';

            selectAll.appendChild(checkbox);

            checkbox.addEventListener(
                'change',
                event => {

                    const checked =
                        event.target.checked;

                    this.element
                        .querySelectorAll(
                            'tbody tr'
                        )
                        .forEach(row => {

                            const rowCheckbox =
                                row.querySelector(
                                    '[data-datagrid-selection="checkbox"] input'
                                );

                            if (!rowCheckbox) {
                                return;
                            }

                            rowCheckbox.checked =
                                checked;

                            if (checked) {
                                this.selection.select(row);

                                row.classList.add(
                                    'redsky-datagrid-selected'
                                );
                            } else {
                                this.selection.unselect(row);

                                row.classList.remove(
                                    'redsky-datagrid-selected'
                                );
                            }
                        });

                    this.events.emit(
                        'selectionChange',
                        this.selection.all()
                    );
                }
            );
        }
    }

    /*
     * Pagination
     */

    bindPagination() {
        if (!this.pagination.isEnabled()) {
            return;
        }

        const pagination =
            this.element.querySelector(
                '[data-datagrid-pagination]'
            );

        if (!pagination) {
            return;
        }

        pagination.innerHTML = '';

        const previous =
            document.createElement('button');

        previous.type = 'button';
        previous.textContent = 'Previous';

        const next =
            document.createElement('button');

        next.type = 'button';
        next.textContent = 'Next';

        const info =
            document.createElement('span');

        const update = () => {

            const page =
                this.pagination.getPage();

            const pages =
                this.pagination.getPages();

            info.textContent =
                ` Page ${page} of ${pages || 1} `;

            previous.disabled =
                !this.pagination.hasPrevious();

            next.disabled =
                !this.pagination.hasNext();
        };

        previous.addEventListener(
            'click',
            () => {
                this.pagination.previous();

                this.updatePagination();

                update();

                this.events.emit(
                    'pageChange',
                    this.pagination.getPage()
                );
            }
        );

        next.addEventListener(
            'click',
            () => {
                this.pagination.next();

                this.updatePagination();

                update();

                this.events.emit(
                    'pageChange',
                    this.pagination.getPage()
                );
            }
        );

        pagination.appendChild(previous);
        pagination.appendChild(info);
        pagination.appendChild(next);

        update();
    }

    updatePagination() {
        const tbody =
            this.element.querySelector('tbody');

        if (!tbody) {
            return;
        }

        const rows = [
            ...tbody.querySelectorAll('tr')
        ];

        const perPage =
            this.pagination.getPerPage();

        const page =
            this.pagination.getPage();

        const start =
            (page - 1) * perPage;

        const end =
            start + perPage;

        rows.forEach((row, index) => {
            row.style.display =
                index >= start && index < end
                    ? ''
                    : 'none';
        });
    }

    /*
     * Editing
     */

    bindEditing() {
        if (!this.editing.isEnabled()) {
            return;
        }

        this.element
            .querySelectorAll(
                'td[data-editable="true"]'
            )
            .forEach(cell => {

                cell.addEventListener(
                    'dblclick',
                    () => this.editCell(cell)
                );
            });
    }

    editCell(cell) {
        if (
            cell.querySelector('input, select, textarea')
        ) {
            return;
        }

        const original =
            cell.textContent.trim();

        const editor =
            cell.dataset.editor || 'text';

        let input;

        if (editor === 'number') {
            input =
                document.createElement('input');

            input.type = 'number';

        } else if (editor === 'select') {
            input =
                document.createElement('select');

        } else {
            input =
                document.createElement('input');

            input.type = 'text';
        }

        input.value = original;

        cell.textContent = '';
        cell.appendChild(input);

        input.focus();

        const save = () => {
            cell.textContent =
                input.value;

            this.editing.stop();

            this.events.emit(
                'edit',
                cell,
                input.value
            );
        };

        const cancel = () => {
            cell.textContent = original;

            this.editing.stop();
        };

        input.addEventListener(
            'keydown',
            event => {

                if (event.key === 'Enter') {
                    save();
                }

                if (event.key === 'Escape') {
                    cancel();
                }
            }
        );

        input.addEventListener(
            'blur',
            () => {

                if (this.editing.isAutoSave()) {
                    save();
                }
            }
        );

        this.editing.start(
            cell.closest('tr'),
            cell.dataset.column
        );
    }

    /*
     * Actions
     */

    bindActions() {
        this.element
            .querySelectorAll(
                '[data-datagrid-action="true"]'
            )
            .forEach(action => {

                action.addEventListener(
                    'click',
                    event => {

                        const url =
                            action.dataset.actionUrl;

                        const actionEvent =
                            action.dataset.actionEvent;

                        if (actionEvent) {
                            this.events.emit(
                                actionEvent,
                                event,
                                action
                            );
                        }

                        if (url) {
                            window.location.href =
                                url;
                        }
                    }
                );
            });
    }

    /*
     * Persistence
     */

    restorePreferences() {
        if (!this.persistence.isEnabled()) {
            return;
        }

        const preferences =
            this.persistence.load();

        if (
            this.persistence.shouldPersist(
                'sorting'
            ) &&
            Array.isArray(preferences.sorting)
        ) {
            this.sorting.sorts =
                preferences.sorting;
        }

        if (
            this.persistence.shouldPersist(
                'pageSize'
            ) &&
            preferences.pageSize
        ) {
            this.pagination.setPerPage(
                preferences.pageSize
            );
        }
    }

    savePreferences() {
        if (!this.persistence.isEnabled()) {
            return;
        }

        this.persistence.save({
            sorting: this.sorting.all(),
            pageSize: this.pagination.getPerPage()
        });
    }
}

/*
 * Automatic initialization
 */

document.addEventListener(
    'DOMContentLoaded',
    () => {

        document
            .querySelectorAll(
                '[data-redsky-component="datagrid"]'
            )
            .forEach(element => {

                new DataGrid(element).init();

            });

    }
);