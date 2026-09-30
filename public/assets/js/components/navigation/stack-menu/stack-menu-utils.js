/**
 * Stack Menu utilities
 *
 * Provides helper functions for StackMenu navigation.
 */


/**
 * Gets direct menu items.
 */
export function getMenuItems(
    menu
) {

    return Array.from(
        menu.children
    )
    .filter(
        (item) =>
            item.classList.contains(
                'menu-item'
            )
    );

}



/**
 * Gets submenu.
 */
export function getSubmenu(
    item
) {

    if (
        item._sourceItem
    ) {

        return item._sourceItem.querySelector(
            ':scope > .menu'
        );

    }


    return item.querySelector(
        ':scope > .menu'
    );

}



/**
 * Checks submenu existence.
 */
export function hasSubmenu(
    item
) {

    return getSubmenu(item) !== null;

}