/**
 * RedSky Modal Focus
 *
 * Focus management and focus trapping for RedSky Modal.
 *
 * No jQuery dependency.
 */

export class ModalFocus {

    constructor(modal) {

        this.modal = modal;
    }

    focusInitialElement() {

        if (!this.modal.isOpen()) {

            return;
        }

        const focusable =
            this.getFocusableElements();

        if (
            focusable.length > 0
        ) {

            focusable[0].focus();

            this.modal.emit(
                'focus',
                focusable[0]
            );

            return;
        }

        this.modal.dialog.setAttribute(
            'tabindex',
            '-1'
        );

        this.modal.dialog.focus();

        this.modal.emit(
            'focus',
            this.modal.dialog
        );
    }

    restorePreviousFocus() {

        if (
            !this.modal.options.restoreFocus
        ) {

            return;
        }

        if (
            !this.modal.previousActiveElement
        ) {

            return;
        }

        if (
            !document.body.contains(
                this.modal.previousActiveElement
            )
        ) {

            return;
        }

        if (
            typeof this.modal.previousActiveElement.focus !==
            'function'
        ) {

            return;
        }

        this.modal.previousActiveElement.focus();

        this.modal.emit(
            'focusRestore',
            this.modal.previousActiveElement
        );
    }

    trapFocus(event) {

        const focusable =
            this.getFocusableElements();

        if (
            focusable.length === 0
        ) {

            event.preventDefault();

            this.modal.dialog.focus();

            return;
        }

        const first =
            focusable[0];

        const last =
            focusable[
                focusable.length - 1
            ];

        if (
            event.shiftKey &&
            document.activeElement === first
        ) {

            event.preventDefault();

            last.focus();

            return;
        }

        if (
            !event.shiftKey &&
            document.activeElement === last
        ) {

            event.preventDefault();

            first.focus();
        }
    }

    getFocusableElements() {

        return Array.from(
            this.modal.dialog.querySelectorAll(
                [
                    'a[href]',
                    'area[href]',
                    'button:not([disabled])',
                    'input:not([disabled])',
                    'select:not([disabled])',
                    'textarea:not([disabled])',
                    'iframe',
                    'object',
                    'embed',
                    '[contenteditable="true"]',
                    '[tabindex]:not([tabindex="-1"])'
                ].join(',')
            )
        ).filter(
            (element) => {

                const style =
                    window.getComputedStyle(
                        element
                    );

                return (
                    style.display !==
                    'none' &&
                    style.visibility !==
                    'hidden' &&
                    !element.hasAttribute(
                        'inert'
                    )
                );
            }
        );
    }

    handleKeydown(event) {

        if (
            !this.modal.isOpen()
        ) {

            return;
        }

        if (
            event.key === 'Escape' &&
            this.modal.options.closeOnEscape
        ) {

            event.preventDefault();

            this.modal.emit(
                'escape',
                event
            );

            this.modal.close();

            return;
        }

        if (
            event.key === 'Tab' &&
            this.modal.options.trapFocus
        ) {

            this.trapFocus(event);
        }
    }
}
