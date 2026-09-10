/**
 * RedSky Modal Instance
 *
 * Represents and controls a single RedSky Modal element.
 *
 * Coordinates:
 *
 * - ModalPositioning
 * - ModalDragging
 * - ModalFocus
 * - ModalContent
 * - ModalEvents
 *
 * The instance does not create or manage the global RedSky Modal API.
 * ModalManager is responsible for registration and stacking.
 *
 * No jQuery dependency.
 */

import { ModalPositioning } from './ModalPositioning.js';
import { ModalDragging } from './ModalDragging.js';
import { ModalFocus } from './ModalFocus.js';
import { ModalContent } from './ModalContent.js';
import { ModalEvents } from './ModalEvents.js';


export class ModalInstance {

    constructor(
        element,
        options = {},
        manager = null
    ) {

        if (
            !(element instanceof HTMLElement)
        ) {

            throw new TypeError(
                'RedSkyModal: Modal element must be an HTMLElement.'
            );
        }

        this.element =
            element;

        this.manager =
            manager;

        this.id =
            element.id ||
            null;

        this.dialog =
            element.querySelector(
                '[data-modal-dialog]'
            );

        this.backdrop =
            element.querySelector(
                '[data-modal-backdrop]'
            );

        this.header =
            element.querySelector(
                '[data-modal-header]'
            );

        this.titleElement =
            element.querySelector(
                '[data-modal-title]'
            );

        this.bodyElement =
            element.querySelector(
                '[data-modal-body]'
            );

        this.footer =
            element.querySelector(
                '[data-modal-footer]'
            );

        if (!this.dialog) {

            throw new Error(
                'RedSkyModal: Modal dialog element was not found.'
            );
        }

        this.options = {

            closeOnBackdrop:
                this.readBooleanAttribute(
                    'data-modal-close-on-backdrop',
                    true
                ),

            closeOnEscape:
                this.readBooleanAttribute(
                    'data-modal-close-on-escape',
                    true
                ),

            lockBodyScroll:
                this.readBooleanAttribute(
                    'data-modal-lock-body-scroll',
                    true
                ),

            trapFocus:
                this.readBooleanAttribute(
                    'data-modal-trap-focus',
                    true
                ),

            restoreFocus:
                this.readBooleanAttribute(
                    'data-modal-restore-focus',
                    true
                ),

            position:
                element.getAttribute(
                    'data-modal-position'
                ) ||
                'center',

            animation:
                element.getAttribute(
                    'data-modal-animation'
                ) ||
                'fade',

            size:
                element.getAttribute(
                    'data-modal-size'
                ) ||
                'medium',

            drag:
                this.readBooleanAttribute(
                    'data-modal-draggable',
                    false
                ),

            dragBoundary:
                element.getAttribute(
                    'data-modal-drag-boundary'
                ) ||
                'viewport',

            repositionOnResize:
                this.readBooleanAttribute(
                    'data-modal-reposition-on-resize',
                    true
                ),

            repositionOnScroll:
                this.readBooleanAttribute(
                    'data-modal-reposition-on-scroll',
                    true
                ),

            positionX:
                this.readNumericAttribute(
                    'data-modal-position-x'
                ),

            positionY:
                this.readNumericAttribute(
                    'data-modal-position-y'
                ),

            ...options
        };

        this.events =
            new ModalEvents(
                this
            );

        this.positioning =
            new ModalPositioning(
                this
            );

        this.dragging =
            new ModalDragging(
                this
            );

        this.focus =
            new ModalFocus(
                this
            );

        this.content =
            new ModalContent(
                this
            );

        this.previousActiveElement =
            null;

        this.anchor =
            null;

        this.isDragging =
            false;

        this.dragPointerId =
            null;

        this.dragOffsetX =
            0;

        this.dragOffsetY =
            0;

        this.positionedManually =
            this.options.position === 'custom' &&
            this.options.positionX !== null &&
            this.options.positionY !== null;

        this.stackIndex =
            0;

        this.destroyed =
            false;

        this._bodyLockApplied =
            false;

        this.boundHandlers = {

            keydown:
                this.handleKeydown.bind(
                    this
                ),

            backdropClick:
                this.handleBackdropClick.bind(
                    this
                ),

            closeClick:
                this.handleCloseClick.bind(
                    this
                ),

            resize:
                this.handleResize.bind(
                    this
                ),

            orientationChange:
                this.handleResize.bind(
                    this
                ),

            scroll:
                this.handleScroll.bind(
                    this
                ),

            pointerDown:
                this.dragging
                    .handlePointerDown
                    .bind(
                        this.dragging
                    ),

            pointerMove:
                this.dragging
                    .handlePointerMove
                    .bind(
                        this.dragging
                    ),

            pointerUp:
                this.dragging
                    .handlePointerUp
                    .bind(
                        this.dragging
                    )
        };

        this.initialize();
    }


