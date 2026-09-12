/**
 * RedSky Modal Content
 *
 * Content management for RedSky Modal instances.
 *
 * No jQuery dependency.
 */

import { ModalSecurity } from './ModalSecurity.js';

export class ModalContent {

    constructor(modal) {

        this.modal = modal;
    }

    setText(text) {

        const bodyElement =
            this.modal.bodyElement;

        if (!bodyElement) {

            return this.modal;
        }

        bodyElement.textContent =
            String(text ?? '');

        this.modal.emit(
            'contentChange',
            bodyElement
        );

        return this.modal;
    }

    setHTML(html) {

        const bodyElement =
            this.modal.bodyElement;

        if (!bodyElement) {

            return this.modal;
        }

        bodyElement.innerHTML =
            ModalSecurity.sanitizeHTML(
                String(html ?? '')
            );

        this.modal.emit(
            'contentChange',
            bodyElement
        );

        return this.modal;
    }

    setTitle(title) {

        if (!this.modal.titleElement) {

            const titleElement =
                document.createElement(
                    'h2'
                );

            titleElement.setAttribute(
                'data-modal-title',
                ''
            );

            this.modal.titleElement =
                titleElement;

            if (!this.modal.header) {

                this.modal.header =
                    document.createElement(
                        'div'
                    );

                this.modal.header.setAttribute(
                    'data-modal-header',
                    ''
                );

                this.modal.header.classList.add(
                    'redsky-modal-header'
                );

                this.modal.header.setAttribute(
                    'data-modal-drag-handle',
                    ''
                );

                this.modal.header.style.touchAction =
                    'none';

                this.modal.header.style.cursor =
                    'move';

                this.modal.dialog.prepend(
                    this.modal.header
                );

                if (
                    this.modal.options.drag
                ) {

                    this.modal.header.addEventListener(
                        'pointerdown',
                        this.modal.boundHandlers.pointerDown
                    );

                    this.modal.header.addEventListener(
                        'pointermove',
                        this.modal.boundHandlers.pointerMove
                    );

                    this.modal.header.addEventListener(
                        'pointerup',
                        this.modal.boundHandlers.pointerUp
                    );

                    this.modal.header.addEventListener(
                        'pointercancel',
                        this.modal.boundHandlers.pointerUp
                    );
                }
            }

            this.modal.header.prepend(
                titleElement
            );
        }

        this.modal.titleElement.textContent =
            String(title ?? '');

        this.modal.updateAria();

        this.modal.emit(
            'contentChange',
            this.modal.titleElement
        );

        return this.modal;
    }
}
