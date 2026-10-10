/**
 * Dropdown component.
 *
 * Provides dropdown open/close behavior,
 * keyboard navigation, and viewport-aware positioning.
 *
 * Responsibilities:
 *
 * - Toggle dropdown visibility.
 * - Update aria-expanded.
 * - Position the dropdown according to available viewport space.
 * - Close dropdown when clicking outside.
 * - Close dropdown when pressing Escape.
 * - Navigate items with ArrowUp and ArrowDown.
 * - Navigate to first and last items with Home and End.
 *
 * Styling is handled by CSS.
 *
 * @package RedSky\Html\Components\Interactive\Dropdown
 */

document.addEventListener('DOMContentLoaded', () => {
    const dropdowns = document.querySelectorAll(
        '[data-redsky-component="dropdown"]'
    );

    dropdowns.forEach((dropdown) => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        const menu = dropdown.querySelector('.dropdown-menu');

        if (!toggle || !menu) {
            return;
        }

        const getItems = () => {
            return Array.from(
                menu.querySelectorAll('.dropdown-item')
            ).filter((item) => {
                return !item.disabled &&
                    !item.classList.contains('disabled') &&
                    !item.hidden;
            });
        };

        const resetPosition = () => {
            menu.style.top = '';
            menu.style.bottom = '';
            menu.style.left = '';
            menu.style.right = '';
            menu.style.maxHeight = '';
            menu.style.overflowY = '';
        };

        const positionMenu = () => {
            resetPosition();

            const toggleRect = toggle.getBoundingClientRect();
            const menuRect = menu.getBoundingClientRect();

            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            const spaceBelow = viewportHeight - toggleRect.bottom;
            const spaceAbove = toggleRect.top;

            const spaceRight = viewportWidth - toggleRect.left;
            const spaceLeft = toggleRect.right;

            /*
             * Vertical positioning.
             *
             * Prefer below when there is enough space.
             * Otherwise use above when possible.
             */
            if (spaceBelow >= menuRect.height) {
                menu.style.top = `${toggle.offsetHeight}px`;
            } else if (spaceAbove >= menuRect.height) {
                menu.style.top = 'auto';
                menu.style.bottom = `${toggle.offsetHeight}px`;
            } else if (spaceBelow >= spaceAbove) {
                menu.style.top = `${toggle.offsetHeight}px`;
                menu.style.maxHeight = `${Math.max(spaceBelow - 8, 0)}px`;
                menu.style.overflowY = 'auto';
            } else {
                menu.style.top = 'auto';
                menu.style.bottom = `${toggle.offsetHeight}px`;
                menu.style.maxHeight = `${Math.max(spaceAbove - 8, 0)}px`;
                menu.style.overflowY = 'auto';
            }

            /*
             * Horizontal positioning.
             *
             * Prefer left alignment.
             */
            if (toggleRect.left + menuRect.width <= viewportWidth) {
                menu.style.left = '0';
                menu.style.right = 'auto';

                return;
            }

            /*
             * Align to the right edge of the dropdown.
             */
            if (toggleRect.right - menuRect.width >= 0) {
                menu.style.left = 'auto';
                menu.style.right = '0';

                return;
            }

            /*
             * Menu is wider than the available space.
             * Keep it inside the viewport as much as possible.
             */
            if (spaceRight >= spaceLeft) {
                menu.style.left = '0';
                menu.style.right = 'auto';
            } else {
                menu.style.left = 'auto';
                menu.style.right = '0';
            }
        };

        const open = () => {
            dropdown.classList.add('show');
            toggle.setAttribute('aria-expanded', 'true');

            positionMenu();
        };

        const close = () => {
            dropdown.classList.remove('show');
            toggle.setAttribute('aria-expanded', 'false');

            resetPosition();
        };

        const focusItem = (index) => {
            const items = getItems();

            if (items.length === 0) {
                return;
            }

            const normalizedIndex =
                (index + items.length) % items.length;

            items[normalizedIndex].focus();
        };

        const focusFirst = () => {
            focusItem(0);
        };

        const focusLast = () => {
            const items = getItems();

            focusItem(items.length - 1);
        };

        const focusNext = () => {
            const items = getItems();

            if (items.length === 0) {
                return;
            }

            const currentIndex =
                items.indexOf(document.activeElement);

            focusItem(currentIndex + 1);
        };

        const focusPrevious = () => {
            const items = getItems();

            if (items.length === 0) {
                return;
            }

            const currentIndex =
                items.indexOf(document.activeElement);

            if (currentIndex === -1) {
                focusLast();
                return;
            }

            focusItem(currentIndex - 1);
        };

        const toggleDropdown = (event) => {
            event.stopPropagation();

            if (dropdown.classList.contains('show')) {
                close();
                return;
            }

            open();
        };

        toggle.addEventListener('click', toggleDropdown);

        toggle.addEventListener('keydown', (event) => {
            switch (event.key) {
                case 'ArrowDown':
                    event.preventDefault();

                    open();
                    focusFirst();

                    break;

                case 'ArrowUp':
                    event.preventDefault();

                    open();
                    focusLast();

                    break;

                case 'Escape':
                    event.preventDefault();

                    close();

                    break;
            }
        });

        dropdown.addEventListener('keydown', (event) => {
            if (!dropdown.classList.contains('show')) {
                return;
            }

            switch (event.key) {
                case 'ArrowDown':
                    event.preventDefault();

                    focusNext();

                    break;

                case 'ArrowUp':
                    event.preventDefault();

                    focusPrevious();

                    break;

                case 'Home':
                    event.preventDefault();

                    focusFirst();

                    break;

                case 'End':
                    event.preventDefault();

                    focusLast();

                    break;

                case 'Escape':
                    event.preventDefault();

                    close();
                    toggle.focus();

                    break;
            }
        });

        document.addEventListener('click', (event) => {
            if (!dropdown.contains(event.target)) {
                close();
            }
        });

        window.addEventListener('resize', () => {
            if (dropdown.classList.contains('show')) {
                positionMenu();
            }
        });

        window.addEventListener(
            'scroll',
            () => {
                if (dropdown.classList.contains('show')) {
                    positionMenu();
                }
            },
            true
        );
    });
});