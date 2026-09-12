/**
 * RedSky Modal Security
 *
 * Security helpers for RedSky Modal instances.
 *
 * No jQuery dependency.
 */

export class ModalSecurity {

    static sanitizeHTML(html) {

        const template =
            document.createElement(
                'template'
            );

        template.innerHTML =
            String(html ?? '');

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
                            !ModalSecurity.isSafeAttributeName(
                                name
                            )
                        ) {

                            element.removeAttribute(
                                attribute.name
                            );

                            return;
                        }

                        if (
                            ModalSecurity.isUrlAttribute(
                                name
                            )
                        ) {

                            if (
                                !ModalSecurity.isSafeUrl(
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

    static isSafeUrl(value) {

        if (!value) {

            return true;
        }

        const normalized =
            String(value)
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

    static isSafeAttributeName(name) {

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

    static isUrlAttribute(name) {

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
