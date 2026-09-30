/**
 * mobile-menu component
 *
 * Provides mobile drill-down navigation.
 *
 * Supports:
 *
 * - MenuItem text navigation
 * - Nested menus
 * - Component based items
 * - Cards
 * - Forms
 * - Images
 * - Interactive components
 */

document.addEventListener(
    'DOMContentLoaded',
    () => {


        const mobileMenus =
            document.querySelectorAll(
                '[data-redsky-component="mobile-menu"]'
            );


        mobileMenus.forEach(
            (mobileMenu) => {


                const root =
                    mobileMenu.querySelector(
                        '.mobile-menu-root'
                    );


                const source =
                    mobileMenu.querySelector(
                        '.mobile-menu-source'
                    );


                if (
                    !root ||
                    !source
                ) {
                    return;
                }


                const rootMenu =
                    source.querySelector(
                        ':scope > .menu'
                    );


                if (!rootMenu) {
                    return;
                }


                let currentMenu =
                    rootMenu;


                const history = [];



                /**
                 * Gets direct menu items.
                 */
                const getItems = (
                    menu
                ) => {

                    return Array.from(
                        menu.children
                    )
                    .filter(
                        (child) =>
                            child.classList.contains(
                                'menu-item'
                            )
                    );

                };



                /**
                 * Gets submenu from item.
                 */
                const getSubmenu = (
                    item
                ) => {


                    const sourceItem =
                        item._sourceItem
                            ??
                        item;


                    return sourceItem.querySelector(
                        ':scope > .menu'
                    );

                };



                /**
                 * Gets visible items.
                 */
                const getVisibleItems = () => {

                    return Array.from(
                        root.querySelectorAll(
                            ':scope > .menu > .menu-item'
                        )
                    );

                };



                /**
                 * Creates visible menu item.
                 *
                 * Keeps complete component content.
                 */
                const createVisibleItem = (
                    sourceItem
                ) => {


                    const item =
                        sourceItem.cloneNode(
                            true
                        );


                    /*
                     * Remove nested submenu.
                     *
                     * The submenu is handled
                     * by navigation history.
                     */
                    const submenu =
                        item.querySelector(
                            ':scope > .menu'
                        );


                    if (submenu) {

                        submenu.remove();

                    }



                    /*
                     * Keep reference
                     * to original item.
                     */
                    item._sourceItem =
                        sourceItem;



                    item.setAttribute(
                        'tabindex',
                        '-1'
                    );



                    return item;

                };

                                /**
                 * Creates back item.
                 */
                const createBackItem = () => {

                    const back =
                        document.createElement(
                            'li'
                        );


                    back.classList.add(
                        'menu-item',
                        'menu-back'
                    );


                    back.textContent =
                        '← Back';


                    back.setAttribute(
                        'tabindex',
                        '-1'
                    );


                    return back;

                };



                /**
                 * Renders current menu level.
                 */
                const renderMenu = (
                    menu
                ) => {


                    root.innerHTML =
                        '';



                    const container =
                        document.createElement(
                            'ul'
                        );


                    container.classList.add(
                        'menu'
                    );



                    /*
                     * Add back only when
                     * navigating menus.
                     */
                    if (
                        history.length > 0
                    ) {

                        container.appendChild(
                            createBackItem()
                        );

                    }



                    getItems(menu)
                        .forEach(
                            (sourceItem) => {


                                const item =
                                    createVisibleItem(
                                        sourceItem
                                    );


                                container.appendChild(
                                    item
                                );


                            }
                        );



                    root.appendChild(
                        container
                    );


                    focusFirstItem();

                };



                /**
                 * Focus first visible item.
                 */
                const focusFirstItem = () => {


                    const items =
                        getVisibleItems();



                    if (
                        items.length > 0
                    ) {

                        items[0].setAttribute(
                            'tabindex',
                            '0'
                        );


                        items[0].focus();

                    }

                };



                /**
                 * Enters submenu.
                 */
                const enterSubmenu = (
                    item
                ) => {


                    const submenu =
                        getSubmenu(
                            item
                        );


                    if (!submenu) {
                        return;
                    }



                    history.push(
                        currentMenu
                    );


                    currentMenu =
                        submenu;



                    renderMenu(
                        currentMenu
                    );

                };



                /**
                 * Goes back.
                 */
                const goBack = () => {


                    if (
                        history.length === 0
                    ) {
                        return;
                    }



                    currentMenu =
                        history.pop();



                    renderMenu(
                        currentMenu
                    );

                };

                                /**
                 * Click handling.
                 *
                 * Components inside MenuItems keep
                 * their own behavior.
                 */
                root.addEventListener(
                    'click',
                    (event) => {


                        /*
                         * Ignore internal component actions.
                         *
                         * Examples:
                         *
                         * - SwitchInput
                         * - Link
                         * - Button
                         * - Forms
                         */
                        if (
                            event.target.closest(
                                'a, button, input, select, textarea'
                            )
                        ) {

                            return;

                        }



                        const item =
                            event.target.closest(
                                '.menu-item'
                            );



                        if (!item) {
                            return;
                        }



                        /*
                         * Back navigation.
                         */
                        if (
                            item.classList.contains(
                                'menu-back'
                            )
                        ) {

                            goBack();

                            return;

                        }



                        /*
                         * Check submenu.
                         */
                        const submenu =
                            getSubmenu(
                                item
                            );



                        if (submenu) {

                            event.preventDefault();


                            enterSubmenu(
                                item
                            );


                            return;

                        }



                        /*
                         * Get original item.
                         */
                        const sourceItem =
                            item._sourceItem;



                        if (!sourceItem) {
                            return;
                        }



                        /*
                         * Navigation.
                         */
                        const href =
                            sourceItem.dataset.menuHref;



                        if (href) {

                            window.location.href =
                                href;


                            return;

                        }



                        /*
                         * Javascript action.
                         */
                        const action =
                            sourceItem.dataset.menuOnclick;



                        if (action) {


                            Function(
                                action
                            )();


                        }

                    }
                );

                                /**
                 * Keyboard navigation.
                 *
                 * Menu controls keyboard focus,
                 * but inner components keep their
                 * own keyboard behavior.
                 */
                root.addEventListener(
                    'keydown',
                    (event) => {


                        /*
                         * Ignore component controls.
                         */
                        if (
                            event.target.closest(
                                'a, button, input, select, textarea'
                            )
                        ) {

                            return;

                        }



                        const items =
                            getVisibleItems();



                        const active =
                            document.activeElement;



                        const index =
                            items.indexOf(
                                active
                            );



                        switch (
                            event.key
                        ) {



                            case 'ArrowDown':


                                event.preventDefault();



                                if (
                                    items.length > 0
                                ) {


                                    items[
                                        (
                                            index + 1
                                        )
                                        %
                                        items.length
                                    ].focus();


                                }


                                break;



                            case 'ArrowUp':


                                event.preventDefault();



                                if (
                                    items.length > 0
                                ) {


                                    items[
                                        (
                                            index - 1 +
                                            items.length
                                        )
                                        %
                                        items.length
                                    ].focus();


                                }


                                break;



                            case 'ArrowRight':
                            case 'Enter':


                                if (
                                    active &&
                                    getSubmenu(active)
                                ) {


                                    event.preventDefault();


                                    enterSubmenu(
                                        active
                                    );


                                }


                                break;



                            case 'ArrowLeft':
                            case 'Escape':


                                if (
                                    history.length > 0
                                ) {


                                    event.preventDefault();


                                    goBack();


                                }


                                break;

                        }

                    }
                );



                /*
                 * Initial render.
                 */
                renderMenu(
                    currentMenu
                );


            }
        );

    }
);