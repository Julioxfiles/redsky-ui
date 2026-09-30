import {
    MobileMenuController
} from './mobile-menu-controller.js';


document.addEventListener(
    'DOMContentLoaded',
    () => {

        document
            .querySelectorAll(
                '[data-redsky-component="mobile-menu"]'
            )
            .forEach(
                (element) => {

                    new MobileMenuController(
                        element
                    );

                }
            );

    }
);