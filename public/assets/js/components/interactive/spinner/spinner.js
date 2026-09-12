/**
 * RedSky Spinner
 *
 * Provides visibility controls for Spinner components.
 */
class Spinner
{
    static initialize()
    {
        const spinners = document.querySelectorAll(
            '[data-redsky-component="spinner"]'
        );

        spinners.forEach(spinner => {
            spinner.hidden = false;
        });
    }

    static show(spinner)
    {
        if (!spinner) {
            return;
        }

        spinner.hidden = false;
    }

    static hide(spinner)
    {
        if (!spinner) {
            return;
        }

        spinner.hidden = true;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    Spinner.initialize();
});