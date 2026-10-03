/**
 * menu-bar component
 *
 * Entry point.
 *
 * Bootstrap-compatible naming without a Bootstrap dependency.
 */

import {
    initMenuBar
} from './menu-bar-core.js';


document.addEventListener(
    'DOMContentLoaded',
    () => {

        document
            .querySelectorAll('.menu-bar')
            .forEach((menuBar) => {

                initMenuBar(menuBar);

            });

    }
);