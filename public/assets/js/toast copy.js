/**
 * Toast component.
 *
 * Handles automatic dismissal and manual closing of toast notifications.
 *
 * A duration of 0 disables automatic dismissal.
 *
 * @package RedSky\Html\Components\Feedback\Toast
 */

const COMPONENT_SELECTOR = '[data-redsky-component="toast"]';
const DISMISS_SELECTOR = '[data-toast-dismiss]';
const DURATION_ATTRIBUTE = 'data-toast-duration';

const timers = new WeakMap();

/**
 * Removes a toast notification from the DOM.
 *
 * @param {HTMLElement} toast
 * @returns {void}
 */
function dismissToast(toast) {
    const timer = timers.get(toast);

    if (timer !== undefined) {
        clearTimeout(timer);
        timers.delete(toast);
    }

    toast.remove();
}

/**
 * Initializes a toast notification.
 *
 * @param {HTMLElement} toast
 * @returns {void}
 */
function initializeToast(toast) {
    if (toast.dataset.toastInitialized === 'true') {
        return;
    }

    toast.dataset.toastInitialized = 'true';

    const dismissButton = toast.querySelector(DISMISS_SELECTOR);

    if (dismissButton) {
        dismissButton.addEventListener('click', () => {
            dismissToast(toast);
        });
    }

    const rawDuration = toast.getAttribute(DURATION_ATTRIBUTE);

    if (rawDuration === null) {
        return;
    }

    const duration = Number(rawDuration);

    if (!Number.isFinite(duration) || duration <= 0) {
        return;
    }

    const timer = setTimeout(() => {
        dismissToast(toast);
    }, duration);

    timers.set(toast, timer);
}

/**
 * Initializes all toast notifications within a root element.
 *
 * @param {ParentNode} root
 * @returns {void}
 */
function initializeToasts(root = document) {
    if (root instanceof Element && root.matches(COMPONENT_SELECTOR)) {
        initializeToast(root);
    }

    root.querySelectorAll(COMPONENT_SELECTOR).forEach(initializeToast);
}

initializeToasts();

/**
 * Public API for dynamically added toast notifications.
 */
export { initializeToasts, initializeToast, dismissToast };