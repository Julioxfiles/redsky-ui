/**
 * RedSky Spinner
 *
 * Provides visibility controls for Spinner components.
 */
class Spinner
{
    static initialize()
    {
        // Preserve the initial visibility state defined by the markup.
    }

    static show(spinner)
    {
        if (!this.isSpinner(spinner)) {
            return;
        }

        spinner.hidden = false;
    }

    static hide(spinner)
    {
        if (!this.isSpinner(spinner)) {
            return;
        }

        spinner.hidden = true;
    }

    static isSpinner(spinner)
    {
        return spinner instanceof HTMLElement &&
            spinner.matches(
                '[data-redsky-component="spinner"]'
            );
    }
}

window.Spinner = Spinner;

document.addEventListener('DOMContentLoaded', function () {
    Spinner.initialize();
});
