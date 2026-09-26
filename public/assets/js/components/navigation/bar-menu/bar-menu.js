/**
 * bar-menu component
 *
 * Provides application menu behavior.
 *
 * Responsibilities:
 *
 * - Open and close menus.
 * - Manage nested submenus.
 * - Position submenus according to the viewport.
 * - Keep menus inside the viewport.
 * - Support keyboard navigation.
 * - Support keyboard shortcuts.
 */

document.addEventListener('DOMContentLoaded', () => {
    const barMenus = document.querySelectorAll('.bar-menu');

    barMenus.forEach((barMenu) => {
        const rootMenu = barMenu.querySelector(':scope > .menu');

        if (!rootMenu) {
            return;
        }

        const getItems = (menu) => {
            return Array.from(
                menu.querySelectorAll(':scope > .menu-item')
            ).filter((item) => {
                return !item.classList.contains('disabled')
                    && item.getAttribute('aria-disabled') !== 'true'
                    && !item.hidden;
            });
        };

        const normalizeShortcut = (shortcut) => {
            return shortcut
                .toLowerCase()
                .replace(/\s+/g, '');
        };

        const matchesShortcut = (event, shortcut) => {
            const parts = normalizeShortcut(shortcut)
                .split('+');

            const key = parts.pop();

            const ctrlRequired = parts.includes('ctrl');
            const altRequired = parts.includes('alt');
            const shiftRequired = parts.includes('shift');
            const metaRequired = parts.includes('meta');

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

        const getSubmenu = (item) => {
            return item.querySelector(':scope > .menu');
        };

        const getFocusTarget = (item) => {
            const submenu = getSubmenu(item);

            if (submenu) {
                return item;
            }

            return item.querySelector(
                ':scope > a, :scope > button'
            ) ?? item;
        };

        const focusItem = (item) => {
            const target = getFocusTarget(item);

            if (target) {
                target.focus();
            }
        };

        const closeSubmenu = (item) => {
            const submenu = getSubmenu(item);

            if (!submenu) {
                return;
            }

            item.classList.remove('show');
            item.setAttribute('aria-expanded', 'false');

            submenu.style.top = '';
            submenu.style.bottom = '';
            submenu.style.left = '';
            submenu.style.right = '';
            submenu.style.maxHeight = '';
            submenu.style.overflowY = '';

            submenu
                .querySelectorAll('.menu-item.show')
                .forEach((child) => {
                    child.classList.remove('show');
                    child.setAttribute(
                        'aria-expanded',
                        'false'
                    );

                    child
                        .querySelectorAll('.menu-item.show')
                        .forEach((nested) => {
                            nested.classList.remove('show');
                            nested.setAttribute(
                                'aria-expanded',
                                'false'
                            );
                        });
                });
        };

        const closeAll = (except = null) => {
            barMenu
                .querySelectorAll('.menu-item.show')
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

        const positionSubmenu = (item, submenu) => {
            submenu.style.top = '';
            submenu.style.bottom = '';
            submenu.style.left = '';
            submenu.style.right = '';
            submenu.style.maxHeight = '';
            submenu.style.overflowY = '';

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
             * Position the submenu below or above the item.
             */
            if (isRootItem) {
                const spaceBelow =
                    viewportHeight - itemRect.bottom;

                const spaceAbove =
                    itemRect.top;

                /*
                 * Prefer below.
                 */
                if (spaceBelow >= submenuRect.height) {
                    submenu.style.top =
                        `${item.offsetHeight}px`;

                    submenu.style.bottom = 'auto';
                }

                /*
                 * Otherwise position above.
                 */
                else if (spaceAbove >= submenuRect.height) {
                    submenu.style.top = 'auto';

                    submenu.style.bottom =
                        `${item.offsetHeight}px`;
                }

                /*
                 * Not enough room either way.
                 * Use the side with more available space
                 * and make the menu scrollable.
                 */
                else if (spaceBelow >= spaceAbove) {
                    submenu.style.top =
                        `${item.offsetHeight}px`;

                    submenu.style.bottom = 'auto';

                    submenu.style.maxHeight =
                        `${Math.max(spaceBelow - 8, 0)}px`;

                    submenu.style.overflowY = 'auto';
                }

                else {
                    submenu.style.top = 'auto';

                    submenu.style.bottom =
                        `${item.offsetHeight}px`;

                    submenu.style.maxHeight =
                        `${Math.max(spaceAbove - 8, 0)}px`;

                    submenu.style.overflowY = 'auto';
                }

                /*
                 * Horizontal positioning.
                 *
                 * Prefer aligning with the left edge
                 * of the item.
                 */
                if (
                    itemRect.left + submenuRect.width
                    <= viewportWidth
                ) {
                    submenu.style.left = '0';
                    submenu.style.right = 'auto';

                    return;
                }

                /*
                 * Otherwise align with the right edge.
                 */
                if (
                    itemRect.right - submenuRect.width
                    >= 0
                ) {
                    submenu.style.left = 'auto';
                    submenu.style.right = '0';

                    return;
                }

                /*
                 * Menu is wider than the available space.
                 * Keep it inside the viewport as much as possible.
                 */
                const spaceRight =
                    viewportWidth - itemRect.left;

                const spaceLeft =
                    itemRect.right;

                if (spaceRight >= spaceLeft) {
                    submenu.style.left = '0';
                    submenu.style.right = 'auto';
                } else {
                    submenu.style.left = 'auto';
                    submenu.style.right = '0';
                }

                return;
            }

            /*
             * Nested submenu.
             *
             * Prefer opening to the right.
             */
            const spaceRight =
                viewportWidth - itemRect.right;

            const spaceLeft =
                itemRect.left;

            /*
             * Enough room on the right.
             */
            if (spaceRight >= submenuRect.width) {
                submenu.style.left =
                    `${item.offsetWidth}px`;

                submenu.style.right = 'auto';
            }

            /*
             * Otherwise open to the left.
             */
            else if (spaceLeft >= submenuRect.width) {
                submenu.style.left = 'auto';

                submenu.style.right =
                    `${item.offsetWidth}px`;
            }

            /*
             * Not enough room on either side.
             * Use the side with more available space.
             */
            else if (spaceRight >= spaceLeft) {
                submenu.style.left =
                    `${item.offsetWidth}px`;

                submenu.style.right = 'auto';
            }

            else {
                submenu.style.left = 'auto';

                submenu.style.right =
                    `${item.offsetWidth}px`;
            }

            /*
             * Vertical positioning for nested submenus.
             *
             * Keep the submenu inside the viewport.
             */
            let positionedRect =
                submenu.getBoundingClientRect();

            if (positionedRect.bottom > viewportHeight) {
                const overflow =
                    positionedRect.bottom -
                    viewportHeight +
                    8;

                submenu.style.top =
                    `${-overflow}px`;
            }

            positionedRect =
                submenu.getBoundingClientRect();

            if (positionedRect.top < 0) {
                submenu.style.top =
                    `${Math.abs(
                        itemRect.top -
                        positionedRect.top
                    )}px`;
            }
        };

        const openSubmenu = (item) => {
            const submenu = getSubmenu(item);

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
                        if (sibling !== item) {
                            closeSubmenu(sibling);
                        }
                    });
            }

            item.classList.add('show');

            item.setAttribute(
                'aria-expanded',
                'true'
            );

            positionSubmenu(
                item,
                submenu
            );
        };

        const toggleSubmenu = (item) => {
            const submenu = getSubmenu(item);

            if (!submenu) {
                return;
            }

            if (item.classList.contains('show')) {
                closeSubmenu(item);
            } else {
                openSubmenu(item);
            }
        };

        barMenu.addEventListener('click', (event) => {
            const item =
                event.target.closest('.menu-item');

            if (
                !item ||
                !barMenu.contains(item)
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
        });

        barMenu.addEventListener('keydown', (event) => {

            /*
             * Keyboard shortcuts.
             *
             * Shortcuts work regardless of whether
             * the corresponding submenu is currently open.
             */
            const shortcutItems =
                barMenu.querySelectorAll(
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
                    item.classList.contains(
                        'disabled'
                    ) ||
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
                event.target.closest('.menu-item');

            if (
                !item ||
                !barMenu.contains(item)
            ) {
                return;
            }

            const submenu =
                getSubmenu(item);

            const parentMenu =
                item.parentElement;

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
                     * Root menu item with a submenu.
                     *
                     * ArrowDown enters the submenu and
                     * selects its first item.
                     */
                    if (parentMenu === rootMenu && submenu) {
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

                    /*
                     * Item inside a submenu.
                     *
                     * ArrowDown moves to the next item
                     * and wraps from the last item to
                     * the first item.
                     */
                    if (items.length > 0) {
                        const nextIndex =
                            (index + 1) % items.length;

                        focusItem(
                            items[nextIndex]
                        );
                    }

                    break;
                }

                case 'ArrowUp': {

                    event.preventDefault();

                    /*
                     * Root menu item with a submenu.
                     *
                     * ArrowUp enters the submenu and
                     * selects its last item.
                     */
                    if (parentMenu === rootMenu && submenu) {
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

                    /*
                     * Item inside a submenu.
                     *
                     * ArrowUp moves to the previous item
                     * and wraps from the first item to
                     * the last item.
                     */
                    if (items.length > 0) {
                        const previousIndex =
                            (
                                index - 1 +
                                items.length
                            ) % items.length;

                        focusItem(
                            items[previousIndex]
                        );
                    }

                    break;
                }

                case 'ArrowRight':

                    event.preventDefault();

                    if (parentMenu === rootMenu) {
                        const nextIndex =
                            (index + 1) %
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

                case 'ArrowLeft': {
                    const parentItem =
                        parentMenu.closest(
                            '.menu-item'
                        );

                    if (parentMenu === rootMenu) {
                        event.preventDefault();

                        const previousIndex =
                            (
                                index - 1 +
                                items.length
                            ) % items.length;

                        const previousItem =
                            items[previousIndex];

                        closeAll();

                        focusItem(previousItem);

                        const previousSubmenu =
                            getSubmenu(previousItem);

                        if (previousSubmenu) {
                            openSubmenu(
                                previousItem
                            );
                        }

                        break;
                    }

                    if (parentItem) {
                        event.preventDefault();

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
                case ' ':

                    if (submenu) {
                        event.preventDefault();

                        toggleSubmenu(item);
                    }

                    break;

                case 'Escape':

                    event.preventDefault();

                    closeAll();

                    focusItem(item);

                    break;
            }
        });

        document.addEventListener(
            'click',
            (event) => {
                if (!barMenu.contains(event.target)) {
                    closeAll();
                }
            }
        );

        const reposition = () => {
            barMenu
                .querySelectorAll(
                    '.menu-item.show > .menu'
                )
                .forEach((submenu) => {
                    const item =
                        submenu.parentElement;

                    if (item) {
                        positionSubmenu(
                            item,
                            submenu
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
    });
});
