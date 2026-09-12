/**
 * RedSky Modal
 *
 * Generic modal runtime for PHP-rendered and JavaScript-created modals.
 *
 * No jQuery dependency.
 *
 * Features:
 * - PHP modal discovery
 * - Dynamic modal creation
 * - Open / close / toggle / destroy
 * - Smart viewport positioning
 * - Anchor positioning
 * - Center / top / bottom / left / right / custom positioning
 * - Dragging with Pointer Events
 * - Viewport drag boundaries
 * - Backdrop
 * - Escape key
 * - Focus management
 * - Focus trapping
 * - Body scroll locking
 * - Responsive repositioning
 * - Lifecycle events
 * - Safe text / attribute APIs
 * - Sanitized HTML API
 * - Modal stack management
 */

(function (window, document) {

    'use strict';

    class RedSkyModalInstance {

        static positions = [
            'center',
            'top',
            'bottom',
            'left',
            'right',
            'anchor',
            'custom'
        ];

        static animations = [
            'none',
            'fade',
            'slide-down',
            'slide-up',
            'slide-left',
            'slide-right',
            'zoom'
        ];

        static sizes = [
            'small',
            'medium',
            'large',
            'fullscreen'
        ];

        constructor(element, options = {}) {

            this.element = element;

            this.dialog = element.querySelector(
                '[data-modal-dialog]'
            );

            this.header = element.querySelector(
                '[data-modal-header]'
            );

            this.titleElement = element.querySelector(
                '[data-modal-title]'
            );

            this.bodyElement = element.querySelector(
                '[data-modal-body]'
            );

            this.footerElement = element.querySelector(
                '[data-modal-footer]'
            );

            this.backdrop = element.querySelector(
                '[data-modal-backdrop]'
            );

            this.closeButton = element.querySelector(
                '[data-modal-close]'
            );

            this.options = {
                position: this.getData(
                    'position',
                    'center'
                ),

                animation: this.getData(
                    'animation',
                    'fade'
                ),

                size: this.getData(
                    'size',
                    'medium'
                ),

                closeOnBackdrop: this.getBooleanData(
                    'closeOnBackdrop',
                    true
                ),

                closeOnEscape: this.getBooleanData(
                    'closeOnEscape',
                    true
                ),

                lockBodyScroll: this.getBooleanData(
                    'lockBodyScroll',
                    true
                ),

                trapFocus: this.getBooleanData(
                    'trapFocus',
                    true
                ),

                restoreFocus: this.getBooleanData(
                    'restoreFocus',
                    true
                ),

                drag: true,

                dragBoundary: 'viewport',

                repositionOnResize: true,

                repositionOnScroll: true,

                ...options
            };

            this.options.position =
                this.validatePosition(
                    this.options.position
                );

            this.options.animation =
                this.validateAnimation(
                    this.options.animation
                );

            this.options.size =
                this.validateSize(
                    this.options.size
                );

            this.anchor =
                options.anchor ||
                null;

            this.previousActiveElement = null;

            this.isDragging = false;

            this.dragPointerId = null;

            this.dragOffsetX = 0;

            this.dragOffsetY = 0;

            this.positionedManually = false;

            this.destroyed = false;

            this.events = new Map();

            this.boundHandlers = {};

            this.initialize();
        }

        initialize() {

            if (!this.element) {
                throw new Error(
                    'RedSkyModal: Modal element is required.'
                );
            }

            if (!this.dialog) {
                throw new Error(
                    'RedSkyModal: Modal dialog element is missing.'
                );
            }

            this.prepareElement();

            this.bindEvents();

            this.applySize();

            this.applyAnimation();

            this.updateAria();

            if (!this.isHidden()) {
                this.setupOpenState();
            }
        }

        prepareElement() {

            this.element.setAttribute(
                'data-redsky-modal-initialized',
                'true'
            );

            this.element.classList.add(
                'redsky-modal'
            );

            this.dialog.classList.add(
                'redsky-modal-dialog'
            );

            if (this.header) {

                this.header.classList.add(
                    'redsky-modal-header'
                );

                this.header.setAttribute(
                    'data-modal-drag-handle',
                    ''
                );

                this.header.style.touchAction =
                    'none';

                this.header.style.cursor =
                    'move';
            }

            if (this.bodyElement) {

                this.bodyElement.classList.add(
                    'redsky-modal-body'
                );
            }

            if (this.footerElement) {

                this.footerElement.classList.add(
                    'redsky-modal-footer'
                );
            }

            if (this.backdrop) {

                this.backdrop.classList.add(
                    'redsky-modal-backdrop'
                );
            }

            if (this.closeButton) {

                this.closeButton.setAttribute(
                    'type',
                    'button'
                );
            }

            this.element.setAttribute(
                'data-modal-state',
                this.isHidden()
                    ? 'closed'
                    : 'open'
            );
        }

        bindEvents() {

            this.boundHandlers.closeButton =
                (event) => {

                    event.preventDefault();

                    this.emit(
                        'closeButtonClick',
                        event
                    );

                    this.close();
                };

            this.boundHandlers.backdrop =
                (event) => {

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
                };

            this.boundHandlers.keydown =
                (event) => {

                    this.handleKeydown(event);
                };

            this.boundHandlers.pointerDown =
                (event) => {

                    this.handlePointerDown(event);
                };

            this.boundHandlers.pointerMove =
                (event) => {

                    this.handlePointerMove(event);
                };

            this.boundHandlers.pointerUp =
                (event) => {

                    this.handlePointerUp(event);
                };

            this.boundHandlers.resize =
                () => {

                    if (
                        !this.options.repositionOnResize
                    ) {
                        return;
                    }

                    if (!this.isOpen()) {
                        return;
                    }

                    if (
                        this.positionedManually
                    ) {
                        return;
                    }

                    this.reposition();
                };

            this.boundHandlers.scroll =
                () => {

                    if (
                        !this.options.repositionOnScroll
                    ) {
                        return;
                    }

                    if (!this.isOpen()) {
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

                        this.anchor = null;

                        this.emit(
                            'anchorLost',
                            lostAnchor
                        );

                        this.center();

                        return;
                    }

                    if (this.anchor) {
                        this.reposition();
                    }
                };

            if (this.closeButton) {

                this.closeButton.addEventListener(
                    'click',
                    this.boundHandlers.closeButton
                );
            }

            if (this.backdrop) {

                this.backdrop.addEventListener(
                    'click',
                    this.boundHandlers.backdrop
                );
            }

            if (
                this.options.drag &&
                this.header
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

            document.addEventListener(
                'keydown',
                this.boundHandlers.keydown
            );

            window.addEventListener(
                'resize',
                this.boundHandlers.resize
            );

            window.addEventListener(
                'scroll',
                this.boundHandlers.scroll,
                true
            );
        }

        handleKeydown(event) {

            if (!this.isOpen()) {
                return;
            }

            if (
                event.key === 'Escape' &&
                this.options.closeOnEscape
            ) {

                event.preventDefault();

                this.emit(
                    'escape',
                    event
                );

                this.close();

                return;
            }

            if (
                event.key === 'Tab' &&
                this.options.trapFocus
            ) {

                this.trapFocus(event);
            }
        }

        handlePointerDown(event) {

            if (!this.options.drag) {
                return;
            }

            if (!this.isOpen()) {
                return;
            }

            if (!this.header) {
                return;
            }

            if (
                event.target.closest(
                    '[data-modal-close]'
                )
            ) {
                return;
            }

            if (
                event.button !== undefined &&
                event.button !== 0
            ) {
                return;
            }

            this.isDragging = true;

            this.dragPointerId =
                event.pointerId;

            const rect =
                this.dialog.getBoundingClientRect();

            this.dragOffsetX =
                event.clientX -
                rect.left;

            this.dragOffsetY =
                event.clientY -
                rect.top;

            this.positionedManually = true;

            if (
                this.dialog.setPointerCapture
            ) {

                this.dialog.setPointerCapture(
                    event.pointerId
                );
            }

            this.dialog.setAttribute(
                'data-modal-dragging',
                'true'
            );

            this.emit(
                'dragStart',
                event
            );
        }

        handlePointerMove(event) {

            if (!this.isDragging) {
                return;
            }

            if (
                event.pointerId !==
                this.dragPointerId
            ) {
                return;
            }

            event.preventDefault();

            const left =
                event.clientX -
                this.dragOffsetX;

            const top =
                event.clientY -
                this.dragOffsetY;

            const position =
                this.constrainToViewport(
                    left,
                    top
                );

            this.setPosition(
                position.left,
                position.top
            );

            this.emit(
                'drag',
                {
                    event,
                    left: position.left,
                    top: position.top
                }
            );
        }

        handlePointerUp(event) {

            if (!this.isDragging) {
                return;
            }

            if (
                this.dragPointerId !== null &&
                event.pointerId !==
                this.dragPointerId
            ) {
                return;
            }

            this.isDragging = false;

            if (
                this.dialog.hasPointerCapture &&
                this.dialog.hasPointerCapture(
                    event.pointerId
                )
            ) {

                this.dialog.releasePointerCapture(
                    event.pointerId
                );
            }

            this.dialog.removeAttribute(
                'data-modal-dragging'
            );

            this.dragPointerId = null;

            this.emit(
                'dragEnd',
                event
            );
        }

        setupOpenState() {

            this.lockBody();

            this.positionedManually = false;

            this.reposition();

            this.focusInitialElement();

            this.emit('open');

            this.emit(
                'afterOpen'
            );
        }

        open(options = {}) {

            if (this.destroyed) {
                return this;
            }

            if (options.anchor !== undefined) {

                if (
                    options.anchor !== null &&
                    !this.isValidAnchor(
                        options.anchor
                    )
                ) {

                    throw new TypeError(
                        'RedSkyModal: Invalid anchor element.'
                    );
                }

                this.anchor =
                    options.anchor;
            }

            if (
                options.position !==
                undefined
            ) {

                this.options.position =
                    this.validatePosition(
                        options.position
                    );
            }

            if (
                options.size !==
                undefined
            ) {

                this.options.size =
                    this.validateSize(
                        options.size
                    );

                this.applySize();
            }

            if (
                options.animation !==
                undefined
            ) {

                this.options.animation =
                    this.validateAnimation(
                        options.animation
                    );

                this.applyAnimation();
            }

            if (this.isOpen()) {

                this.reposition();

                return this;
            }

            this.previousActiveElement =
                document.activeElement;

            const beforeResult =
                this.emitCancelable(
                    'beforeOpen',
                    options
                );

            if (beforeResult === false) {
                return this;
            }

            this.element.hidden = false;

            this.element.setAttribute(
                'data-modal-state',
                'open'
            );

            this.element.setAttribute(
                'data-modal-open',
                ''
            );

            RedSkyModal.push(this);

            this.setupOpenState();

            return this;
        }

        close(options = {}) {

            if (this.destroyed) {
                return this;
            }

            if (!this.isOpen()) {
                return this;
            }

            const beforeResult =
                this.emitCancelable(
                    'beforeClose',
                    options
                );

            if (beforeResult === false) {
                return this;
            }

            this.isDragging = false;

            this.dialog.removeAttribute(
                'data-modal-dragging'
            );

            this.element.removeAttribute(
                'data-modal-open'
            );

            this.element.setAttribute(
                'data-modal-state',
                'closed'
            );

            this.element.hidden = true;

            this.unlockBody();

            RedSkyModal.removeFromStack(
                this
            );

            this.restorePreviousFocus();

            this.emit(
                'close',
                options
            );

            this.emit(
                'afterClose',
                options
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
                return;
            }

            const beforeResult =
                this.emitCancelable(
                    'beforeDestroy'
                );

            if (beforeResult === false) {
                return;
            }

            if (this.isOpen()) {
                this.close();
            } else {
                RedSkyModal.removeFromStack(
                    this
                );

                this.unlockBody();
            }

            this.isDragging = false;

            if (this.closeButton) {

                this.closeButton.removeEventListener(
                    'click',
                    this.boundHandlers.closeButton
                );
            }

            if (this.backdrop) {

                this.backdrop.removeEventListener(
                    'click',
                    this.boundHandlers.backdrop
                );
            }

            if (this.header) {

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
            }

            document.removeEventListener(
                'keydown',
                this.boundHandlers.keydown
            );

            window.removeEventListener(
                'resize',
                this.boundHandlers.resize
            );

            window.removeEventListener(
                'scroll',
                this.boundHandlers.scroll,
                true
            );

            this.destroyed = true;

            this.emit(
                'destroy'
            );

            this.events.clear();

            if (
                this.element.parentNode
            ) {

                this.element.parentNode.removeChild(
                    this.element
                );
            }
        }

        reposition() {

            if (!this.dialog) {
                return;
            }

            const beforeResult =
                this.emitCancelable(
                    'beforePosition',
                    {
                        position:
                            this.options.position,
                        anchor:
                            this.anchor
                    }
                );

            if (beforeResult === false) {
                return;
            }

            if (
                this.options.position ===
                'anchor' ||
                this.anchor
            ) {

                if (this.anchor) {

                    this.positionNearAnchor();

                    return;
                }
            }

            switch (
                this.options.position
            ) {

                case 'top':
                    this.positionTop();
                    break;

                case 'bottom':
                    this.positionBottom();
                    break;

                case 'left':
                    this.positionLeft();
                    break;

                case 'right':
                    this.positionRight();
                    break;

                case 'custom':
                    this.emit(
                        'position',
                        this.getDialogRect()
                    );

                    this.emit(
                        'afterPosition',
                        this.getDialogRect()
                    );

                    break;

                case 'center':
                default:
                    this.center();
                    break;
            }
        }

        center() {

            const viewport =
                this.getViewport();

            const rect =
                this.dialog.getBoundingClientRect();

            const left =
                (viewport.width -
                    rect.width) / 2;

            const top =
                (viewport.height -
                    rect.height) / 2;

            const position =
                this.constrainToViewport(
                    left,
                    top
                );

            this.setPosition(
                position.left,
                position.top
            );

            this.emit(
                'afterPosition',
                position
            );
        }

        positionTop() {

            const viewport =
                this.getViewport();

            const rect =
                this.dialog.getBoundingClientRect();

            const margin = 20;

            const left =
                (viewport.width -
                    rect.width) / 2;

            const top = margin;

            const position =
                this.constrainToViewport(
                    left,
                    top
                );

            this.setPosition(
                position.left,
                position.top
            );

            this.emit(
                'afterPosition',
                position
            );
        }

        positionBottom() {

            const viewport =
                this.getViewport();

            const rect =
                this.dialog.getBoundingClientRect();

            const margin = 20;

            const left =
                (viewport.width -
                    rect.width) / 2;

            const top =
                viewport.height -
                rect.height -
                margin;

            const position =
                this.constrainToViewport(
                    left,
                    top
                );

            this.setPosition(
                position.left,
                position.top
            );

            this.emit(
                'afterPosition',
                position
            );
        }

        positionLeft() {

            const viewport =
                this.getViewport();

            const rect =
                this.dialog.getBoundingClientRect();

            const margin = 20;

            const left = margin;

            const top =
                (viewport.height -
                    rect.height) / 2;

            const position =
                this.constrainToViewport(
                    left,
                    top
                );

            this.setPosition(
                position.left,
                position.top
            );

            this.emit(
                'afterPosition',
                position
            );
        }

        positionRight() {

            const viewport =
                this.getViewport();

            const rect =
                this.dialog.getBoundingClientRect();

            const margin = 20;

            const left =
                viewport.width -
                rect.width -
                margin;

            const top =
                (viewport.height -
                    rect.height) / 2;

            const position =
                this.constrainToViewport(
                    left,
                    top
                );

            this.setPosition(
                position.left,
                position.top
            );

            this.emit(
                'afterPosition',
                position
            );
        }

        positionNearAnchor() {

            if (!this.anchor) {

                this.center();

                return;
            }

            if (
                !document.body.contains(
                    this.anchor
                )
            ) {

                const lostAnchor =
                    this.anchor;

                this.anchor = null;

                this.emit(
                    'anchorLost',
                    lostAnchor
                );

                this.center();

                return;
            }

            const anchorRect =
                this.anchor.getBoundingClientRect();

            const modalRect =
                this.dialog.getBoundingClientRect();

            const viewport =
                this.getViewport();

            const gap = 12;

            const candidates = [

                {
                    name: 'bottom',

                    left:
                        anchorRect.left,

                    top:
                        anchorRect.bottom +
                        gap
                },

                {
                    name: 'top',

                    left:
                        anchorRect.left,

                    top:
                        anchorRect.top -
                        modalRect.height -
                        gap
                },

                {
                    name: 'right',

                    left:
                        anchorRect.right +
                        gap,

                    top:
                        anchorRect.top
                },

                {
                    name: 'left',

                    left:
                        anchorRect.left -
                        modalRect.width -
                        gap,

                    top:
                        anchorRect.top
                }
            ];

            let best = null;

            for (
                const candidate of candidates
            ) {

                const score =
                    this.calculateVisibilityScore(
                        candidate.left,
                        candidate.top,
                        modalRect,
                        viewport
                    );

                if (
                    best === null ||
                    score > best.score
                ) {

                    best = {
                        ...candidate,
                        score
                    };
                }

                if (score === 1) {
                    break;
                }
            }

            let left =
                best.left;

            let top =
                best.top;

            const adjusted =
                this.constrainToViewport(
                    left,
                    top
                );

            left =
                adjusted.left;

            top =
                adjusted.top;

            this.setPosition(
                left,
                top
            );

            this.emit(
                'anchorPosition',
                {
                    anchor: this.anchor,
                    placement: best.name,
                    left,
                    top
                }
            );

            this.emit(
                'afterPosition',
                {
                    left,
                    top
                }
            );
        }

        calculateVisibilityScore(
            left,
            top,
            modalRect,
            viewport
        ) {

            const visibleLeft =
                Math.max(
                    0,
                    left
                );

            const visibleTop =
                Math.max(
                    0,
                    top
                );

            const visibleRight =
                Math.min(
                    viewport.width,
                    left +
                    modalRect.width
                );

            const visibleBottom =
                Math.min(
                    viewport.height,
                    top +
                    modalRect.height
                );

            const visibleWidth =
                Math.max(
                    0,
                    visibleRight -
                    visibleLeft
                );

            const visibleHeight =
                Math.max(
                    0,
                    visibleBottom -
                    visibleTop
                );

            const visibleArea =
                visibleWidth *
                visibleHeight;

            const totalArea =
                modalRect.width *
                modalRect.height;

            if (totalArea <= 0) {
                return 0;
            }

            return (
                visibleArea /
                totalArea
            );
        }

        constrainToViewport(
            left,
            top
        ) {

            if (
                this.options.dragBoundary !==
                'viewport'
            ) {

                return {
                    left,
                    top
                };
            }

            const viewport =
                this.getViewport();

            const rect =
                this.dialog.getBoundingClientRect();

            const margin = 8;

            const maxLeft =
                Math.max(
                    margin,
                    viewport.width -
                    rect.width -
                    margin
                );

            const maxTop =
                Math.max(
                    margin,
                    viewport.height -
                    rect.height -
                    margin
                );

            return {

                left:
                    Math.min(
                        Math.max(
                            left,
                            margin
                        ),
                        maxLeft
                    ),

                top:
                    Math.min(
                        Math.max(
                            top,
                            margin
                        ),
                        maxTop
                    )
            };
        }

        setPosition(left, top) {

            this.dialog.style.position =
                'fixed';

            this.dialog.style.left =
                `${left}px`;

            this.dialog.style.top =
                `${top}px`;

            this.dialog.style.margin =
                '0';

            this.emit(
                'position',
                {
                    left,
                    top
                }
            );
        }

        moveTo(left, top) {

            this.positionedManually =
                true;

            const position =
                this.constrainToViewport(
                    left,
                    top
                );

            this.setPosition(
                position.left,
                position.top
            );

            this.emit(
                'afterPosition',
                position
            );

            return this;
        }

        openAt(left, top) {

            this.options.position =
                'custom';

            return this.moveTo(
                left,
                top
            );
        }

        resetPosition() {

            this.positionedManually =
                false;

            this.reposition();

            return this;
        }

        openNear(anchor) {

            if (
                !this.isValidAnchor(anchor)
            ) {

                throw new TypeError(
                    'RedSkyModal: Invalid anchor element.'
                );
            }

            this.anchor =
                anchor;

            this.options.position =
                'anchor';

            this.positionedManually =
                false;

            return this.open();
        }

        applySize() {

            this.element.setAttribute(
                'data-modal-size',
                this.options.size
            );
        }

        applyAnimation() {

            this.element.setAttribute(
                'data-modal-animation',
                this.options.animation
            );
        }

        updateAria() {

            this.element.setAttribute(
                'role',
                'dialog'
            );

            this.element.setAttribute(
                'aria-modal',
                'true'
            );

            if (this.titleElement) {

                let titleId =
                    this.titleElement.id;

                if (!titleId) {

                    const modalId =
                        this.element.id;

                    titleId =
                        modalId
                            ? `${modalId}-title`
                            : this.createId(
                                'redsky-modal-title'
                            );

                    this.titleElement.id =
                        titleId;
                }

                this.element.setAttribute(
                    'aria-labelledby',
                    titleId
                );
            }
        }

        focusInitialElement() {

            if (!this.isOpen()) {
                return;
            }

            const focusable =
                this.getFocusableElements();

            if (
                focusable.length > 0
            ) {

                focusable[0].focus();

                this.emit(
                    'focus',
                    focusable[0]
                );

                return;
            }

            this.dialog.setAttribute(
                'tabindex',
                '-1'
            );

            this.dialog.focus();

            this.emit(
                'focus',
                this.dialog
            );
        }

        restorePreviousFocus() {

            if (
                !this.options.restoreFocus
            ) {
                return;
            }

            if (
                !this.previousActiveElement
            ) {
                return;
            }

            if (
                !document.body.contains(
                    this.previousActiveElement
                )
            ) {
                return;
            }

            if (
                typeof this.previousActiveElement.focus !==
                'function'
            ) {
                return;
            }

            this.previousActiveElement.focus();

            this.emit(
                'focusRestore',
                this.previousActiveElement
            );
        }

        trapFocus(event) {

            const focusable =
                this.getFocusableElements();

            if (
                focusable.length === 0
            ) {

                event.preventDefault();

                this.dialog.focus();

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
                this.dialog.querySelectorAll(
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

        lockBody() {

            if (
                !this.options.lockBodyScroll
            ) {
                return;
            }

            RedSkyModal.lockBody();
        }

        unlockBody() {

            if (
                !this.options.lockBodyScroll
            ) {
                return;
            }

            RedSkyModal.unlockBody();
        }

        isOpen() {

            return (
                !this.element.hidden &&
                this.element.getAttribute(
                    'data-modal-state'
                ) === 'open'
            );
        }

        isHidden() {

            return this.element.hidden;
        }

        getDialogRect() {

            return this.dialog
                .getBoundingClientRect();
        }

        getViewport() {

            return {

                width:
                    document.documentElement
                        .clientWidth,

                height:
                    document.documentElement
                        .clientHeight
            };
        }

        getData(name, fallback) {

            const value =
                this.element.dataset[name];

            return value !== undefined
                ? value
                : fallback;
        }

        getBooleanData(
            name,
            fallback
        ) {

            const value =
                this.element.dataset[name];

            if (
                value === undefined
            ) {
                return fallback;
            }

            return value === 'true';
        }

        createId(prefix) {

            return `${prefix}-${Math.random()
                .toString(36)
                .slice(2, 10)}`;
        }

        setText(text) {

            if (!this.bodyElement) {
                return this;
            }

            this.bodyElement.textContent =
                String(text ?? '');

            this.emit(
                'contentChange',
                this.bodyElement
            );

            return this;
        }

        setHTML(html) {

            if (!this.bodyElement) {
                return this;
            }

            this.bodyElement.innerHTML =
                this.sanitizeHTML(
                    String(html ?? '')
                );

            this.emit(
                'contentChange',
                this.bodyElement
            );

            return this;
        }

        sanitizeHTML(html) {

            const template =
                document.createElement(
                    'template'
                );

            template.innerHTML =
                html;

            const dangerousElements =
                template.content.querySelectorAll(
                    [
                        'script',
                        'iframe',
                        'object',
                        'embed',
                        'base',
                        'meta',
                        'link',
                        'style',
                        'form'
                    ].join(',')
                );

            dangerousElements.forEach(
                (element) => {

                    element.remove();
                }
            );

            const elements =
                template.content.querySelectorAll(
                    '*'
                );

            elements.forEach(
                (element) => {

                    Array.from(
                        element.attributes
                    ).forEach(
                        (attribute) => {

                            const name =
                                attribute.name
                                    .toLowerCase();

                            const value =
                                attribute.value
                                    .trim();

                            if (
                                !this.isSafeAttributeName(
                                    name
                                )
                            ) {

                                element.removeAttribute(
                                    attribute.name
                                );

                                return;
                            }

                            if (
                                name === 'href' ||
                                name === 'src' ||
                                name === 'action' ||
                                name === 'formaction'
                            ) {

                                if (
                                    !this.isSafeUrl(
                                        value
                                    )
                                ) {

                                    element.removeAttribute(
                                        attribute.name
                                    );
                                }
                            }

                            if (
                                name === 'style'
                            ) {

                                element.removeAttribute(
                                    attribute.name
                                );
                            }
                        }
                    );
                }
            );

            return template.innerHTML;
        }

        isSafeUrl(value) {

            if (!value) {
                return true;
            }

            const normalized =
                value
                    .replace(
                        /[\u0000-\u001F\u007F-\u009F]/g,
                        ''
                    )
                    .trim()
                    .toLowerCase();

            if (
                normalized.startsWith(
                    'javascript:'
                )
            ) {
                return false;
            }

            if (
                normalized.startsWith(
                    'vbscript:'
                )
            ) {
                return false;
            }

            if (
                normalized.startsWith(
                    'data:'
                )
            ) {
                return false;
            }

            return true;
        }

        setTitle(title) {

            if (!this.titleElement) {

                const titleElement =
                    document.createElement(
                        'h2'
                    );

                titleElement.setAttribute(
                    'data-modal-title',
                    ''
                );

                this.titleElement =
                    titleElement;

                if (!this.header) {

                    this.header =
                        document.createElement(
                            'div'
                        );

                    this.header.setAttribute(
                        'data-modal-header',
                        ''
                    );

                    this.header.classList.add(
                        'redsky-modal-header'
                    );

                    this.header.setAttribute(
                        'data-modal-drag-handle',
                        ''
                    );

                    this.header.style.touchAction =
                        'none';

                    this.header.style.cursor =
                        'move';

                    this.dialog.prepend(
                        this.header
                    );

                    if (this.options.drag) {

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
                }

                this.header.prepend(
                    titleElement
                );
            }

            this.titleElement.textContent =
                String(title ?? '');

            this.updateAria();

            this.emit(
                'contentChange',
                this.titleElement
            );

            return this;
        }

        setAttribute(name, value) {

            if (
                !this.isSafeAttributeName(
                    name
                )
            ) {

                throw new TypeError(
                    `RedSkyModal: Unsafe attribute name "${name}".`
                );
            }

            if (
                this.isUrlAttribute(name) &&
                !this.isSafeUrl(
                    String(value)
                )
            ) {

                throw new TypeError(
                    `RedSkyModal: Unsafe URL value for "${name}".`
                );
            }

            this.element.setAttribute(
                name,
                String(value)
            );

            return this;
        }

        removeAttribute(name) {

            this.element.removeAttribute(
                name
            );

            return this;
        }

        on(event, handler) {

            if (
                typeof handler !==
                'function'
            ) {

                throw new TypeError(
                    'RedSkyModal: Event handler must be a function.'
                );
            }

            if (
                !this.events.has(event)
            ) {

                this.events.set(
                    event,
                    new Set()
                );
            }

            this.events
                .get(event)
                .add(handler);

            return this;
        }

        once(event, handler) {

            const wrapper =
                (...args) => {

                    this.off(
                        event,
                        wrapper
                    );

                    handler(...args);
                };

            return this.on(
                event,
                wrapper
            );
        }

        off(event, handler) {

            if (
                !this.events.has(event)
            ) {
                return this;
            }

            if (handler) {

                this.events
                    .get(event)
                    .delete(handler);

            } else {

                this.events.delete(
                    event
                );
            }

            return this;
        }

        emit(event, data = null) {

            const handlers =
                this.events.get(event);

            if (!handlers) {
                return;
            }

            for (
                const handler of [
                    ...handlers
                ]
            ) {

                handler.call(
                    this,
                    data,
                    this
                );
            }
        }

        emitCancelable(
            event,
            data = null
        ) {

            const handlers =
                this.events.get(event);

            if (!handlers) {
                return true;
            }

            for (
                const handler of [
                    ...handlers
                ]
            ) {

                const result =
                    handler.call(
                        this,
                        data,
                        this
                    );

                if (result === false) {
                    return false;
                }
            }

            return true;
        }

        validatePosition(position) {

            if (
                !RedSkyModalInstance.positions
                    .includes(position)
            ) {

                throw new TypeError(
                    `RedSkyModal: Invalid position "${position}".`
                );
            }

            return position;
        }

        validateAnimation(animation) {

            if (
                !RedSkyModalInstance.animations
                    .includes(animation)
            ) {

                throw new TypeError(
                    `RedSkyModal: Invalid animation "${animation}".`
                );
            }

            return animation;
        }

        validateSize(size) {

            if (
                !RedSkyModalInstance.sizes
                    .includes(size)
            ) {

                throw new TypeError(
                    `RedSkyModal: Invalid size "${size}".`
                );
            }

            return size;
        }

        isValidAnchor(anchor) {

            return (
                anchor instanceof
                Element &&
                typeof anchor.getBoundingClientRect ===
                'function'
            );
        }

        isSafeAttributeName(name) {

            if (
                typeof name !==
                'string'
            ) {
                return false;
            }

            if (
                !/^[a-zA-Z_:][a-zA-Z0-9:._-]*$/
                    .test(name)
            ) {
                return false;
            }

            const normalized =
                name.toLowerCase();

            if (
                normalized.startsWith(
                    'on'
                )
            ) {
                return false;
            }

            const blocked = [
                'srcdoc',
                'formaction'
            ];

            if (
                blocked.includes(
                    normalized
                )
            ) {
                return false;
            }

            return true;
        }

        isUrlAttribute(name) {

            return [
                'href',
                'src',
                'action',
                'formaction'
            ].includes(
                String(name).toLowerCase()
            );
        }
    }

    class RedSkyModalManager {

        constructor() {

            this.instances = new Map();

            this.stack = [];

            this.bodyLockCount = 0;

            this.bodyOriginalOverflow = null;

            this.bodyOriginalPaddingRight = null;
        }

        initialize() {

            const elements =
                document.querySelectorAll(
                    '[data-redsky-component="modal"]'
                );

            elements.forEach(
                (element) => {

                    this.register(
                        element
                    );
                }
            );

            return this;
        }

        register(
            element,
            options = {}
        ) {

            if (!element) {

                throw new Error(
                    'RedSkyModal: Cannot register empty element.'
                );
            }

            if (
                this.instances.has(element)
            ) {

                return this.instances.get(
                    element
                );
            }

            const instance =
                new RedSkyModalInstance(
                    element,
                    options
                );

            this.instances.set(
                element,
                instance
            );

            return instance;
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

            element.hidden = true;

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

            header.appendChild(
                closeButton
            );

            dialog.appendChild(
                header
            );

            dialog.appendChild(
                body
            );

            dialog.appendChild(
                footer
            );

            element.appendChild(
                backdrop
            );

            element.appendChild(
                dialog
            );

            document.body.appendChild(
                element
            );

            const instance =
                this.register(
                    element,
                    options
                );

            if (options.id) {

                element.id =
                    String(options.id);
            }

            if (
                options.title !==
                undefined
            ) {

                instance.setTitle(
                    options.title
                );
            }

            if (
                options.text !==
                undefined
            ) {

                instance.setText(
                    options.text
                );
            }

            if (
                options.html !==
                undefined
            ) {

                instance.setHTML(
                    options.html
                );
            }

            if (
                options.className
            ) {

                const classNames =
                    String(
                        options.className
                    )
                        .split(/\s+/)
                        .filter(Boolean);

                element.classList.add(
                    ...classNames
                );

                element.classList.add(
                    'redsky-modal'
                );
            }

            if (
                options.attributes
            ) {

                for (
                    const [
                        name,
                        value
                    ] of Object.entries(
                        options.attributes
                    )
                ) {

                    if (
                        !instance.isSafeAttributeName(
                            name
                        )
                    ) {
                        continue;
                    }

                    if (
                        instance.isUrlAttribute(
                            name
                        ) &&
                        !instance.isSafeUrl(
                            String(value)
                        )
                    ) {
                        continue;
                    }

                    element.setAttribute(
                        name,
                        String(value)
                    );
                }
            }

            if (
                options.showCloseButton ===
                false
            ) {

                closeButton.remove();

                instance.closeButton =
                    null;
            }

            return instance;
        }

        get(reference) {

            if (
                reference instanceof
                RedSkyModalInstance
            ) {

                return reference;
            }

            if (
                reference instanceof
                Element
            ) {

                return (
                    this.instances.get(
                        reference
                    ) ||
                    this.register(
                        reference
                    )
                );
            }

            if (
                typeof reference ===
                'string'
            ) {

                const element =
                    document.getElementById(
                        reference
                    );

                if (!element) {
                    return null;
                }

                return (
                    this.instances.get(
                        element
                    ) ||
                    this.register(
                        element
                    )
                );
            }

            return null;
        }

        open(
            reference,
            options = {}
        ) {

            const modal =
                this.get(reference);

            if (!modal) {

                throw new Error(
                    'RedSkyModal: Modal not found.'
                );
            }

            modal.open(options);

            return modal;
        }

        close(reference) {

            const modal =
                this.get(reference);

            if (!modal) {
                return null;
            }

            modal.close();

            return modal;
        }

        toggle(reference) {

            const modal =
                this.get(reference);

            if (!modal) {
                return null;
            }

            if (modal.isOpen()) {

                return this.close(
                    modal
                );
            }

            return this.open(
                modal
            );
        }

        push(modal) {

            this.removeFromStack(
                modal
            );

            this.stack.push(
                modal
            );

            this.updateZIndexes();
        }

        removeFromStack(modal) {

            const index =
                this.stack.indexOf(
                    modal
                );

            if (index !== -1) {

                this.stack.splice(
                    index,
                    1
                );
            }

            this.updateZIndexes();
        }

        updateZIndexes() {

            const base =
                10000;

            this.stack.forEach(
                (modal, index) => {

                    modal.element.style.zIndex =
                        String(
                            base +
                            index * 10
                        );
                }
            );
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

        lockBody() {

            if (
                this.bodyLockCount === 0
            ) {

                this.bodyOriginalOverflow =
                    document.body.style.overflow;

                this.bodyOriginalPaddingRight =
                    document.body.style.paddingRight;

                const scrollbarWidth =
                    window.innerWidth -
                    document.documentElement
                        .clientWidth;

                document.body.style.overflow =
                    'hidden';

                if (
                    scrollbarWidth > 0
                ) {

                    document.body.style.paddingRight =
                        `${scrollbarWidth}px`;
                }
            }

            this.bodyLockCount++;
        }

        unlockBody() {

            if (
                this.bodyLockCount <= 0
            ) {
                return;
            }

            this.bodyLockCount--;

            if (
                this.bodyLockCount === 0
            ) {

                document.body.style.overflow =
                    this.bodyOriginalOverflow ||
                    '';

                document.body.style.paddingRight =
                    this.bodyOriginalPaddingRight ||
                    '';

                this.bodyOriginalOverflow =
                    null;

                this.bodyOriginalPaddingRight =
                    null;
            }
        }

        destroy(reference) {

            const modal =
                this.get(reference);

            if (!modal) {
                return;
            }

            modal.destroy();

            this.instances.delete(
                modal.element
            );
        }

        alert(options = {}) {

            return new Promise(
                (resolve) => {

                    const modal =
                        this.create({
                            ...options,

                            closeOnBackdrop:
                                options.closeOnBackdrop ??
                                false
                        });

                    let settled = false;

                    const finish =
                        () => {

                            if (settled) {
                                return;
                            }

                            settled = true;

                            this.destroy(
                                modal
                            );

                            resolve();
                        };

                    modal.on(
                        'close',
                        finish
                    );

                    modal.open();
                }
            );
        }

        confirm(options = {}) {

            return new Promise(
                (resolve) => {

                    const modal =
                        this.create({
                            ...options
                        });

                    const footer =
                        modal.footerElement;

                    const cancel =
                        document.createElement(
                            'button'
                        );

                    cancel.type =
                        'button';

                    cancel.textContent =
                        options.cancelText ||
                        'Cancel';

                    const confirm =
                        document.createElement(
                            'button'
                        );

                    confirm.type =
                        'button';

                    confirm.textContent =
                        options.confirmText ||
                        'OK';

                    footer.appendChild(
                        cancel
                    );

                    footer.appendChild(
                        confirm
                    );

                    let settled = false;

                    const finish =
                        (result) => {

                            if (settled) {
                                return;
                            }

                            settled = true;

                            this.destroy(
                                modal
                            );

                            resolve(
                                result
                            );
                        };

                    cancel.addEventListener(
                        'click',
                        () => {

                            modal.close();

                            finish(false);
                        }
                    );

                    confirm.addEventListener(
                        'click',
                        () => {

                            modal.close();

                            finish(true);
                        }
                    );

                    modal.on(
                        'close',
                        () => {

                            finish(false);
                        }
                    );

                    modal.open();
                }
            );
        }

        prompt(options = {}) {

            return new Promise(
                (resolve) => {

                    const modal =
                        this.create({
                            ...options
                        });

                    const input =
                        document.createElement(
                            'input'
                        );

                    input.type =
                        options.inputType ||
                        'text';

                    input.value =
                        options.value ||
                        '';

                    input.className =
                        'redsky-modal-prompt-input';

                    modal.bodyElement.appendChild(
                        input
                    );

                    const footer =
                        modal.footerElement;

                    const cancel =
                        document.createElement(
                            'button'
                        );

                    cancel.type =
                        'button';

                    cancel.textContent =
                        options.cancelText ||
                        'Cancel';

                    const submit =
                        document.createElement(
                            'button'
                        );

                    submit.type =
                        'button';

                    submit.textContent =
                        options.confirmText ||
                        'OK';

                    footer.appendChild(
                        cancel
                    );

                    footer.appendChild(
                        submit
                    );

                    let settled = false;

                    const finish =
                        (value) => {

                            if (settled) {
                                return;
                            }

                            settled = true;

                            this.destroy(
                                modal
                            );

                            resolve(
                                value
                            );
                        };

                    cancel.addEventListener(
                        'click',
                        () => {

                            modal.close();

                            finish(null);
                        }
                    );

                    submit.addEventListener(
                        'click',
                        () => {

                            const value =
                                input.value;

                            modal.close();

                            finish(value);
                        }
                    );

                    modal.on(
                        'close',
                        () => {

                            finish(null);
                        }
                    );

                    modal.open();

                    requestAnimationFrame(
                        () => {

                            if (
                                !modal.destroyed &&
                                document.body.contains(
                                    input
                                )
                            ) {

                                input.focus();
                            }
                        }
                    );
                }
            );
        }
    }

    const RedSkyModal =
        new RedSkyModalManager();

    window.RedSkyModal =
        RedSkyModal;

    document.addEventListener(
        'DOMContentLoaded',
        () => {

            RedSkyModal.initialize();
        }
    );

})(window, document);

