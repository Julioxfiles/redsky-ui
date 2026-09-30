/**
 * Stack Menu Keyboard Navigation
 *
 * Provides keyboard navigation support for StackMenu.
 *
 * Handles:
 * - ArrowDown / ArrowUp navigation between menu items.
 * - Enter / ArrowRight to open submenus.
 * - ArrowLeft / Escape to return to the previous menu level.
 *
 * This module only manages keyboard interaction.
 * Menu rendering and navigation state remain handled
 * by the StackMenu controller.
 *
 * @module StackMenuKeyboard
 */

import {
    hasSubmenu
} from './stack-menu-utils.js';


export function enableKeyboardNavigation(
    controller
) {

    controller.root.addEventListener(
        'keydown',
        (event) => {


            const items =
                controller.root.querySelectorAll(
                    ':scope > .menu > .menu-item'
                );


            const active =
                document.activeElement;


            const index =
                Array.from(
                    items
                )
                .indexOf(
                    active
                );


            switch (
                event.key
            ) {


                case 'ArrowDown':

                    event.preventDefault();


                    if (items.length) {

                        items[
                            (index + 1)
                            %
                            items.length
                        ].focus();

                    }

                    break;



                case 'ArrowUp':

                    event.preventDefault();


                    if (items.length) {

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
                        hasSubmenu(active)
                    ) {

                        event.preventDefault();


                        controller.enterSubmenu(
                            active
                        );

                    }

                    break;



                case 'ArrowLeft':
                case 'Escape':

                    if (
                        controller.history.length
                    ) {

                        event.preventDefault();


                        controller.goBack();

                    }

                    break;

            }


        }
    );

}