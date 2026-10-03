/**
 * menu-bar-position
 *
 * Handles submenu positioning according
 * to viewport dimensions.
 */


/**
 * Clears inline positioning styles.
 *
 * @param {HTMLElement} submenu
 * @returns {void}
 */
const resetPosition = (submenu) => {

    submenu.style.top = '';
    submenu.style.bottom = '';
    submenu.style.left = '';
    submenu.style.right = '';
    submenu.style.maxHeight = '';
    submenu.style.overflowY = '';

};


/**
 * Positions a submenu according to viewport space.
 *
 * Root menus open vertically.
 * Nested menus open horizontally.
 *
 * @param {HTMLElement} item
 * @param {HTMLElement} submenu
 * @param {HTMLElement} rootMenu
 *
 * @returns {void}
 */
export const positionSubmenu = (
    item,
    submenu,
    rootMenu
) => {

    resetPosition(submenu);


    const itemRect =
        item.getBoundingClientRect();


    const submenuRect =
        submenu.getBoundingClientRect();


    const viewportWidth =
        window.innerWidth;


    const viewportHeight =
        window.innerHeight;


    const isRootItem =
        item.parentElement === rootMenu;


    /*
     * Root menu item.
     *
     * Opens below or above the menu bar.
     */
    if (isRootItem) {

        const spaceBelow =
            viewportHeight -
            itemRect.bottom;


        const spaceAbove =
            itemRect.top;


        if (spaceBelow >= submenuRect.height) {

            submenu.style.top =
                `${item.offsetHeight}px`;

            submenu.style.bottom =
                'auto';

        }

        else if (spaceAbove >= submenuRect.height) {

            submenu.style.top =
                'auto';

            submenu.style.bottom =
                `${item.offsetHeight}px`;

        }

        else if (spaceBelow >= spaceAbove) {

            submenu.style.top =
                `${item.offsetHeight}px`;

            submenu.style.bottom =
                'auto';

            submenu.style.maxHeight =
                `${Math.max(spaceBelow - 8, 0)}px`;

            submenu.style.overflowY =
                'auto';

        }

        else {

            submenu.style.top =
                'auto';

            submenu.style.bottom =
                `${item.offsetHeight}px`;

            submenu.style.maxHeight =
                `${Math.max(spaceAbove - 8, 0)}px`;

            submenu.style.overflowY =
                'auto';

        }


        /*
         * Horizontal alignment.
         */
        if (
            itemRect.left + submenuRect.width
            <= viewportWidth
        ) {

            submenu.style.left =
                '0';

            submenu.style.right =
                'auto';

            return;

        }


        if (
            itemRect.right - submenuRect.width
            >= 0
        ) {

            submenu.style.left =
                'auto';

            submenu.style.right =
                '0';

            return;

        }


        const spaceRight =
            viewportWidth -
            itemRect.left;


        const spaceLeft =
            itemRect.right;


        if (spaceRight >= spaceLeft) {

            submenu.style.left =
                '0';

            submenu.style.right =
                'auto';

        }

        else {

            submenu.style.left =
                'auto';

            submenu.style.right =
                '0';

        }


        return;

    }


    /*
     * Nested submenu.
     *
     * Prefer opening to the right.
     */

    const spaceRight =
        viewportWidth -
        itemRect.right;


    const spaceLeft =
        itemRect.left;


    if (
        spaceRight >= submenuRect.width
    ) {

        submenu.style.left =
            `${item.offsetWidth}px`;

        submenu.style.right =
            'auto';

    }

    else if (
        spaceLeft >= submenuRect.width
    ) {

        submenu.style.left =
            'auto';

        submenu.style.right =
            `${item.offsetWidth}px`;

    }

    else if (spaceRight >= spaceLeft) {

        submenu.style.left =
            `${item.offsetWidth}px`;

        submenu.style.right =
            'auto';

    }

    else {

        submenu.style.left =
            'auto';

        submenu.style.right =
            `${item.offsetWidth}px`;

    }


    /*
     * Vertical adjustment.
     */

    let positionedRect =
        submenu.getBoundingClientRect();


    if (
        positionedRect.bottom > viewportHeight
    ) {

        const overflow =
            positionedRect.bottom -
            viewportHeight +
            8;


        submenu.style.top =
            `${-overflow}px`;

    }


    positionedRect =
        submenu.getBoundingClientRect();


    if (
        positionedRect.top < 0
    ) {

        submenu.style.top =
            `${Math.abs(
                itemRect.top -
                positionedRect.top
            )}px`;

    }

};