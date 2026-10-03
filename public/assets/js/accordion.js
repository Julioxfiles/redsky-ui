/**
 * Accordion component.
 *
 * Provides accordion expand/collapse behavior.
 *
 * Responsibilities:
 *
 * - Detect accordion components.
 * - Detect accordion toggle buttons.
 * - Show and hide accordion panels.
 * - Update accessibility attributes.
 * - Support single or multiple open items.
 *
 * Styling is handled by CSS.
 */

document.addEventListener('DOMContentLoaded', () => {

    const accordions = document.querySelectorAll(
        '[data-component="accordion"]'
    );

    accordions.forEach((accordion) => {

        const multiple =
            accordion.dataset.multiple === 'true';

        const toggles = accordion.querySelectorAll(
            '[data-accordion-toggle]'
        );

        toggles.forEach((toggle) => {

            toggle.addEventListener('click', () => {

                const panelId =
                    toggle.getAttribute('aria-controls');

                if (!panelId) {
                    return;
                }

                const panel =
                    document.getElementById(panelId);

                if (!panel) {
                    return;
                }

                const isOpen =
                    toggle.getAttribute('aria-expanded') === 'true';

                if (!multiple) {

                    toggles.forEach((otherToggle) => {

                        if (otherToggle === toggle) {
                            return;
                        }

                        const otherPanelId =
                            otherToggle.getAttribute(
                                'aria-controls'
                            );

                        if (!otherPanelId) {
                            return;
                        }

                        const otherPanel =
                            document.getElementById(
                                otherPanelId
                            );

                        if (!otherPanel) {
                            return;
                        }

                        otherToggle.setAttribute(
                            'aria-expanded',
                            'false'
                        );

                        otherToggle.classList.add(
                            'collapsed'
                        );

                        otherPanel.classList.add(
                            'collapsed'
                        );

                        otherPanel.setAttribute(
                            'aria-hidden',
                            'true'
                        );
                    });
                }

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
});