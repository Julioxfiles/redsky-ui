/**
 * RedSky Modal
 *
 * Public RedSky Modal API.
 *
 * Coordinates:
 *
 * - ModalManager
 * - ModalInstance
 *
 * No jQuery dependency.
 */

import { ModalManager } from './ModalManager.js';
import { ModalInstance } from './ModalInstance.js';


class RedSkyModalAPI {

    constructor() {

        this.manager =
            new ModalManager();

        this.initialized =
            false;

        this.triggerHandler =
            this.handleTriggerClick.bind(
                this
            );

        this.triggerEventsBound =
            false;
    }


    init(root = document) {

        if (!root) {
            return this;
        }

        const elements =
            root.querySelectorAll(
                '[data-redsky-component="modal"]'
            );

        elements.forEach(
            (element) => {

                this.registerElement(
                    element
                );
            }
        );

        this.bindTriggerEvents();

        this.initialized =
            true;

        return this;
    }


    registerElement(element) {

        if (
            !(element instanceof HTMLElement)
        ) {

            throw new TypeError(
                'RedSkyModal: Invalid modal element.'
            );
        }

        const existing =
            this.manager.get(
                element
            );

        if (existing) {
            return existing;
        }

        return this.manager.register(
            element
        );
    }


    bindTriggerEvents() {

        if (
            this.triggerEventsBound
        ) {

            return this;
        }

        document.addEventListener(
            'click',
            this.triggerHandler
        );

        this.triggerEventsBound =
            true;

        return this;
    }


    unbindTriggerEvents() {

        if (
            !this.triggerEventsBound
        ) {

            return this;
        }

        document.removeEventListener(
            'click',
            this.triggerHandler
        );

        this.triggerEventsBound =
            false;

        return this;
    }


    handleTriggerClick(event) {

        if (
            event.defaultPrevented
        ) {

            return;
        }

        const trigger =
            event.target instanceof Element
                ? event.target.closest(
                    '[data-modal-target]'
                )
                : null;

        if (!trigger) {
            return;
        }

        if (
            trigger.closest(
                '[data-redsky-component="modal"]'
            )
        ) {

            return;
        }

        const target =
            trigger.getAttribute(
                'data-modal-target'
            );

        if (
            target === null ||
            target.trim() === ''
        ) {

            return;
        }

        const modal =
            this.getModalFromTarget(
                target
            );

        if (!modal) {
            return;
        }

        event.preventDefault();

        modal.open();
    }


    getModalFromTarget(target) {

        const normalizedTarget =
            target.trim();

        const id =
            normalizedTarget.startsWith('#')
                ? normalizedTarget.substring(1)
                : normalizedTarget;

        if (
            id === ''
        ) {

            return null;
        }

        const modal =
            this.get(
                id
            );

        if (modal) {
            return modal;
        }

        const element =
            document.getElementById(
                id
            );

        if (!element) {
            return null;
        }

        if (
            !element.matches(
                '[data-redsky-component="modal"]'
            )
        ) {

            return null;
        }

        return this.registerElement(
            element
        );
    }


    get(id) {

        if (
            id instanceof ModalInstance
        ) {

            return id;
        }

        return this.manager.get(
            id
        );
    }


    create(options = {}) {

        return this.manager.create(
            options
        );
    }


    alert(
        message,
        options = {}
    ) {

        const modal =
            this.create({

                ...options,

                title:
                    options.title ??
                    'Alert',

                content:
                    message,

                showCloseButton:
                    options.showCloseButton !==
                    false
            });

        const closeButton =
            document.createElement(
                'button'
            );

        closeButton.type =
            'button';

        closeButton.textContent =
            options.closeText ??
            'OK';

        closeButton.addEventListener(
            'click',
            () => modal.close()
        );

        modal.addChild(
            closeButton
        );

        if (
            options.open !== false
        ) {

            modal.open();
        }

        return modal;
    }


