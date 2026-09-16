/**
 * Collapse component.
 *
 * Provides expand/collapse behavior for content panels.
 *
 * Responsibilities:
 *
 * - Detect collapse components.
 * - Detect collapse toggle buttons.
 * - Show and hide collapse panels.
 * - Update accessibility attributes.
 *
 * Styling is handled by CSS.
 */

document.addEventListener('DOMContentLoaded', () => {

    const collapses = document.querySelectorAll(
        '[data-component="collapse"]'
    );

    collapses.forEach((collapse) => {

        const toggle = collapse.querySelector(
            '[data-collapse-toggle]'
        );

        const panel = collapse.querySelector(
            '[data-collapse-content]'
        );

        if (!toggle || !panel) {
            return;
        }

        toggle.addEventListener('click', () => {

            const isOpen =
                toggle.getAttribute('aria-expanded') === 'true';

            const newState = !isOpen;

            toggle.setAttribute(
                'aria-expanded',
                newState ? 'true' : 'false'
            );

            toggle.classList.toggle(
                'collapsed',
                !newState
            );

            panel.classList.toggle(
                'collapsed',
                !newState
            );

            panel.setAttribute(
                'aria-hidden',
                newState ? 'false' : 'true'
            );
        });
    });
});
