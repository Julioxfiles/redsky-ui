/**
 * menu-bar utilities
 *
 * Shared helper functions for MenuBar component.
 */


/**
 * Returns enabled and visible direct child menu items.
 *
 * @param {HTMLElement} menu
 * @returns {HTMLElement[]}
 */
export const getItems = (menu) => {

    return Array.from(
        menu.querySelectorAll(
            ':scope > .menu-item'
        )
    )
    .filter((item) => {

        return !item.classList.contains('disabled')
            && item.getAttribute('aria-disabled') !== 'true'
            && !item.hidden;

    });

};


/**
 * Normalizes keyboard shortcut notation.
 *
 * Example:
 *
 * "Ctrl + Shift + N"
 *
 * becomes:
 *
 * "ctrl+shift+n"
 *
 * @param {string} shortcut
 * @returns {string}
 */
export const normalizeShortcut = (shortcut) => {

    return shortcut
        .toLowerCase()
        .replace(/\s+/g, '');

};


/**
 * Checks whether a keyboard event matches
 * a shortcut definition.
 *
 * @param {KeyboardEvent} event
 * @param {string} shortcut
 * @returns {boolean}
 */
export const matchesShortcut = (
    event,
    shortcut
) => {

    const parts =
        normalizeShortcut(shortcut)
            .split('+');


    const key =
        parts.pop();


    const ctrlRequired =
        parts.includes('ctrl');


    const altRequired =
        parts.includes('alt');


    const shiftRequired =
        parts.includes('shift');


    const metaRequired =
        parts.includes('meta');


    if (event.ctrlKey !== ctrlRequired) {
        return false;
    }


    if (event.altKey !== altRequired) {
        return false;
    }


    if (event.shiftKey !== shiftRequired) {
        return false;
    }


    if (event.metaKey !== metaRequired) {
        return false;
    }


    return event.key.toLowerCase() === key;

};


/**
 * Returns direct submenu of a menu item.
 *
 * @param {HTMLElement} item
 * @returns {HTMLElement|null}
 */
export const getSubmenu = (item) => {

    return item.querySelector(
        ':scope > .menu'
    );

};


/**
 * Returns the element that should receive focus.
 *
 * Menu items may contain links or buttons.
 * Otherwise the item itself becomes focusable.
 *
 * @param {HTMLElement} item
 * @returns {HTMLElement}
 */
export const getFocusTarget = (item) => {

    const target =
        item.querySelector(
            ':scope > a, :scope > button'
        );


    if (target) {
        return target;
    }


    item.setAttribute(
        'tabindex',
        '0'
    );


    return item;

};


/**
 * Focuses a menu item.
 *
 * @param {HTMLElement} item
 * @returns {void}
 */
export const focusItem = (item) => {

    const target =
        getFocusTarget(item);


    if (target) {
        target.focus();
    }

};