    initialize() {

        this.ensureStructure();

        this.updateAria();

        this.bindEvents();

        if (
            this.isElementOpen()
        ) {

            this.element.removeAttribute(
                'hidden'
            );

            this.element.setAttribute(
                'data-modal-open',
                ''
            );
        }

        return this;
    }


    ensureStructure() {

        if (!this.header) {

            this.header =
                document.createElement(
                    'div'
                );

            this.header.setAttribute(
                'data-modal-header',
                ''
            );

            this.dialog.prepend(
                this.header
            );
        }

        if (!this.bodyElement) {

            this.bodyElement =
                document.createElement(
                    'div'
                );

            this.bodyElement.setAttribute(
                'data-modal-body',
                ''
            );

            this.dialog.append(
                this.bodyElement
            );
        }

        if (!this.footer) {

            this.footer =
                document.createElement(
                    'div'
                );

            this.footer.setAttribute(
                'data-modal-footer',
                ''
            );

            this.dialog.append(
                this.footer
            );
        }

        this.updateDragging();

        return this;
    }


    bindEvents() {

        document.addEventListener(
            'keydown',
            this.boundHandlers.keydown
        );

        window.addEventListener(
            'resize',
            this.boundHandlers.resize
        );

        window.addEventListener(
            'orientationchange',
            this.boundHandlers.orientationChange
        );

        window.addEventListener(
            'scroll',
            this.boundHandlers.scroll,
            true
        );

        if (this.backdrop) {

            this.backdrop.addEventListener(
                'click',
                this.boundHandlers.backdropClick
            );
        }

        this.bindCloseButtons();

        return this;
    }


    bindCloseButtons() {

        this.element
            .querySelectorAll(
                '[data-modal-close]'
            )
            .forEach(
                (button) => {

                    button.addEventListener(
                        'click',
                        this.boundHandlers.closeClick
                    );
                }
            );

        return this;
    }


    unbindEvents() {

        document.removeEventListener(
            'keydown',
            this.boundHandlers.keydown
        );

        window.removeEventListener(
            'resize',
            this.boundHandlers.resize
        );

        window.removeEventListener(
            'orientationchange',
            this.boundHandlers.orientationChange
        );

        window.removeEventListener(
            'scroll',
            this.boundHandlers.scroll,
            true
        );

        if (this.backdrop) {

            this.backdrop.removeEventListener(
                'click',
                this.boundHandlers.backdropClick
            );
        }

        this.element
            .querySelectorAll(
                '[data-modal-close]'
            )
            .forEach(
                (button) => {

                    button.removeEventListener(
                        'click',
                        this.boundHandlers.closeClick
                    );
                }
            );

        this.removeDraggingListeners();

        return this;
    }


    open() {

        if (this.destroyed) {

            throw new Error(
                'RedSkyModal: Cannot open a destroyed modal.'
            );
        }

        if (this.isOpen()) {
            return this;
        }

        const allowed =
            this.emitCancelable(
                'beforeOpen',
                this
            );

        if (!allowed) {
            return this;
        }

        this.previousActiveElement =
            document.activeElement;

        this.element.removeAttribute(
            'hidden'
        );

        this.element.setAttribute(
            'data-modal-open',
            ''
        );

        if (
            this.options.lockBodyScroll &&
            !this._bodyLockApplied &&
            this.manager &&
            typeof this.manager.lockBody ===
                'function'
        ) {

            this.manager.lockBody();

            this._bodyLockApplied =
                true;
        }

        if (
            this.manager &&
            typeof this.manager.push ===
                'function'
        ) {

            this.manager.push(
                this
            );
        }

        if (
            this.options.position === 'custom' &&
            this.options.positionX !== null &&
            this.options.positionY !== null
        ) {

            this.positionedManually =
                true;

            this.positioning.moveTo(
                this.options.positionX,
                this.options.positionY
            );

        } else {

            this.positioning.reposition();
        }

        this.emit(
            'open',
            this
        );

        requestAnimationFrame(
            () => {

                if (
                    !this.isOpen() ||
                    this.destroyed
                ) {

                    return;
                }

                this.focus.focusInitialElement();

                this.emit(
                    'afterOpen',
                    this
                );
            }
        );

        return this;
    }


