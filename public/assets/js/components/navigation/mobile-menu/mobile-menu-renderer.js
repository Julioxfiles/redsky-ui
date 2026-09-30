import {
    getMenuItems
} from './mobile-menu-utils.js';



export function renderMenu(
    controller,
    menu
) {

    console.log('renderMenu ejecutado', menu);
    
    const root =
        controller.root;


    root.innerHTML = '';



    const container =
        document.createElement(
            'ul'
        );


    container.classList.add(
        'menu'
    );



    if (
        controller.history.length > 0
    ) {

        const back =
            document.createElement(
                'li'
            );


        back.classList.add(
            'menu-item',
            'menu-back'
        );


        back.textContent =
            '← Back';


        back.setAttribute(
            'tabindex',
            '-1'
        );


        container.appendChild(
            back
        );

    }



    getMenuItems(menu)
        .forEach(
            (sourceItem) => {

                container.appendChild(
                    createVisibleItem(
                        sourceItem
                    )
                );

            }
        );



    root.appendChild(
        container
    );


    focusFirstItem(
        controller
    );

}



function createVisibleItem(
    sourceItem
) {


    const item =
        sourceItem.cloneNode(
            true
        );



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



function focusFirstItem(
    controller
) {


    const items =
        controller.root.querySelectorAll(
            ':scope > .menu > .menu-item'
        );



    if (
        items.length > 0
    ) {

        items[0].setAttribute(
            'tabindex',
            '0'
        );


        items[0].focus();

    }

}