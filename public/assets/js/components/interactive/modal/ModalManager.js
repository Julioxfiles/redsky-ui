/**
 * RedSky Modal Manager
 *
 * Manages RedSky Modal instances, registration, lookup,
 * creation, stacking, body scroll locking, and active
 * modal state.
 *
 * No jQuery dependency.
 */

import { ModalInstance } from './ModalInstance.js';


export class ModalManager {

    constructor() {

        this.instances =
            new Map();

        this.stack =
            [];

        this.sequence =
            0;

        this.bodyLockCount =
            0;

        this.bodyOriginalOverflow =
            null;

        this.bodyOriginalPaddingRight =
            null;
    }


    initialize() {

        const elements =
            document.querySelectorAll(
                '[data-redsky-component="modal"]'
            );

        elements.forEach(
            (element) => {

                if (
                    !this.instances.has(
                        element
                    )
                ) {

                    this.register(
                        element
                    );
                }
            }
        );

        return this;
    }


    register(
        element,
        options = {}
    ) {

        if (
            !(element instanceof Element)
        ) {

            throw new TypeError(
                'RedSkyModal: Modal element must be a DOM Element.'
            );
        }

        if (
            this.instances.has(
                element
            )
        ) {

            return this.instances.get(
                element
            );
        }

        const instance =
            new ModalInstance(
                element,
                options,
                this
            );

        this.instances.set(
            element,
            instance
        );

        return instance;
    }


    unregister(instance) {

        if (!instance) {
            return this;
        }

        this.removeFromStack(
            instance
        );

        if (
            instance._bodyLockApplied
        ) {

            this.unlockBody();

            instance._bodyLockApplied =
                false;
        }

        const element =
            instance.element;

        if (
            element &&
            this.instances.get(element) ===
                instance
        ) {

            this.instances.delete(
                element
            );
        }

        return this;
    }


    create(options = {}) {

        const element =
            document.createElement(
                'div'
            );

        element.setAttribute(
            'data-redsky-component',
            'modal'
        );

        element.setAttribute(
            'role',
            'dialog'
        );

        element.setAttribute(
            'aria-modal',
            'true'
        );

        element.setAttribute(
            'hidden',
            ''
        );

        const id =
            options.id ||
            this.createId();

        element.id =
            id;

        this.applyOptionsAttributes(
            element,
            options
        );

        const backdrop =
            document.createElement(
                'div'
            );

        backdrop.setAttribute(
            'data-modal-backdrop',
            ''
        );

        const dialog =
            document.createElement(
                'div'
            );

        dialog.setAttribute(
            'data-modal-dialog',
            ''
        );

        const header =
            document.createElement(
                'div'
            );

        header.setAttribute(
            'data-modal-header',
            ''
        );

        const body =
            document.createElement(
                'div'
            );

        body.setAttribute(
            'data-modal-body',
            ''
        );

        const footer =
            document.createElement(
                'div'
            );

        footer.setAttribute(
            'data-modal-footer',
            ''
        );

        if (
            options.title !== undefined
        ) {

            const title =
                document.createElement(
                    'h2'
                );

            title.setAttribute(
                'data-modal-title',
                ''
            );

            title.textContent =
                String(
                    options.title
                );

            header.append(
                title
            );
        }

        if (
            options.showCloseButton !==
            false
        ) {

            const closeButton =
                document.createElement(
                    'button'
                );

            closeButton.type =
                'button';

            closeButton.setAttribute(
                'data-modal-close',
                ''
            );

            closeButton.setAttribute(
                'aria-label',
                'Close modal'
            );

            closeButton.textContent =
                '×';

            header.append(
                closeButton
            );
        }

        if (
            options.content !== undefined
        ) {

            body.textContent =
                String(
                    options.content
                );
        }

        dialog.append(
            header,
            body,
            footer
        );

        element.append(
            backdrop,
            dialog
        );

        document.body.append(
            element
        );

        const instance =
            this.register(
                element,
                options
            );

        if (
            options.html !== undefined
        ) {

            instance.setHTML(
                options.html
            );
        }

        if (
            Array.isArray(
                options.children
            )
        ) {

            options.children.forEach(
                (child) => {

                    if (
                        child instanceof Node
                    ) {

                        instance.addFooterChild(
                            child
                        );
                    }
                }
            );
        }

        if (
            options.autoOpen === true
        ) {

            instance.open();
        }

        return instance;
    }


