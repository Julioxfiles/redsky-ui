/**
 * RedSky Modal Positioning
 *
 * Viewport, custom, and anchor positioning for RedSky Modal.
 *
 * No jQuery dependency.
 */

export class ModalPositioning {

    constructor(modal) {

        this.modal = modal;
    }


    reposition() {

        if (!this.modal.dialog) {
            return;
        }

        /*
         * Once the user has manually positioned the modal,
         * do not automatically move it again.
         *
         * This is especially important after dragging.
         */
        if (
            this.modal.positionedManually === true
        ) {

            return;
        }

        const beforeResult =
            this.modal.emitCancelable(
                'beforePosition',
                {
                    position:
                        this.modal.options.position,

                    anchor:
                        this.modal.anchor
                }
            );

        if (beforeResult === false) {
            return;
        }

        if (
            this.modal.options.position === 'anchor' ||
            this.modal.anchor
        ) {

            if (this.modal.anchor) {

                this.positionNearAnchor();

                return;
            }
        }

        switch (
            this.modal.options.position
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

                this.positionCustom();

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
            this.modal.dialog.getBoundingClientRect();

        const left =
            (
                viewport.width -
                rect.width
            ) / 2;

        const top =
            (
                viewport.height -
                rect.height
            ) / 2;

        const position =
            this.constrainToViewport(
                left,
                top
            );

        this.setPosition(
            position.left,
            position.top
        );

        this.modal.emit(
            'afterPosition',
            position
        );
    }


    positionTop() {

        const viewport =
            this.getViewport();

        const rect =
            this.modal.dialog.getBoundingClientRect();

        const margin =
            this.modal.options.positionMargin ??
            20;

        const left =
            (
                viewport.width -
                rect.width
            ) / 2;

        const top =
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

        this.modal.emit(
            'afterPosition',
            position
        );
    }


    positionBottom() {

        const viewport =
            this.getViewport();

        const rect =
            this.modal.dialog.getBoundingClientRect();

        const margin =
            this.modal.options.positionMargin ??
            20;

        const left =
            viewport.width -
            rect.width -
            margin;

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

        this.modal.emit(
            'afterPosition',
            position
        );
    }


    positionLeft() {

        const viewport =
            this.getViewport();

        const rect =
            this.modal.dialog.getBoundingClientRect();

        const margin =
            this.modal.options.positionMargin ??
            20;

        const left =
            margin;

        const top =
            (
                viewport.height -
                rect.height
            ) / 2;

        const position =
            this.constrainToViewport(
                left,
                top
            );

        this.setPosition(
            position.left,
            position.top
        );

        this.modal.emit(
            'afterPosition',
            position
        );
    }


    positionRight() {

        const viewport =
            this.getViewport();

        const rect =
            this.modal.dialog.getBoundingClientRect();

        const margin =
            this.modal.options.positionMargin ??
            20;

        const left =
            viewport.width -
            rect.width -
            margin;

        const top =
            (
                viewport.height -
                rect.height
            ) / 2;

        const position =
            this.constrainToViewport(
                left,
                top
            );

        this.setPosition(
            position.left,
            position.top
        );

        this.modal.emit(
            'afterPosition',
            position
        );
    }


    positionCustom() {

        const left =
            this.modal.options.positionX;

        const top =
            this.modal.options.positionY;

        if (
            !Number.isFinite(left) ||
            !Number.isFinite(top)
        ) {

            this.center();

            return;
        }

        const position =
            this.constrainToViewport(
                left,
                top
            );

        this.setPosition(
            position.left,
            position.top
        );

        this.modal.emit(
            'afterPosition',
            position
        );
    }


    positionNearAnchor() {

        if (!this.modal.anchor) {

            this.center();

            return;
        }

        if (
            !document.body.contains(
                this.modal.anchor
            )
        ) {

            const lostAnchor =
                this.modal.anchor;

            this.modal.anchor =
                null;

            this.modal.emit(
                'anchorLost',
                lostAnchor
            );

            this.center();

            return;
        }

        const anchorRect =
            this.modal.anchor.getBoundingClientRect();

        const modalRect =
            this.modal.dialog.getBoundingClientRect();

        const viewport =
            this.getViewport();

        const gap =
            this.modal.options.anchorGap ??
            12;

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

        if (!best) {

            this.center();

            return;
        }

        const adjusted =
            this.constrainToViewport(
                best.left,
                best.top
            );

        this.setPosition(
            adjusted.left,
            adjusted.top
        );

        this.modal.emit(
            'anchorPosition',
            {
                anchor:
                    this.modal.anchor,

                placement:
                    best.name,

                left:
                    adjusted.left,

                top:
                    adjusted.top
            }
        );

        this.modal.emit(
            'afterPosition',
            {
                left:
                    adjusted.left,

                top:
                    adjusted.top
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
            this.modal.options.dragBoundary !==
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
            this.modal.dialog.getBoundingClientRect();

        const margin =
            this.modal.options.viewportMargin ??
            8;

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


    setPosition(
        left,
        top
    ) {

        this.modal.dialog.style.position =
            'fixed';

        this.modal.dialog.style.left =
            `${left}px`;

        this.modal.dialog.style.top =
            `${top}px`;

        this.modal.dialog.style.margin =
            '0';

        this.modal.emit(
            'position',
            {
                left,
                top
            }
        );
    }


    moveTo(
        left,
        top
    ) {

        if (
            !Number.isFinite(left) ||
            !Number.isFinite(top)
        ) {

            throw new TypeError(
                'RedSkyModal: Position coordinates must be finite numbers.'
            );
        }

        this.modal.positionedManually =
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

        this.modal.emit(
            'afterPosition',
            position
        );

        return this.modal;
    }


    openAt(
        left,
        top
    ) {

        this.modal.options.position =
            'custom';

        this.modal.options.positionX =
            left;

        this.modal.options.positionY =
            top;

        this.modal.syncOptionAttribute(
            'position',
            'custom'
        );

        this.modal.syncOptionAttribute(
            'positionX',
            left
        );

        this.modal.syncOptionAttribute(
            'positionY',
            top
        );

        return this.modal.open();
    }


    resetPosition() {

        this.modal.positionedManually =
            false;

        this.modal.options.positionX =
            null;

        this.modal.options.positionY =
            null;

        this.modal.element.removeAttribute(
            'data-modal-position-x'
        );

        this.modal.element.removeAttribute(
            'data-modal-position-y'
        );

        this.reposition();

        return this.modal;
    }


    openNear(anchor) {

        if (
            !this.modal.isValidAnchor(anchor)
        ) {

            throw new TypeError(
                'RedSkyModal: Invalid anchor element.'
            );
        }

        this.modal.anchor =
            anchor;

        this.modal.options.position =
            'anchor';

        this.modal.options.positionX =
            null;

        this.modal.options.positionY =
            null;

        this.modal.positionedManually =
            false;

        this.modal.syncOptionAttribute(
            'position',
            'anchor'
        );

        this.modal.element.removeAttribute(
            'data-modal-position-x'
        );

        this.modal.element.removeAttribute(
            'data-modal-position-y'
        );

        return this.modal.open();
    }


    getDialogRect() {

        return this.modal.dialog
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
}