    confirm(
        message,
        options = {}
    ) {

        const modal =
            this.create({

                ...options,

                title:
                    options.title ??
                    'Confirm',

                content:
                    message
            });

        return new Promise(
            (resolve) => {

                let settled =
                    false;

                const finish =
                    (result) => {

                        if (
                            settled
                        ) {

                            return;
                        }

                        settled =
                            true;

                        modal.close();

                        resolve(
                            result
                        );
                    };

                const cancelButton =
                    document.createElement(
                        'button'
                    );

                cancelButton.type =
                    'button';

                cancelButton.textContent =
                    options.cancelText ??
                    'Cancel';

                const confirmButton =
                    document.createElement(
                        'button'
                    );

                confirmButton.type =
                    'button';

                confirmButton.textContent =
                    options.confirmText ??
                    'Confirm';

                cancelButton.addEventListener(
                    'click',
                    () => finish(false)
                );

                confirmButton.addEventListener(
                    'click',
                    () => finish(true)
                );

                modal.addChild(
                    cancelButton
                );

                modal.addChild(
                    confirmButton
                );

                modal.once(
                    'afterClose',
                    () => {

                        if (
                            !settled
                        ) {

                            settled =
                                true;

                            resolve(
                                false
                            );
                        }
                    }
                );

                modal.open();
            }
        );
    }


    prompt(
        message,
        options = {}
    ) {

        const modal =
            this.create({

                ...options,

                title:
                    options.title ??
                    'Input'
            });

        const label =
            document.createElement(
                'label'
            );

        label.textContent =
            String(
                message
            );

        const input =
            document.createElement(
                'input'
            );

        input.type =
            options.inputType ??
            'text';

        input.value =
            options.value ??
            '';

        if (
            options.name !== undefined
        ) {

            input.name =
                String(
                    options.name
                );
        }

        if (
            options.placeholder !==
            undefined
        ) {

            input.placeholder =
                String(
                    options.placeholder
                );
        }

        if (
            options.inputClass !==
            undefined
        ) {

            input.className =
                String(
                    options.inputClass
                );
        }

        modal.append(
            label
        );

        modal.append(
            input
        );

        return new Promise(
            (resolve) => {

                let settled =
                    false;

                const finish =
                    (value) => {

                        if (
                            settled
                        ) {

                            return;
                        }

                        settled =
                            true;

                        modal.close();

                        resolve(
                            value
                        );
                    };

                const cancelButton =
                    document.createElement(
                        'button'
                    );

                cancelButton.type =
                    'button';

                cancelButton.textContent =
                    options.cancelText ??
                    'Cancel';

                const submitButton =
                    document.createElement(
                        'button'
                    );

                submitButton.type =
                    'button';

                submitButton.textContent =
                    options.submitText ??
                    'OK';

                cancelButton.addEventListener(
                    'click',
                    () => finish(null)
                );

                submitButton.addEventListener(
                    'click',
                    () => finish(
                        input.value
                    )
                );

                modal.addChild(
                    cancelButton
                );

                modal.addChild(
                    submitButton
                );

                modal.once(
                    'afterClose',
                    () => {

                        if (
                            !settled
                        ) {

                            settled =
                                true;

                            resolve(
                                null
                            );
                        }
                    }
                );

                modal.open();

                requestAnimationFrame(
                    () => {

                        if (
                            modal.isOpen()
                        ) {

                            input.focus();
                        }
                    }
                );
            }
        );
    }


    open(modal) {

        const instance =
            this.resolve(
                modal
            );

        if (!instance) {

            throw new Error(
                'RedSkyModal: Modal instance not found.'
            );
        }

        return instance.open();
    }


    close(modal) {

        const instance =
            this.resolve(
                modal
            );

        if (!instance) {
            return null;
        }

        return instance.close();
    }


    toggle(modal) {

        const instance =
            this.resolve(
                modal
            );

        if (!instance) {
            return null;
        }

        return instance.toggle();
    }


    destroy(modal) {

        const instance =
            this.resolve(
                modal
            );

        if (!instance) {
            return null;
        }

        instance.destroy();

        return null;
    }


    active() {

        return this.manager.active();
    }


    closeActive() {

        return this.manager.closeActive();
    }


    closeAll() {

        return this.manager.closeAll();
    }


    all() {

        return this.manager.all();
    }


    resolve(modal) {

        if (
            modal instanceof ModalInstance
        ) {

            return modal;
        }

        return this.get(
            modal
        );
    }
}


const RedSkyModal =
    new RedSkyModalAPI();


if (
    typeof window !==
    'undefined'
) {

    window.RedSkyModal =
        RedSkyModal;

    if (
        document.readyState ===
        'loading'
    ) {

        document.addEventListener(
            'DOMContentLoaded',
            () => {

                RedSkyModal.init();
            },
            {
                once: true
            }
        );

    } else {

        RedSkyModal.init();
    }
}


export default RedSkyModal;