    close() {

        if (this.destroyed) {
            return this;
        }

        if (!this.isOpen()) {
            return this;
        }

        const allowed =
            this.emitCancelable(
                'beforeClose',
                this
            );

        if (!allowed) {
            return this;
        }

        this.element.removeAttribute(
            'data-modal-open'
        );

        this.element.setAttribute(
            'hidden',
            ''
        );

        this.dragging.reset();

        if (
            this.manager &&
            typeof this.manager.removeFromStack ===
                'function'
        ) {

            this.manager.removeFromStack(
                this
            );
        }

        if (
            this._bodyLockApplied &&
            this.manager &&
            typeof this.manager.unlockBody ===
                'function'
        ) {

            this.manager.unlockBody();

            this._bodyLockApplied =
                false;
        }

        this.emit(
            'close',
            this
        );

        this.focus.restorePreviousFocus();

        this.emit(
            'afterClose',
            this
        );

        return this;
    }


    toggle() {

        if (this.isOpen()) {

            return this.close();
        }

        return this.open();
    }


    destroy() {

        if (this.destroyed) {
            return this;
        }

        const allowed =
            this.emitCancelable(
                'beforeDestroy',
                this
            );

        if (!allowed) {
            return this;
        }

        if (this.isOpen()) {

            this.close();
        }

        this.unbindEvents();

        if (
            this.manager &&
            typeof this.manager.unregister ===
                'function'
        ) {

            this.manager.unregister(
                this
            );
        }

        this.emit(
            'destroy',
            this
        );

        this.events.clear();

        this.destroyed =
            true;

        return this;
    }


    isOpen() {

        return this.element.hasAttribute(
            'data-modal-open'
        );
    }


    isElementOpen() {

        return (
            this.element.hasAttribute(
                'data-modal-open'
            ) &&
            !this.element.hasAttribute(
                'hidden'
            )
        );
    }


    setId(id) {

        if (
            typeof id !== 'string' ||
            id.trim() === ''
        ) {

            throw new TypeError(
                'RedSkyModal: Modal id must be a non-empty string.'
            );
        }

        this.id =
            id;

        this.element.id =
            id;

        this.updateAria();

        return this;
    }


    getId() {

        return this.id;
    }


    setTitle(title) {

        this.content.setTitle(
            title
        );

        this.titleElement =
            this.element.querySelector(
                '[data-modal-title]'
            );

        this.updateAria();

        return this;
    }


    getTitle() {

        if (!this.titleElement) {
            return null;
        }

        return this.titleElement.textContent;
    }


    setText(text) {

        return this.content.setText(
            text
        );
    }


    setHTML(html) {

        return this.content.setHTML(
            html
        );
    }


    text(text) {

        return this.setText(
            text
        );
    }


    html(html) {

        return this.setHTML(
            html
        );
    }


    body(content) {

        if (
            typeof content ===
            'string'
        ) {

            return this.setText(
                content
            );
        }

        if (
            content instanceof Node
        ) {

            this.bodyElement.replaceChildren(
                content
            );

            this.emit(
                'contentChange',
                this.bodyElement
            );

            return this;
        }

        return this;
    }


    append(content) {

        if (
            content instanceof Node
        ) {

            this.bodyElement.append(
                content
            );

        } else {

            this.bodyElement.append(
                document.createTextNode(
                    String(
                        content ?? ''
                    )
                )
            );
        }

        this.emit(
            'contentChange',
            this.bodyElement
        );

        return this;
    }


    prepend(content) {

        if (
            content instanceof Node
        ) {

            this.bodyElement.prepend(
                content
            );

        } else {

            this.bodyElement.prepend(
                document.createTextNode(
                    String(
                        content ?? ''
                    )
                )
            );
        }

        this.emit(
            'contentChange',
            this.bodyElement
        );

        return this;
    }


    clearBody() {

        this.bodyElement.replaceChildren();

        this.emit(
            'contentChange',
            this.bodyElement
        );

        return this;
    }


    footer(content) {

        if (
            content instanceof Node
        ) {

            this.footer.append(
                content
            );

        } else {

            this.footer.append(
                document.createTextNode(
                    String(
                        content ?? ''
                    )
                )
            );
        }

        this.emit(
            'contentChange',
            this.footer
        );

        return this;
    }


