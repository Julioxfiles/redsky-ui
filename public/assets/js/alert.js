/**
 * RedSky Alert
 *
 * Provides dismiss behavior for Alert components.
 */
class Alert
{
    /**
     * Initializes Alert components.
     */
    static initialize()
    {
        const alerts = document.querySelectorAll(
            '[data-redsky-component="alert"]'
        );

        alerts.forEach(alert => {
            const dismissButton = alert.querySelector(
                '[data-alert-dismiss]'
            );

            if (!dismissButton) {
                return;
            }

            dismissButton.addEventListener('click', () => {
                alert.remove();
            });
        });
    }
}


document.addEventListener('DOMContentLoaded', () => {
    Alert.initialize();
});