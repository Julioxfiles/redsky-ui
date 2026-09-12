
/**
 * Copy button for documentation examples.
 *
 * Copies PHP, HTML, or other code blocks
 * and temporarily changes the icon to a check mark.
 */
document
    .querySelectorAll('.documentation-example-copy')
    .forEach(button => {

        button.addEventListener('click', async () => {

            const target = document.getElementById(
                button.dataset.target
            );

            if (!target) {
                return;
            }


            const codeElement = target.querySelector('code');

            if (!codeElement) {
                return;
            }


            const code = codeElement.innerText;


            try {

                await navigator.clipboard.writeText(code);


                const originalIcon = button.innerHTML;


                button.innerHTML = '✓';

                button.title = 'Copied';


                setTimeout(() => {

                    button.innerHTML = originalIcon;

                    button.title = 'Copy code';

                }, 1500);


            } catch (error) {

                console.error(
                    'Unable to copy code:',
                    error
                );

            }

        });

    });