    clearFooter() {

        this.footer.replaceChildren();

        this.emit(
            'contentChange',
            this.footer
        );

        return this;
    }


    addChild(child) {

        if (
            !(child instanceof Node)
        ) {

            throw new TypeError(
                'RedSkyModal: Child must be a DOM Node.'
            );
        }

        this.footer.append(
            child
        );

        this.emit(
            'contentChange',
            this.footer
        );

        return this;
    }


    addFooterChild(child) {

        return this.addChild(
            child
        );
    }


    setOption(
        name,
        value
    ) {

        this.options[name] =
            value;

        this.syncOptionAttribute(
            name,
            value
        );

        switch (name) {

            case 'position':

                this.positionedManually =
                    false;

                if (
                    value !== 'custom'
                ) {

                    this.options.positionX =
                        null;

                    this.options.positionY =
                        null;

                    this.element.removeAttribute(
                        'data-modal-position-x'
                    );

                    this.element.removeAttribute(
                        'data-modal-position-y'
                    );
                }

                if (this.isOpen()) {
                    this.positioning.reposition();
                }

                break;

            case 'animation':
            case 'size':

                break;

            case 'drag':

                this.updateDragging();

                break;

            case 'dragBoundary':

                break;

            case 'repositionOnResize':
            case 'repositionOnScroll':

                break;

            case 'positionX':
                this.syncOptionAttribute(
                    'positionX',
                    value
                );
                break;

            case 'positionY':
                this.syncOptionAttribute(
                    'positionY',
                    value
                );
                break;
        }

        return this;
    }


    getOption(name) {

        return this.options[name];
    }


    setPosition(
        left,
        top
    ) {

        return this.positioning.setPosition(
            left,
            top
        );
    }


    moveTo(
        left,
        top
    ) {

        return this.positioning.moveTo(
            left,
            top
        );
    }


    center() {

        this.positionedManually =
            false;

        this.options.position =
            'center';

        this.options.positionX =
            null;

        this.options.positionY =
            null;

        this.syncOptionAttribute(
            'position',
            'center'
        );

        this.element.removeAttribute(
            'data-modal-position-x'
        );

        this.element.removeAttribute(
            'data-modal-position-y'
        );

        this.positioning.center();

        return this;
    }


    openAt(
        left,
        top
    ) {

        return this.positioning.openAt(
            left,
            top
        );
    }


    openNear(anchor) {

        return this.positioning.openNear(
            anchor
        );
    }


    resetPosition() {

        return this.positioning.resetPosition();
    }


    constrainToViewport(
        left,
        top
    ) {

        return this.positioning
            .constrainToViewport(
                left,
                top
            );
    }


    isValidAnchor(anchor) {

        return (
            anchor instanceof
            HTMLElement
        );
    }


    setStackIndex(index) {

        this.stackIndex =
            index;

        return this;
    }


    on(
        event,
        handler
    ) {

        return this.events.on(
            event,
            handler
        );
    }


    once(
        event,
        handler
    ) {

        return this.events.once(
            event,
            handler
        );
    }


    off(
        event,
        handler
    ) {

        return this.events.off(
            event,
            handler
        );
    }


    emit(
        event,
        data = null
    ) {

        return this.events.emit(
            event,
            data
        );
    }


    emitCancelable(
        event,
        data = null
    ) {

        return this.events.emitCancelable(
            event,
            data
        );
    }


    updateAria() {

        if (!this.dialog) {
            return this;
        }

        if (
            this.titleElement
        ) {

            let titleId =
                this.titleElement.id;

            if (!titleId) {

                titleId =
                    this.id
                        ? `${this.id}-title`
                        : 'redsky-modal-title';

                this.titleElement.id =
                    titleId;
            }

            this.dialog.setAttribute(
                'aria-labelledby',
                titleId
            );

        } else {

            this.dialog.removeAttribute(
                'aria-labelledby'
            );
        }

        this.dialog.setAttribute(
            'role',
            'dialog'
        );

        this.dialog.setAttribute(
            'aria-modal',
            'true'
        );

        return this;
    }


    handleKeydown(event) {

        if (!this.isOpen()) {
            return;
        }

        if (
            this.manager &&
            typeof this.manager.getTop ===
                'function' &&
            this.manager.getTop() !== this
        ) {

            return;
        }

        this.focus.handleKeydown(
            event
        );
    }


