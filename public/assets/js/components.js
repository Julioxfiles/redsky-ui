
document.addEventListener('DOMContentLoaded', function () {


    /*
     * Accordion
     */

    document
        .querySelectorAll('.category-header')
        .forEach(function (header) {


            header.addEventListener('click', function () {


                const content = header.nextElementSibling;

                const isOpen =
                    header.getAttribute('aria-expanded') === 'true';


                header.setAttribute(
                    'aria-expanded',
                    String(!isOpen)
                );


                content.classList.toggle(
                    'open',
                    !isOpen
                );


            });

        });


    /*
     * Component search
     */

    const searchInput =
        document.getElementById('component-search');


    if (!searchInput) {
        return;
    }


    searchInput.addEventListener('input', function () {


        const search =
            searchInput.value
                .toLowerCase()
                .trim();


        document
            .querySelectorAll('.component-category')
            .forEach(function (category) {


                const components =
                    category.querySelectorAll('.component-item');


                let visibleComponents = 0;


                components.forEach(function (component) {


                    const name =
                        component
                            .querySelector('h5')
                            .textContent
                            .toLowerCase()
                            .trim();


                    const matches =
                        name.includes(search);


                    component.style.display =
                        matches ? '' : '';


                    if (!matches) {
                        component.style.display = 'none';
                    }


                    if (matches) {
                        visibleComponents++;
                    }


                });


                category.style.display =
                    visibleComponents > 0
                        ? ''
                        : 'none';


                /*
                 * When searching, automatically open
                 * categories containing a match.
                 */

                if (search !== '' && visibleComponents > 0) {

                    const header =
                        category.querySelector('.category-header');

                    const content =
                        category.querySelector('.category-content');


                    header.setAttribute(
                        'aria-expanded',
                        'true'
                    );


                    content.classList.add('open');

                }


            });


    });


});