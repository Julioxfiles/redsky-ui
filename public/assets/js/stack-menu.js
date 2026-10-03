import {
    getSubmenu,
    getMenuItems
} from './stack-menu-utils.js';


import {
    enableKeyboardNavigation
} from './stack-menu-keyboard.js';



/**
 * Stack Menu Component
 *
 * Handles dynamic navigation between menu levels.
 *
 * @module StackMenu
 */


class StackMenuController {


    constructor(element) {

        this.element = element;


        this.root = element.querySelector(
            '.stack-menu-root'
        );


        this.source = element.querySelector(
            '.stack-menu-source'
        );


        this.history = [];


        this.currentMenu =
            this.source?.querySelector(
                ':scope > .menu'
            );


        if (
            !this.root ||
            !this.currentMenu
        ) {

            console.error(
                'StackMenu: invalid structure'
            );

            return;

        }


        this.initialize();

    }



    initialize() {

        this.render();

        this.bindEvents();

        enableKeyboardNavigation(
            this
        );

    }



    render() {

        this.root.innerHTML = '';


        const menu =
            document.createElement('ul');


        menu.classList.add(
            'menu'
        );


        if (
            this.history.length > 0
        ) {

            menu.appendChild(
                this.createBackItem()
            );

        }


        getMenuItems(
            this.currentMenu
        )
        .forEach(
            (item) => {

                menu.appendChild(
                    this.createItem(item)
                );

            }
        );


        this.root.appendChild(
            menu
        );


        this.focusFirstItem();

    }



    createItem(sourceItem) {

        const item =
            sourceItem.cloneNode(true);


        const submenu =
            item.querySelector(
                ':scope > .menu'
            );


        if (submenu) {

            submenu.remove();

        }


        item._sourceItem =
            sourceItem;


        item.setAttribute(
            'tabindex',
            '-1'
        );


        return item;

    }



    createBackItem() {

        const item =
            document.createElement('li');


        item.classList.add(
            'menu-item',
            'menu-back'
        );


        item.textContent =
            '← Back';


        item.setAttribute(
            'tabindex',
            '-1'
        );


        return item;

    }



    bindEvents() {

        this.root.addEventListener(
            'click',
            (event) => {

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

                    this.goBack();

                    return;

                }


                const submenu =
                    getSubmenu(item);


                if (submenu) {

                    this.enterSubmenu(
                        item
                    );

                    return;

                }


                this.executeAction(
                    item
                );

            }
        );

    }



    enterSubmenu(item) {

        const submenu =
            getSubmenu(item);


        if (!submenu) {
            return;
        }


        this.history.push(
            this.currentMenu
        );


        this.currentMenu =
            submenu;


        this.render();

    }



    goBack() {

        if (
            this.history.length === 0
        ) {
            return;
        }


        this.currentMenu =
            this.history.pop();


        this.render();

    }



    executeAction(item) {

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


        const onclick =
            sourceItem.dataset.menuOnclick;


        if (onclick) {

            Function(onclick)();

        }

    }



    focusFirstItem() {

        const items =
            this.root.querySelectorAll(
                ':scope > .menu > .menu-item'
            );


        if (
            items.length
        ) {

            items[0].setAttribute(
                'tabindex',
                '0'
            );


            items[0].focus();

        }

    }

}



document.addEventListener(
    'DOMContentLoaded',
    () => {

        document
            .querySelectorAll(
                '[data-redsky-component="stack-menu"]'
            )
            .forEach(
                (element) => {

                    new StackMenuController(
                        element
                    );

                }
            );

    }
);