    applyOptionsAttributes(
        element,
        options
    ) {

        const booleanAttributes = {

            closeOnBackdrop:
                'data-modal-close-on-backdrop',

            closeOnEscape:
                'data-modal-close-on-escape',

            lockBodyScroll:
                'data-modal-lock-body-scroll',

            trapFocus:
                'data-modal-trap-focus',

            restoreFocus:
                'data-modal-restore-focus',

            drag:
                'data-modal-draggable',

            repositionOnResize:
                'data-modal-reposition-on-resize',

            repositionOnScroll:
                'data-modal-reposition-on-scroll'
        };

        Object.entries(
            booleanAttributes
        ).forEach(
            (
                [
                    option,
                    attribute
                ]
            ) => {

                if (
                    options[option] !==
                    undefined
                ) {

                    element.setAttribute(
                        attribute,
                        options[option]
                            ? 'true'
                            : 'false'
                    );
                }
            }
        );

        const valueAttributes = {

            position:
                'data-modal-position',

            animation:
                'data-modal-animation',

            size:
                'data-modal-size',

            dragBoundary:
                'data-modal-drag-boundary',

            positionX:
                'data-modal-position-x',

            positionY:
                'data-modal-position-y'
        };

        Object.entries(
            valueAttributes
        ).forEach(
            (
                [
                    option,
                    attribute
                ]
            ) => {

                if (
                    options[option] !==
                    undefined &&
                    options[option] !==
                    null
                ) {

                    element.setAttribute(
                        attribute,
                        String(
                            options[option]
                        )
                    );
                }
            }
        );

        return this;
    }


    get(reference) {

        if (!reference) {
            return null;
        }

        if (
            reference instanceof ModalInstance
        ) {

            return reference;
        }

        if (
            reference instanceof Element
        ) {

            return (
                this.instances.get(
                    reference
                ) ??
                null
            );
        }

        if (
            typeof reference ===
            'string'
        ) {

            return this.findById(
                reference
            );
        }

        return null;
    }


    has(reference) {

        return (
            this.get(reference) !==
            null
        );
    }


    all() {

        return Array.from(
            this.instances.values()
        );
    }


    open(reference) {

        const instance =
            this.get(reference);

        if (!instance) {

            throw new Error(
                'RedSkyModal: Modal instance not found.'
            );
        }

        return instance.open();
    }


    close(reference) {

        const instance =
            this.get(reference);

        if (!instance) {
            return null;
        }

        return instance.close();
    }


    toggle(reference) {

        const instance =
            this.get(reference);

        if (!instance) {

            throw new Error(
                'RedSkyModal: Modal instance not found.'
            );
        }

        return instance.toggle();
    }


    push(instance) {

        if (!instance) {
            return this;
        }

        this.removeFromStack(
            instance
        );

        this.stack.push(
            instance
        );

        this.updateZIndexes();

        return this;
    }


    removeFromStack(instance) {

        const index =
            this.stack.indexOf(
                instance
            );

        if (
            index !== -1
        ) {

            this.stack.splice(
                index,
                1
            );
        }

        this.updateZIndexes();

        return this;
    }


    getTop() {

        if (
            this.stack.length === 0
        ) {

            return null;
        }

        return this.stack[
            this.stack.length - 1
        ];
    }


    isTop(instance) {

        return (
            this.getTop() ===
            instance
        );
    }


    active() {

        return this.getTop();
    }


    closeActive() {

        const instance =
            this.getTop();

        if (!instance) {
            return null;
        }

        return instance.close();
    }


    closeAll() {

        const instances =
            [
                ...this.stack
            ];

        instances.forEach(
            (instance) => {

                instance.close();
            }
        );

        return this;
    }


    updateZIndexes() {

        const baseZIndex =
            10000;

        this.stack.forEach(
            (
                instance,
                index
            ) => {

                if (
                    !instance.element
                ) {

                    return;
                }

                instance.setStackIndex(
                    index
                );

                instance.element.style.zIndex =
                    String(
                        baseZIndex +
                        index
                    );
            }
        );

        return this;
    }


    lockBody() {

        if (
            this.bodyLockCount ===
            0
        ) {

            const body =
                document.body;

            this.bodyOriginalOverflow =
                body.style.overflow;

            this.bodyOriginalPaddingRight =
                body.style.paddingRight;

            const scrollbarWidth =
                window.innerWidth -
                document.documentElement.clientWidth;

            body.style.overflow =
                'hidden';

            if (
                scrollbarWidth > 0
            ) {

                const computedStyle =
                    window.getComputedStyle(
                        body
                    );

                const currentPaddingRight =
                    parseFloat(
                        computedStyle.paddingRight
                    ) || 0;

                body.style.paddingRight =
                    `${currentPaddingRight + scrollbarWidth}px`;
            }
        }

        this.bodyLockCount++;

        return this;
    }


    unlockBody() {

        if (
            this.bodyLockCount ===
            0
        ) {

            return this;
        }

        this.bodyLockCount--;

        if (
            this.bodyLockCount ===
            0
        ) {

            const body =
                document.body;

            body.style.overflow =
                this.bodyOriginalOverflow ??
                '';

            body.style.paddingRight =
                this.bodyOriginalPaddingRight ??
                '';

            this.bodyOriginalOverflow =
                null;

            this.bodyOriginalPaddingRight =
                null;
        }

        return this;
    }


