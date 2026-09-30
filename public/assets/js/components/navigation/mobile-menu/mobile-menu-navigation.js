/**
 * Mobile Menu Navigation
 */

import {
    getSubmenu
} from './mobile-menu-utils.js';


import {
    renderMenu
} from './mobile-menu-renderer.js';



/**
 * Enters submenu.
 */
export function enterSubmenu(
    controller,
    item
) {

    const submenu =
        getSubmenu(
            item
        );


    if (!submenu) {
        return;
    }


    controller.history.push(
        controller.currentMenu
    );


    controller.currentMenu =
        submenu;


    renderMenu(
        controller,
        controller.currentMenu
    );

}



/**
 * Goes back.
 */
export function goBack(
    controller
) {

    if (
        controller.history.length === 0
    ) {
        return;
    }


    controller.currentMenu =
        controller.history.pop();


    renderMenu(
        controller,
        controller.currentMenu
    );

}