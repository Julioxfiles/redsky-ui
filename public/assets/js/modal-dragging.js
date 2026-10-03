/**
 * RedSky Modal Dragging
 *
 * Pointer Events dragging support for RedSky Modal.
 *
 * No jQuery dependency.
 */

export class ModalDragging {

    constructor(modal) {

        this.modal = modal;
    }


    handlePointerDown(event) {

        if (!this.modal.options.drag) {
            return;
        }

        if (!this.modal.isOpen()) {
            return;
        }

        if (!this.modal.header) {
            return;
        }

        if (
            event.target instanceof Element &&
            event.target.closest(
                '[data-modal-close]'
            )
        ) {
            return;
        }

        /*
         * Allow primary and secondary mouse buttons.
         *
         * button === 0 -> left mouse button
         * button === 2 -> right mouse button
         */
        if (
            event.button !== undefined &&
            event.button !== 0 &&
            event.button !== 2
        ) {
            return;
        }

        /*
         * Prevent the browser context menu from interfering
         * with right-button dragging.
         */
        event.preventDefault();

        this.modal.isDragging =
            true;

        this.modal.dragPointerId =
            event.pointerId;

        const rect =
            this.modal.dialog.getBoundingClientRect();

        this.modal.dragOffsetX =
            event.clientX -
            rect.left;

        this.modal.dragOffsetY =
            event.clientY -
            rect.top;

        /*
         * The modal is now manually positioned.
         *
         * ModalPositioning must not recalculate its
         * original center position after this point.
         */
        this.modal.positionedManually =
            true;

        /*
         * Capture the pointer on the HEADER, because the
         * header owns the pointermove/pointerup listeners.
         *
         * This allows dragging to continue even after the
         * pointer leaves the header.
         */
        if (
            this.modal.header.setPointerCapture
        ) {

            this.modal.header.setPointerCapture(
                event.pointerId
            );
        }

        this.modal.header.setAttribute(
            'data-modal-dragging',
            'true'
        );

        this.modal.dialog.setAttribute(
            'data-modal-dragging',
            'true'
        );

        this.modal.emit(
            'dragStart',
            event
        );
    }


    handlePointerMove(event) {

        if (!this.modal.isDragging) {
            return;
        }

        if (
            event.pointerId !==
            this.modal.dragPointerId
        ) {
            return;
        }

        event.preventDefault();

        const left =
            event.clientX -
            this.modal.dragOffsetX;

        const top =
            event.clientY -
            this.modal.dragOffsetY;

        const position =
            this.modal.constrainToViewport(
                left,
                top
            );

        this.modal.setPosition(
            position.left,
            position.top
        );

        /*
         * Keep the manually positioned state active.
         *
         * This prevents resize, scroll, focus, or another
         * positioning operation from moving the modal back.
         */
        this.modal.positionedManually =
            true;

        this.modal.emit(
            'drag',
            {
                event,
                left:
                    position.left,
                top:
                    position.top
            }
        );
    }


    handlePointerUp(event) {

        if (!this.modal.isDragging) {
            return;
        }

        if (
            this.modal.dragPointerId !== null &&
            event.pointerId !==
            this.modal.dragPointerId
        ) {
            return;
        }

        event.preventDefault();

        /*
         * Release pointer capture from the same element
         * that received it.
         */
        if (
            this.modal.header &&
            this.modal.header.hasPointerCapture &&
            this.modal.header.hasPointerCapture(
                event.pointerId
            )
        ) {

            this.modal.header.releasePointerCapture(
                event.pointerId
            );
        }

        /*
         * The final coordinates are already stored in
         * dialog.style.left/top by setPosition().
         *
         * Do NOT call reposition() here.
         * Do NOT reset positionedManually here.
         */
        this.modal.isDragging =
            false;

        this.modal.dragPointerId =
            null;

        this.modal.header.removeAttribute(
            'data-modal-dragging'
        );

        this.modal.dialog.removeAttribute(
            'data-modal-dragging'
        );

        /*
         * Keep the final manually selected position.
         */
        this.modal.positionedManually =
            true;

        this.modal.emit(
            'dragEnd',
            event
        );
    }


    handleContextMenu(event) {

        if (!this.modal.isDragging) {
            return;
        }

        event.preventDefault();
    }


    reset() {

        if (
            this.modal.header &&
            this.modal.dragPointerId !== null &&
            this.modal.header.hasPointerCapture &&
            this.modal.header.hasPointerCapture(
                this.modal.dragPointerId
            )
        ) {

            this.modal.header.releasePointerCapture(
                this.modal.dragPointerId
            );
        }

        this.modal.isDragging =
            false;

        if (this.modal.header) {

            this.modal.header.removeAttribute(
                'data-modal-dragging'
            );
        }

        if (this.modal.dialog) {

            this.modal.dialog.removeAttribute(
                'data-modal-dragging'
            );
        }

        this.modal.dragPointerId =
            null;

        this.modal.dragOffsetX =
            0;

        this.modal.dragOffsetY =
            0;

        return this;
    }
}