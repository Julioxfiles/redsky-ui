import {
    enterSubmenu,
    goBack
} from './mobile-menu-navigation.js';


import {
    hasSubmenu
} from './mobile-menu-utils.js';



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


                        enterSubmenu(
                            controller,
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


                        goBack(
                            controller
                        );

                    }

                    break;

            }


        }
    );

}