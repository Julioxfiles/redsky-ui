/**
 * menu-bar-core
 *
 * Main controller for MenuBar component.
 */

import {
    getSubmenu
} from './menu-bar-utils.js';

import {
    positionSubmenu
} from './menu-bar-position.js';

import {
    createKeyboardHandler
} from './menu-bar-keyboard.js';



/**
 * Initializes a MenuBar component.
 *
 * @param {HTMLElement} menuBar
 *
 * @returns {void}
 */
export const initMenuBar = (
    menuBar
) => {

    const rootMenu =
        menuBar.querySelector(
            ':scope > .menu'
        );


    if (!rootMenu) {
        return;
    }



    /**
     * Closes submenu and children.
     *
     * @param {HTMLElement} item
     *
     * @returns {void}
     */
    const closeSubmenu = (
        item
    ) => {

        const submenu =
            getSubmenu(item);


        if (!submenu) {
            return;
        }


        item.classList.remove(
            'show'
        );


        item.setAttribute(
            'aria-expanded',
            'false'
        );


        submenu.style.top = '';
        submenu.style.bottom = '';
        submenu.style.left = '';
        submenu.style.right = '';
        submenu.style.maxHeight = '';
        submenu.style.overflowY = '';



        submenu
            .querySelectorAll(
                '.menu-item.show'
            )
            .forEach((child) => {

                child.classList.remove(
                    'show'
                );


                child.setAttribute(
                    'aria-expanded',
                    'false'
                );

            });

    };



    /**
     * Closes all open submenus.
     *
     * @param {HTMLElement|null} except
     *
     * @returns {void}
     */
    const closeAll = (
        except = null
    ) => {

        menuBar
            .querySelectorAll(
                '.menu-item.show'
            )
            .forEach((item) => {


                if (
                    except &&
                    (
                        item === except ||
                        except.contains(item)
                    )
                ) {
                    return;
                }


                closeSubmenu(item);

            });

    };



    /**
     * Opens submenu.
     *
     * @param {HTMLElement} item
     *
     * @returns {void}
     */
    const openSubmenu = (
        item
    ) => {

        const submenu =
            getSubmenu(item);


        if (!submenu) {
            return;
        }



        const parentMenu =
            item.parentElement;



        if (parentMenu) {

            parentMenu
                .querySelectorAll(
                    ':scope > .menu-item.show'
                )
                .forEach((sibling) => {


                    if (
                        sibling !== item
                    ) {
                        closeSubmenu(
                            sibling
                        );
                    }

                });

        }



        item.classList.add(
            'show'
        );


        item.setAttribute(
            'aria-expanded',
            'true'
        );



        positionSubmenu(
            item,
            submenu,
            rootMenu
        );

    };



    /**
     * Toggles submenu visibility.
     *
     * @param {HTMLElement} item
     *
     * @returns {void}
     */
    const toggleSubmenu = (
        item
    ) => {

        const submenu =
            getSubmenu(item);


        if (!submenu) {
            return;
        }


        if (
            item.classList.contains(
                'show'
            )
        ) {

            closeSubmenu(item);

        }
        else {

            openSubmenu(item);

        }

    };



    /*
     * Mouse interaction.
     */
    menuBar.addEventListener(
        'click',
        (event) => {

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


            if (!submenu) {
                return;
            }


            event.preventDefault();

            event.stopPropagation();


            toggleSubmenu(item);

        }
    );



    /*
     * Keyboard interaction.
     */
    menuBar.addEventListener(
        'keydown',
        createKeyboardHandler(
            menuBar,
            rootMenu,
            openSubmenu,
            closeSubmenu,
            closeAll,
            toggleSubmenu
        )
    );



    /*
     * Close when clicking outside.
     */
    document.addEventListener(
        'click',
        (event) => {

            if (
                !menuBar.contains(
                    event.target
                )
            ) {

                closeAll();

            }

        }
    );



    /**
     * Repositions opened menus.
     *
     * @returns {void}
     */
    const reposition = () => {

        menuBar
            .querySelectorAll(
                '.menu-item.show > .menu'
            )
            .forEach((submenu) => {


                const item =
                    submenu.parentElement;


                if (item) {

                    positionSubmenu(
                        item,
                        submenu,
                        rootMenu
                    );

                }

            });

    };



    window.addEventListener(
        'resize',
        reposition
    );


    window.addEventListener(
        'scroll',
        reposition,
        true
    );

};