    handleBackdropClick(event) {

        if (
            event.target !==
            this.backdrop
        ) {

            return;
        }

        this.emit(
            'backdropClick',
            event
        );

        if (
            this.options.closeOnBackdrop
        ) {

            this.close();
        }
    }


    handleCloseClick(event) {

        this.emit(
            'closeButtonClick',
            event
        );

        this.close();
    }


    handleResize() {

        if (!this.isOpen()) {
            return;
        }

        if (
            this.options.repositionOnResize ===
            false
        ) {

            return;
        }

        if (
            this.positionedManually
        ) {

            const rect =
                this.dialog.getBoundingClientRect();

            const position =
                this.constrainToViewport(
                    rect.left,
                    rect.top
                );

            this.setPosition(
                position.left,
                position.top
            );

            return;
        }

        this.positioning.reposition();
    }


    handleScroll() {

        if (!this.isOpen()) {
            return;
        }

        if (
            this.options.repositionOnScroll ===
            false
        ) {

            return;
        }

        if (
            this.anchor &&
            !document.body.contains(
                this.anchor
            )
        ) {

            const lostAnchor =
                this.anchor;

            this.anchor =
                null;

            this.emit(
                'anchorLost',
                lostAnchor
            );

            this.positioning.center();

            return;
        }

        if (
            this.positionedManually
        ) {

            return;
        }

        this.positioning.reposition();
    }


    updateDragging() {

        if (
            !this.header
        ) {

            return this;
        }

        const enabled =
            Boolean(
                this.options.drag
            );

        const alreadyEnabled =
            this.header.hasAttribute(
                'data-modal-drag-handle'
            );

        this.header.toggleAttribute(
            'data-modal-drag-handle',
            enabled
        );

        this.header.style.touchAction =
            enabled
                ? 'none'
                : '';

        if (
            enabled &&
            !alreadyEnabled
        ) {

            this.header.addEventListener(
                'pointerdown',
                this.boundHandlers.pointerDown
            );

            this.header.addEventListener(
                'pointermove',
                this.boundHandlers.pointerMove
            );

            this.header.addEventListener(
                'pointerup',
                this.boundHandlers.pointerUp
            );

            this.header.addEventListener(
                'pointercancel',
                this.boundHandlers.pointerUp
            );
        }

        if (
            !enabled &&
            alreadyEnabled
        ) {

            this.removeDraggingListeners();
        }

        return this;
    }


    removeDraggingListeners() {

        if (!this.header) {
            return this;
        }

        this.header.removeAttribute(
            'data-modal-drag-handle'
        );

        this.header.removeEventListener(
            'pointerdown',
            this.boundHandlers.pointerDown
        );

        this.header.removeEventListener(
            'pointermove',
            this.boundHandlers.pointerMove
        );

        this.header.removeEventListener(
            'pointerup',
            this.boundHandlers.pointerUp
        );

        this.header.removeEventListener(
            'pointercancel',
            this.boundHandlers.pointerUp
        );

        this.header.style.touchAction =
            '';

        return this;
    }


    syncOptionAttribute(
        name,
        value
    ) {

        const attributes = {

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

            position:
                'data-modal-position',

            animation:
                'data-modal-animation',

            size:
                'data-modal-size',

            drag:
                'data-modal-draggable',

            dragBoundary:
                'data-modal-drag-boundary',

            repositionOnResize:
                'data-modal-reposition-on-resize',

            repositionOnScroll:
                'data-modal-reposition-on-scroll',

            positionX:
                'data-modal-position-x',

            positionY:
                'data-modal-position-y'
        };

        const attribute =
            attributes[name];

        if (!attribute) {
            return this;
        }

        if (
            typeof value ===
            'boolean'
        ) {

            this.element.setAttribute(
                attribute,
                value
                    ? 'true'
                    : 'false'
            );

        } else if (
            value === null ||
            value === undefined
        ) {

            this.element.removeAttribute(
                attribute
            );

        } else {

            this.element.setAttribute(
                attribute,
                String(value)
            );
        }

        return this;
    }


    readBooleanAttribute(
        name,
        fallback
    ) {

        if (
            !this.element.hasAttribute(
                name
            )
        ) {

            return fallback;
        }

        return (
            this.element.getAttribute(
                name
            ) === 'true'
        );
    }


    readNumericAttribute(name) {

        if (
            !this.element.hasAttribute(
                name
            )
        ) {

            return null;
        }

        const value =
            Number(
                this.element.getAttribute(
                    name
                )
            );

        return Number.isFinite(value)
            ? value
            : null;
    }
}