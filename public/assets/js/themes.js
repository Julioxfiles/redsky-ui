/**
 * RedSky UI Theme Switcher
 *
 * Changes between light and dark themes.
 * The selected theme is stored in localStorage.
 */

document.addEventListener(
    'DOMContentLoaded',
    () => {

        const button = document.getElementById(
            'theme-toggle'
        );


        if (!button) {
            return;
        }


        const html = document.documentElement;


        /*
         * Load saved theme
         */

        const savedTheme = localStorage.getItem(
            'theme'
        );


        if (savedTheme === 'dark') {

            html.classList.add('dark');

        } else if (savedTheme === 'light') {

            html.classList.remove('dark');

        }


        updateButton();


        /*
         * Toggle theme
         */

        button.addEventListener(
            'click',
            () => {

                html.classList.toggle('dark');


                const theme =
                    html.classList.contains('dark')
                        ? 'dark'
                        : 'light';


                localStorage.setItem(
                    'theme',
                    theme
                );


                updateButton();

            }
        );


        /*
         * Update button text
         */

        function updateButton()
        {

            if (
                html.classList.contains('dark')
            ) {

                button.textContent = 'Light';

            } else {

                button.textContent = 'Dark';

            }

        }

    }
);