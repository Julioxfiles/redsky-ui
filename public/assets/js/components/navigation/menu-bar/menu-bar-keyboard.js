/**
 * menu-bar-keyboard
 *
 * Handles keyboard navigation and shortcuts
 * for MenuBar component.
 */

import {
    getItems,
    getSubmenu,
    focusItem,
    matchesShortcut
} from './menu-bar-utils.js';


/**
 * Creates keyboard event handler for MenuBar.
 *
 * @param {HTMLElement} menuBar
 * @param {HTMLElement} rootMenu
 * @param {Function} openSubmenu
 * @param {Function} closeSubmenu
 * @param {Function} closeAll
 * @param {Function} toggleSubmenu
 *
 * @returns {Function}
 */
export const createKeyboardHandler = (
    menuBar,
    rootMenu,
    openSubmenu,
    closeSubmenu,
    closeAll,
    toggleSubmenu
) => {


    /**
     * Handles keyboard navigation.
     *
     * @param {KeyboardEvent} event
     *
     * @returns {void}
     */
    return (event) => {


        /*
         * Keyboard shortcuts.
         */
        const shortcutItems =
            menuBar.querySelectorAll(
                '.menu-item-shortcut'
            );


        for (const shortcutElement of shortcutItems) {

            const shortcut =
                shortcutElement.textContent.trim();


            if (
                !matchesShortcut(
                    event,
                    shortcut
                )
            ) {
                continue;
            }


            const item =
                shortcutElement.closest(
                    '.menu-item'
                );


            if (!item) {
                continue;
            }


            if (
                item.classList.contains('disabled')
                ||
                item.getAttribute(
                    'aria-disabled'
                ) === 'true'
            ) {
                continue;
            }


            const action =
                item.querySelector(
                    ':scope > button'
                );


            if (!action) {
                continue;
            }


            event.preventDefault();
            event.stopPropagation();


            action.click();

            return;

        }


        const item =
            event.target.closest(
                '.menu-item'
            );


        if (
            !item ||
            !menuBar.contains(item)
        ) {
            return;
        }


        const submenu =
            getSubmenu(item);


        const parentMenu =
            item.closest('.menu');


        if (!parentMenu) {
            return;
        }


        const items =
            getItems(parentMenu);


        const index =
            items.indexOf(item);



        switch (event.key) {


            case 'ArrowDown': {

                event.preventDefault();


                /*
                 * Root menu:
                 *
                 * Enter submenu.
                 */
                if (
                    parentMenu === rootMenu
                    &&
                    submenu
                ) {

                    openSubmenu(item);


                    const submenuItems =
                        getItems(submenu);


                    const firstItem =
                        submenuItems[0];


                    if (firstItem) {
                        focusItem(firstItem);
                    }


                    return;

                }


                if (items.length > 0) {

                    const nextIndex =
                        (
                            index + 1
                        )
                        %
                        items.length;


                    focusItem(
                        items[nextIndex]
                    );

                }


                break;

            }



            case 'ArrowUp': {

                event.preventDefault();


                /*
                 * Root menu:
                 *
                 * Enter submenu from bottom.
                 */
                if (
                    parentMenu === rootMenu
                    &&
                    submenu
                ) {

                    openSubmenu(item);


                    const submenuItems =
                        getItems(submenu);


                    const lastItem =
                        submenuItems[
                            submenuItems.length - 1
                        ];


                    if (lastItem) {
                        focusItem(lastItem);
                    }


                    return;

                }


                if (items.length > 0) {

                    const previousIndex =
                        (
                            index -
                            1 +
                            items.length
                        )
                        %
                        items.length;


                    focusItem(
                        items[previousIndex]
                    );

                }


                break;

            }



            case 'ArrowRight': {

                event.preventDefault();


                if (
                    parentMenu === rootMenu
                ) {

                    const nextIndex =
                        (
                            index + 1
                        )
                        %
                        items.length;


                    const nextItem =
                        items[nextIndex];


                    closeAll();


                    focusItem(nextItem);


                    const nextSubmenu =
                        getSubmenu(nextItem);


                    if (nextSubmenu) {
                        openSubmenu(nextItem);
                    }


                    return;

                }


                if (submenu) {

                    openSubmenu(item);


                    const firstItem =
                        getItems(submenu)[0];


                    if (firstItem) {
                        focusItem(firstItem);
                    }

                }


                break;

            }



            case 'ArrowLeft': {

                event.preventDefault();


                const parentItem =
                    parentMenu.closest(
                        '.menu-item'
                    );


                if (
                    parentMenu === rootMenu
                ) {

                    const previousIndex =
                        (
                            index -
                            1 +
                            items.length
                        )
                        %
                        items.length;


                    const previousItem =
                        items[previousIndex];


                    closeAll();


                    focusItem(previousItem);


                    const previousSubmenu =
                        getSubmenu(
                            previousItem
                        );


                    if (previousSubmenu) {
                        openSubmenu(
                            previousItem
                        );
                    }


                    return;

                }


                if (parentItem) {

                    closeSubmenu(
                        parentItem
                    );


                    focusItem(
                        parentItem
                    );

                }


                break;

            }



            case 'Enter':
            case ' ': {

                if (submenu) {

                    event.preventDefault();

                    toggleSubmenu(item);

                }

                break;

            }



            case 'Escape': {

                event.preventDefault();


                closeAll();


                focusItem(item);


                break;

            }

        }

    };

};