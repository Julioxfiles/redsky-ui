/**
 * RedSky Toast
 *
 * Provides automatic and manual dismissal for Toast components.
 */
class Toast
{
    static initialize()
    {
        const toasts = document.querySelectorAll(
            '[data-redsky-component="toast"]'
        );

        toasts.forEach(toast => {
            const dismissButton = toast.querySelector(
                '[data-toast-dismiss]'
            );

            const duration = parseInt(
                toast.dataset.toastDuration ?? '3000',
                10
            );

            let timer = null;

            const dismiss = () => {
                if (timer !== null) {
                    clearTimeout(timer);
                    timer = null;
                }

                toast.remove();
            };

            if (dismissButton) {
                dismissButton.addEventListener('click', dismiss);
            }

            if (duration > 0) {
                timer = setTimeout(dismiss, duration);
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    Toast.initialize();
});