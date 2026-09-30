import {
    renderMenu
} from './mobile-menu-renderer.js';


import {
    enterSubmenu,
    goBack
} from './mobile-menu-navigation.js';


import {
    enableKeyboardNavigation
} from './mobile-menu-keyboard.js';


import {
    getSubmenu
} from './mobile-menu-utils.js';



export class MobileMenuController {


    constructor(
        element
    ) {

        this.element =
            element;


        this.root =
            element.querySelector(
                '.mobile-menu-root'
            );


        this.source =
            element.querySelector(
                '.mobile-menu-source'
            );


        this.history = [];


        this.currentMenu =
            this.source?.querySelector(
                ':scope > .menu'
            );


        if (
            !this.root ||
            !this.source ||
            !this.currentMenu
        ) {

            console.error(
                'MobileMenu: invalid structure'
            );

            return;

        }


        this.initialize();

    }



    initialize()
    {

        renderMenu(
            this,
            this.currentMenu
        );


        enableKeyboardNavigation(
            this
        );


        this.enableClickEvents();

    }



    enableClickEvents()
    {

        this.root.addEventListener(
            'click',
            (event) => {


                /*
                 * Allow internal components
                 * to keep their own behavior.
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



                if (
                    item.classList.contains(
                        'menu-back'
                    )
                ) {

                    goBack(
                        this
                    );

                    return;

                }



                const submenu =
                    getSubmenu(
                        item
                    );


                if (submenu) {

                    event.preventDefault();


                    enterSubmenu(
                        this,
                        item
                    );


                    return;

                }



                const sourceItem =
                    item._sourceItem;


                if (!sourceItem) {
                    return;
                }



                const href =
                    sourceItem.dataset.menuHref;


                if (href) {

                    window.location.href =
                        href;

                    return;

                }



                const action =
                    sourceItem.dataset.menuOnclick;


                if (action) {

                    Function(
                        action
                    )();

                }


            }
        );

    }

}