    destroy(reference) {

        const instance =
            this.get(reference);

        if (!instance) {
            return null;
        }

        instance.destroy();

        if (
            this.instances.has(
                instance.element
            )
        ) {

            this.unregister(
                instance
            );
        }

        return null;
    }


    alert(
        message,
        options = {}
    ) {

        const instance =
            this.create({
                ...options,
                title:
                    options.title ??
                    'Alert',
                content:
                    message
            });

        if (
            options.open !== false
        ) {

            instance.open();
        }

        return instance;
    }


    confirm(
        message,
        options = {}
    ) {

        const instance =
            this.create({
                ...options,
                title:
                    options.title ??
                    'Confirm',
                content:
                    message
            });

        const result =
            new Promise(
                (resolve) => {

                    let settled =
                        false;

                    const cleanup =
                        () => {

                            instance.off(
                                'close',
                                handleClose
                            );
                        };

                    const handleClose =
                        () => {

                            if (
                                settled
                            ) {

                                return;
                            }

                            settled =
                                true;

                            cleanup();

                            resolve(
                                false
                            );
                        };

                    const confirmButton =
                        document.createElement(
                            'button'
                        );

                    confirmButton.type =
                        'button';

                    confirmButton.textContent =
                        options.confirmText ??
                        'Confirm';

                    confirmButton.addEventListener(
                        'click',
                        () => {

                            if (
                                settled
                            ) {

                                return;
                            }

                            settled =
                                true;

                            cleanup();

                            instance.close();

                            resolve(
                                true
                            );
                        }
                    );

                    instance.addFooterChild(
                        confirmButton
                    );

                    instance.on(
                        'close',
                        handleClose
                    );

                    instance.open();
                }
            );

        result.modal =
            instance;

        return result;
    }


    prompt(
        message,
        options = {}
    ) {

        const instance =
            this.create({
                ...options,
                title:
                    options.title ??
                    'Input',
                content:
                    message
            });

        const input =
            document.createElement(
                'input'
            );

        input.type =
            options.type ??
            'text';

        input.name =
            options.name ??
            'value';

        input.value =
            options.value ??
            '';

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
            options.inputClass
        ) {

            input.className =
                String(
                    options.inputClass
                );
        }

        instance.bodyElement.append(
            input
        );

        const result =
            new Promise(
                (resolve) => {

                    let settled =
                        false;

                    const cleanup =
                        () => {

                            instance.off(
                                'close',
                                handleClose
                            );
                        };

                    const handleClose =
                        () => {

                            if (
                                settled
                            ) {

                                return;
                            }

                            settled =
                                true;

                            cleanup();

                            resolve(
                                null
                            );
                        };

                    const submitButton =
                        document.createElement(
                            'button'
                        );

                    submitButton.type =
                        'button';

                    submitButton.textContent =
                        options.submitText ??
                        'Submit';

                    submitButton.addEventListener(
                        'click',
                        () => {

                            if (
                                settled
                            ) {

                                return;
                            }

                            const value =
                                input.value;

                            settled =
                                true;

                            cleanup();

                            instance.close();

                            resolve(
                                value
                            );
                        }
                    );

                    instance.addFooterChild(
                        submitButton
                    );

                    instance.on(
                        'close',
                        handleClose
                    );

                    instance.open();

                    requestAnimationFrame(
                        () => {

                            if (
                                instance.isOpen()
                            ) {

                                input.focus();
                            }
                        }
                    );
                }
            );

        result.modal =
            instance;

        return result;
    }


    createId() {

        let id;

        do {

            this.sequence++;

            id =
                `redsky-modal-${this.sequence}`;

        } while (
            this.findById(id)
        );

        return id;
    }


    findById(id) {

        if (
            typeof id !==
            'string' ||
            id.trim() === ''
        ) {

            return null;
        }

        for (
            const instance of
            this.instances.values()
        ) {

            if (
                instance.id === id ||
                instance.element.id === id
            ) {

                return instance;
            }
        }

        return null;
    }


    sync() {

        this.stack =
            this.stack.filter(
                (instance) =>
                    instance.isOpen() &&
                    this.instances.has(
                        instance.element
                    )
            );

        for (
            const instance of
            this.instances.values()
        ) {

            if (
                instance.isOpen() &&
                !this.stack.includes(
                    instance
                )
            ) {

                this.stack.push(
                    instance
                );
            }
        }

        this.updateZIndexes();

        return this;
    }


    clear() {

        const instances =
            [
                ...this.instances.values()
            ];

        instances.forEach(
            (instance) => {

                instance.destroy();
            }
        );

        this.instances.clear();

        this.stack =
            [];

        while (
            this.bodyLockCount > 0
        ) {

            this.unlockBody();
        }

        this.bodyOriginalOverflow =
            null;

        this.bodyOriginalPaddingRight =
            null;

        return this;
    }


    count() {

        return this.instances.size;
    }


    openCount() {

        return this.stack.length;
    }
}