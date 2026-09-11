/**
 * Tabs Component
 *
 * Provides tab navigation behavior.
 *
 * Responsibilities:
 *
 * - Detect tab buttons.
 * - Activate selected tab.
 * - Show related panel.
 *
 * Styling is handled by CSS.
 */


class Tabs {


    constructor(element) {

        this.element = element;

        this.tabs = Array.from(
            element.querySelectorAll('[data-tab-target]')
        );


        this.panels = Array.from(
            element.querySelectorAll('[data-tab-panel]')
        );


        this.bind();

    }



    bind() {

        this.tabs.forEach(tab => {

            tab.addEventListener(
                'click',
                () => {

                    this.activate(tab);

                }
            );

        });

    }



    activate(tab) {


        const target = tab.dataset.tabTarget;


        if (!target) {
            return;
        }



        this.tabs.forEach(item => {

            const active =
                item === tab;


            item.classList.toggle(
                'active',
                active
            );


            item.setAttribute(
                'aria-selected',
                active
                    ? 'true'
                    : 'false'
            );

        });



        this.panels.forEach(panel => {

            const active =
                panel.id === target;


            panel.classList.toggle(
                'active',
                active
            );


            if (active) {

                panel.removeAttribute(
                    'hidden'
                );

            } else {

                panel.setAttribute(
                    'hidden',
                    ''
                );

            }

        });

    }



    static init() {

        document
            .querySelectorAll('[data-component="tabs"]')
            .forEach(element => {

                new Tabs(element);

            });

    }

}



document.addEventListener(
    'DOMContentLoaded',
    () => {

        Tabs.init();

    }
);