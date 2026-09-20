/**
 * SearchableSelect component.
 *
 * Provides searchable select behavior for both local and
 * remote data sources.
 *
 * Local mode:
 *
 *     Existing searchable-select-option elements are
 *     filtered directly in the DOM.
 *
 * Remote mode:
 *
 *     The component uses data-search-url to request
 *     matching results from a remote service.
 *
 * Supported data attributes:
 *
 * - data-search-url
 * - data-minimum-input-length
 * - data-delay
 * - data-limit
 *
 * Styling is handled by searchable-select.css.
 */

(function () {
    'use strict';

    /**
     * SearchableSelect controller.
     */
    class SearchableSelectController {

        /**
         * Creates a controller.
         *
         * @param {HTMLElement} element Root component element.
         */
        constructor(element) {
    console.log(
        '[SearchableSelect] constructor()',
        element
    );

    this.element = element;

    this.input = null;
    this.hiddenInput = null;
    this.menu = null;

    this.highlightedIndex = -1;
    this.searchTimer = null;
    this.abortController = null;
    this.requestSequence = 0;

    console.log(
        '[SearchableSelect] Calling initialize()'
    );

    this.initialize();

    console.log(
        '[SearchableSelect] constructor() completed'
    );
}

        /**
         * Initializes the component.
         *
         * @returns {void}
         */
        initialize() {
            console.log(
                '[SearchableSelect] initialize()'
            );

            this.input =
                this.element.querySelector(
                    '.form-control'
                );

            this.hiddenInput =
                this.element.querySelector(
                    'input[type="hidden"]'
                );

            this.menu =
                this.element.querySelector(
                    '.searchable-select-menu'
                );

            console.log(
                '[SearchableSelect] input:',
                this.input
            );

            console.log(
                '[SearchableSelect] hiddenInput:',
                this.hiddenInput
            );

            console.log(
                '[SearchableSelect] menu:',
                this.menu
            );

            if (!this.input || !this.menu) {
                console.log(
                    '[SearchableSelect] Required elements not found.'
                );

                return;
            }

            this.searchUrl =
                this.element.getAttribute(
                    'data-search-url'
                ) || '';

            this.minimumInputLength =
                this.getNumberAttribute(
                    'data-minimum-input-length',
                    0
                );

            this.delay =
                this.getNumberAttribute(
                    'data-delay',
                    300
                );

            this.limit =
                this.getNumberAttribute(
                    'data-limit',
                    20
                );

            this.debounceTimer = null;

            console.log(
                '[SearchableSelect] searchUrl:',
                this.searchUrl
            );

            console.log(
                '[SearchableSelect] minimumInputLength:',
                this.minimumInputLength
            );

            console.log(
                '[SearchableSelect] delay:',
                this.delay
            );

            console.log(
                '[SearchableSelect] limit:',
                this.limit
            );

            this.collectLocalOptions();

            console.log(
                '[SearchableSelect] Local options:',
                this.options.length
            );

            this.configureAccessibility();

            this.bindEvents();

            this.initializeSelectedOption();

            console.log(
                '[SearchableSelect] initialize() completed'
            );
        }


        /**
         * Collects options already present in the DOM.
         *
         * @returns {void}
         */
        collectLocalOptions() {
            console.log(
                '[SearchableSelect] collectLocalOptions()'
            );

            this.options = Array.from(
                this.menu.querySelectorAll(
                    '.searchable-select-option'
                )
            );

            console.log(
                '[SearchableSelect] Options found:',
                this.options.length
            );

            this.options.forEach(
                (option) => {
                    option.setAttribute(
                        'role',
                        'option'
                    );

                    if (
                        !option.hasAttribute(
                            'aria-selected'
                        )
                    ) {
                        option.setAttribute(
                            'aria-selected',
                            'false'
                        );
                    }

                    console.log(
                        '[SearchableSelect] Option:',
                        option.textContent.trim(),
                        'value:',
                        option.dataset.value
                    );
                }
            );
        }

        /**
         * Configures accessibility attributes.
         *
         * @returns {void}
         */
        configureAccessibility() {
            this.input.setAttribute(
                'role',
                'combobox'
            );

            this.input.setAttribute(
                'aria-autocomplete',
                'list'
            );

            this.input.setAttribute(
                'aria-expanded',
                'false'
            );

            this.menu.setAttribute(
                'role',
                'listbox'
            );
        }

        /**
         * Registers event listeners.
         *
         * @returns {void}
         */
        bindEvents() {
            this.input.addEventListener(
                'focus',
                () => {
                    this.open();
                }
            );

            this.input.addEventListener(
                'input',
                () => {
                    this.handleInput();
                }
            );

            this.input.addEventListener(
                'keydown',
                (event) => {
                    this.handleKeydown(event);
                }
            );

            this.menu.addEventListener(
                'click',
                (event) => {
                    this.handleOptionClick(event);
                }
            );

            document.addEventListener(
                'click',
                (event) => {
                    this.handleDocumentClick(event);
                }
            );
        }

        /**
         * Handles user input.
         *
         * @returns {void}
         */
        handleInput() {
            console.log(
                '[SearchableSelect] handleInput()'
            );

            const query =
                this.input.value.trim();

            console.log(
                '[SearchableSelect] Query:',
                query
            );

            this.open();

            console.log(
                '[SearchableSelect] Menu opened'
            );

            if (
                query.length <
                this.minimumInputLength
            ) {
                console.log(
                    '[SearchableSelect] Query below minimum length'
                );

                clearTimeout(
                    this.debounceTimer
                );

                if (this.abortController) {
                    console.log(
                        '[SearchableSelect] Aborting remote request'
                    );

                    this.abortController.abort();
                    this.abortController = null;
                }

                if (this.isRemote()) {
                    console.log(
                        '[SearchableSelect] Remote mode'
                    );

                    this.clearRemoteResults();
                    this.removeStatus();
                } else {
                    console.log(
                        '[SearchableSelect] Local mode'
                    );

                    this.filterLocalOptions(query);
                }

                return;
            }

            if (this.isRemote()) {
                console.log(
                    '[SearchableSelect] Scheduling remote search'
                );

                this.scheduleRemoteSearch(query);

                return;
            }

            console.log(
                '[SearchableSelect] Filtering local options'
            );

            this.filterLocalOptions(query);
        }

        /**
         * Determines whether remote searching is enabled.
         *
         * @returns {boolean}
         */
        isRemote() {
            return this.searchUrl !== '';
        }

        /**
         * Filters local DOM options.
         *
         * @param {string} query Search text.
         *
         * @returns {void}
         */
        filterLocalOptions(query) {
            console.log(
                '[SearchableSelect] filterLocalOptions()',
                query
            );

            const normalizedQuery =
                query.toLocaleLowerCase();

            let visibleCount = 0;

            this.options.forEach(
                (option) => {
                    const text =
                        option.textContent
                            .trim()
                            .toLocaleLowerCase();

                    const matches =
                        normalizedQuery === '' ||
                        text.includes(
                            normalizedQuery
                        );

                    option.hidden = !matches;

                    console.log(
                        '[SearchableSelect] Option:',
                        text,
                        'matches:',
                        matches,
                        'hidden:',
                        option.hidden
                    );

                    if (matches) {
                        visibleCount++;
                    }
                }
            );

            console.log(
                '[SearchableSelect] Visible options:',
                visibleCount
            );

            this.clearHighlight();

            this.highlightedIndex = -1;

            this.removeStatus();

            if (visibleCount === 0) {
                console.log(
                    '[SearchableSelect] No results found'
                );

                this.showStatus(
                    'No results found.'
                );
            }

            const visibleOptions = this.options.filter(
    (option) => !option.hidden
);

console.log(
    '[SearchableSelect] Visible option elements:',
    visibleOptions
);

console.log(
    '[SearchableSelect] Menu classes:',
    this.menu.className
);

console.log(
    '[SearchableSelect] Menu display:',
    window.getComputedStyle(this.menu).display
);
        }

        /**
         * Schedules a remote search.
         *
         * @param {string} query Search text.
         *
         * @returns {void}
         */
        scheduleRemoteSearch(query) {
            clearTimeout(
                this.debounceTimer
            );

            this.debounceTimer =
                setTimeout(
                    () => {
                        this.searchRemote(query);
                    },
                    this.delay
                );
        }

        /**
         * Performs a remote search.
         *
         * @param {string} query Search text.
         *
         * @returns {Promise<void>}
         */
        async searchRemote(query) {
            const sequence =
                ++this.requestSequence;

            if (this.abortController) {
                this.abortController.abort();
            }

            this.abortController =
                new AbortController();

            this.showLoading();

            try {
                const url =
                    this.buildSearchUrl(query);

                const response =
                    await fetch(
                        url,
                        {
                            method: 'GET',
                            headers: {
                                'Accept':
                                    'application/json'
                            },
                            signal:
                                this.abortController
                                    .signal
                        }
                    );

                if (!response.ok) {
                    throw new Error(
                        `Search request failed: ${response.status}`
                    );
                }

                const data =
                    await response.json();

                if (
                    sequence !==
                    this.requestSequence
                ) {
                    return;
                }

                const results =
                    this.normalizeResults(data);

                this.renderRemoteResults(
                    results
                );

            } catch (error) {

                if (
                    error.name ===
                    'AbortError'
                ) {
                    return;
                }

                if (
                    sequence !==
                    this.requestSequence
                ) {
                    return;
                }

                this.showError(
                    'Unable to load results.'
                );

                console.error(
                    'SearchableSelect:',
                    error
                );
            }
        }

        /**
         * Builds the remote search URL.
         *
         * Supports:
         *
         *     /api/search?q={query}
         *
         * and:
         *
         *     /api/search
         *
         * @param {string} query Search text.
         *
         * @returns {string}
         */
        buildSearchUrl(query) {
            const encodedQuery =
                encodeURIComponent(query);

            const encodedLimit =
                encodeURIComponent(
                    String(this.limit)
                );

            let url;

            if (
                this.searchUrl.includes(
                    '{query}'
                )
            ) {
                url =
                    this.searchUrl.replace(
                        '{query}',
                        encodedQuery
                    );
            } else {
                const separator =
                    this.searchUrl.includes('?')
                        ? '&'
                        : '?';

                url =
                    this.searchUrl +
                    separator +
                    'q=' +
                    encodedQuery;
            }

            const separator =
                url.includes('?')
                    ? '&'
                    : '?';

            return (
                url +
                separator +
                'limit=' +
                encodedLimit
            );
        }

        /**
         * Normalizes supported response formats.
         *
         * Supported:
         *
         *     [...]
         *
         *     { results: [...] }
         *
         *     { data: [...] }
         *
         *     { items: [...] }
         *
         *     { records: [...] }
         *
         * @param {*} data Response data.
         *
         * @returns {Array}
         */
        normalizeResults(data) {
            if (Array.isArray(data)) {
                return data;
            }

            if (
                data &&
                Array.isArray(data.results)
            ) {
                return data.results;
            }

            if (
                data &&
                Array.isArray(data.data)
            ) {
                return data.data;
            }

            if (
                data &&
                Array.isArray(data.items)
            ) {
                return data.items;
            }

            if (
                data &&
                Array.isArray(data.records)
            ) {
                return data.records;
            }

            return [];
        }

        /**
         * Renders remote search results.
         *
         * @param {Array} results Search results.
         *
         * @returns {void}
         */
        renderRemoteResults(results) {
            this.clearRemoteResults();

            this.removeStatus();

            if (results.length === 0) {
                this.showStatus(
                    'No results found.'
                );

                this.options = [];

                this.highlightedIndex = -1;

                return;
            }

            results
                .slice(0, this.limit)
                .forEach(
                    (result) => {
                        const normalized =
                            this.normalizeResult(
                                result
                            );

                        if (!normalized) {
                            return;
                        }

                        const option =
                            this.createOption(
                                normalized.text,
                                normalized.value
                            );

                        this.menu.appendChild(
                            option
                        );
                    }
                );

            this.options =
                Array.from(
                    this.menu.querySelectorAll(
                        '.searchable-select-option'
                    )
                );

            this.highlightedIndex = -1;
        }

        /**
         * Normalizes one remote result.
         *
         * Supported value fields:
         *
         * - value
         * - id
         * - key
         * - clave
         *
         * Supported text fields:
         *
         * - text
         * - name
         * - label
         * - nombre
         * - descripcion
         * - description
         *
         * @param {*} result Remote result.
         *
         * @returns {{value: *, text: string}|null}
         */
        normalizeResult(result) {
            if (
                !result ||
                typeof result !== 'object'
            ) {
                return null;
            }

            const value =
                result.value ??
                result.id ??
                result.key ??
                result.clave ??
                result.code ??
                null;

            const text =
                result.text ??
                result.name ??
                result.label ??
                result.nombre ??
                result.descripcion ??
                result.description ??
                null;

            if (
                value === null ||
                text === null
            ) {
                return null;
            }

            return {
                value: value,
                text: String(text)
            };
        }

        /**
         * Creates a remote option.
         *
         * @param {string} text Visible text.
         * @param {*} value Option value.
         *
         * @returns {HTMLDivElement}
         */
        createOption(text, value) {
            const option =
                document.createElement(
                    'div'
                );

            option.className =
                'searchable-select-option';

            option.textContent =
                text;

            option.dataset.value =
                String(value);

            option.dataset.remote =
                'true';

            option.setAttribute(
                'role',
                'option'
            );

            option.setAttribute(
                'aria-selected',
                'false'
            );

            return option;
        }

        /**
         * Handles option clicks.
         *
         * @param {MouseEvent} event Click event.
         *
         * @returns {void}
         */
        handleOptionClick(event) {
            const option =
                event.target.closest(
                    '.searchable-select-option'
                );

            if (!option) {
                return;
            }

            if (option.hidden) {
                return;
            }

            if (
                option.getAttribute(
                    'aria-disabled'
                ) === 'true'
            ) {
                return;
            }

            this.selectOption(option);
        }

        /**
         * Selects an option.
         *
         * @param {HTMLElement} option Option element.
         *
         * @returns {void}
         */
        selectOption(option) {
            const value =
                option.dataset.value ?? '';

            const text =
                option.textContent.trim();

            this.input.value =
                text;

            if (this.hiddenInput) {
                this.hiddenInput.value = value;
                console.log(
                    '[SearchableSelect] HiddenInput value:',
                    this.hiddenInput.value
                );
            }

            this.options.forEach(
                (currentOption) => {
                    currentOption.setAttribute(
                        'aria-selected',
                        currentOption === option
                            ? 'true'
                            : 'false'
                    );
                }
            );

            this.highlightedIndex =
                this.options.indexOf(
                    option
                );

            this.close();
        }

        /**
         * Initializes the selected option.
         *
         * @returns {void}
         */
        initializeSelectedOption() {
            const selected =
                this.menu.querySelector(
                    '.searchable-select-option[aria-selected="true"]'
                );

            if (!selected) {
                return;
            }

            this.input.value =
                selected.textContent.trim();

            if (
                this.hiddenInput &&
                selected.dataset.value !== undefined
            ) {
                this.hiddenInput.value =
                    selected.dataset.value;
            }
        }

        /**
         * Handles keyboard navigation.
         *
         * @param {KeyboardEvent} event Keyboard event.
         *
         * @returns {void}
         */
        handleKeydown(event) {
            if (event.key === 'ArrowDown') {
                event.preventDefault();

                this.open();

                this.moveHighlight(1);

                return;
            }

            if (event.key === 'ArrowUp') {
                event.preventDefault();

                this.open();

                this.moveHighlight(-1);

                return;
            }

            if (event.key === 'Enter') {
                if (
                    this.highlightedIndex >= 0 &&
                    this.options[
                        this.highlightedIndex
                    ]
                ) {
                    event.preventDefault();

                    this.selectOption(
                        this.options[
                            this.highlightedIndex
                        ]
                    );
                }

                return;
            }

            if (event.key === 'Escape') {
                event.preventDefault();

                this.close();
            }
        }

        /**
         * Moves keyboard highlight.
         *
         * @param {number} direction 1 or -1.
         *
         * @returns {void}
         */
        moveHighlight(direction) {
            const visibleOptions =
                this.options.filter(
                    (option) =>
                        !option.hidden &&
                        option.getAttribute(
                            'aria-disabled'
                        ) !== 'true'
                );

            if (
                visibleOptions.length === 0
            ) {
                return;
            }

            let current =
                visibleOptions.indexOf(
                    this.options[
                        this.highlightedIndex
                    ]
                );

            if (current < 0) {
                current =
                    direction > 0
                        ? -1
                        : visibleOptions.length;
            }

            current += direction;

            if (current < 0) {
                current =
                    visibleOptions.length - 1;
            }

            if (
                current >=
                visibleOptions.length
            ) {
                current = 0;
            }

            this.clearHighlight();

            const option =
                visibleOptions[current];

            this.highlightedIndex =
                this.options.indexOf(
                    option
                );

            option.classList.add(
                'active'
            );

            option.scrollIntoView({
                block: 'nearest'
            });
        }

        /**
         * Clears the current keyboard highlight.
         *
         * @returns {void}
         */
        clearHighlight() {
            this.options.forEach(
                (option) => {
                    option.classList.remove('active');
                }
            );
        }

        /**
         * Opens the menu.
         *
         * @returns {void}
         */
        open() {
            if (
                this.element.dataset.disabled ===
                'true'
            ) {
                return;
            }

            this.element.classList.add(
                'open'
            );

            this.input.setAttribute(
                'aria-expanded',
                'true'
            );
        }

        /**
         * Closes the menu.
         *
         * @returns {void}
         */
        close() {
            this.element.classList.remove(
                'open'
            );

            this.input.setAttribute(
                'aria-expanded',
                'false'
            );

            this.clearHighlight();

            this.highlightedIndex = -1;
        }

        /**
         * Handles clicks outside the component.
         *
         * @param {MouseEvent} event Click event.
         *
         * @returns {void}
         */
        handleDocumentClick(event) {
            if (
                !this.element.contains(
                    event.target
                )
            ) {
                this.close();
            }
        }

        /**
         * Shows loading status.
         *
         * @returns {void}
         */
        showLoading() {
            this.clearRemoteResults();

            this.showStatus(
                'Loading...'
            );
        }

        /**
         * Shows an error status.
         *
         * @param {string} message Error message.
         *
         * @returns {void}
         */
        showError(message) {
            this.clearRemoteResults();

            this.showStatus(
                message
            );

            this.options = [];

            this.highlightedIndex = -1;
        }

        /**
         * Shows a status message.
         *
         * @param {string} message Status text.
         *
         * @returns {void}
         */
        showStatus(message) {
            this.removeStatus();

            const status =
                document.createElement(
                    'div'
                );

            status.className =
                'searchable-select-status';

            status.textContent =
                message;

            status.setAttribute(
                'role',
                'status'
            );

            this.menu.appendChild(
                status
            );
        }

        /**
         * Removes status message.
         *
         * @returns {void}
         */
        removeStatus() {
            const status =
                this.menu.querySelector(
                    '.searchable-select-status'
                );

            if (status) {
                status.remove();
            }
        }

        /**
         * Removes dynamically generated
         * remote options.
         *
         * @returns {void}
         */
        clearRemoteResults() {
            const remoteOptions =
                this.menu.querySelectorAll(
                    '.searchable-select-option[data-remote="true"]'
                );

            remoteOptions.forEach(
                (option) => {
                    option.remove();
                }
            );

            this.options =
                Array.from(
                    this.menu.querySelectorAll(
                        '.searchable-select-option'
                    )
                );
        }

        /**
         * Reads a numeric data attribute.
         *
         * @param {string} name Attribute name.
         * @param {number} fallback Default value.
         *
         * @returns {number}
         */
        getNumberAttribute(
            name,
            fallback
        ) {
            const value =
                this.element.getAttribute(
                    name
                );

            if (value === null) {
                return fallback;
            }

            const number =
                Number(value);

            return Number.isFinite(number)
                ? number
                : fallback;
        }
    }

    /**
     * Initializes all SearchableSelect components.
     *
     * @returns {void}
     */
    /**
 * Initializes all SearchableSelect components.
 *
 * @returns {void}
 */
function initializeSearchableSelects() {
    console.log(
        '[SearchableSelect] initializeSearchableSelects()'
    );

    const elements =
        document.querySelectorAll(
            '.searchable-select'
        );

    console.log(
        '[SearchableSelect] Components found:',
        elements.length
    );

    elements.forEach(
        (element) => {
            console.log(
                '[SearchableSelect] Initializing:',
                element
            );

            if (
                element.searchableSelectController
            ) {
                console.log(
                    '[SearchableSelect] Already initialized.'
                );

                return;
            }

            element.searchableSelectController =
                new SearchableSelectController(
                    element
                );

            console.log(
                '[SearchableSelect] Controller created.'
            );
        }
    );
}


/**
 * Initializes components when the document
 * is ready.
 */
console.log(
    '[SearchableSelect] JavaScript loaded.'
);

if (
    document.readyState ===
    'loading'
) {
    console.log(
        '[SearchableSelect] Waiting for DOMContentLoaded.'
    );

    document.addEventListener(
        'DOMContentLoaded',
        initializeSearchableSelects
    );
} else {
    console.log(
        '[SearchableSelect] DOM already loaded.'
    );

    initializeSearchableSelects();
}

})();