/**
 * RedSky KeyboardNavigable Behavior
 *
 * Purpose:
 *
 * Provides reusable keyboard navigation behavior
 * for RedSky UI components.
 *
 *
 * Responsibilities:
 *
 * - Handle keyboard navigation events.
 * - Manage active item movement.
 * - Support arrow navigation.
 * - Support Home and End navigation.
 * - Support dynamic item collections.
 * - Synchronize accessibility attributes.
 * - Improve keyboard accessibility patterns.
 * - Emit navigation lifecycle events.
 *
 *
 * Supported Components:
 *
 * - Menu
 * - Dropdown
 * - Tabs
 * - List
 * - DataGrid
 * - Tree
 * - Command Palette
 *
 *
 * Options:
 *
 * orientation:
 *
 * Navigation direction.
 *
 * Available values:
 *
 * - vertical
 * - horizontal
 * - both
 *
 *
 * activeClass:
 *
 * CSS class applied to active item.
 *
 *
 * activeAttribute:
 *
 * Accessibility attribute used for active item.
 *
 *
 * loop:
 *
 * Allows navigation from last item to first.
 *
 *
 * focusItem:
 *
 * Automatically focuses active item.
 *
 *
 * skipDisabled:
 *
 * Skips disabled items.
 *
 *
 * Events:
 *
 * - beforeNavigate
 * - navigate
 * - afterNavigate
 *
 *
 * Public API:
 *
 * - next()
 * - previous()
 * - first()
 * - last()
 * - move()
 * - setItems()
 * - setActiveIndex()
 * - getActiveIndex()
 * - getActiveItem()
 * - on()
 * - off()
 * - destroy()
 *
 *
 * This file contains only public client-side behavior.
 *
 * Do not place sensitive information here.
 *
 *
 * No jQuery dependency.
 */


export class KeyboardNavigable {


    constructor(
        element,
        items = [],
        options = {}
    ) {

        if (
            !(element instanceof HTMLElement)
        ) {

            throw new TypeError(
                'RedSky KeyboardNavigable: Element must be an HTMLElement.'
            );
        }


        this.element =
            element;


        this.items =
            Array.from(
                items
            );


        this.options = {

            orientation:
                'vertical',

            activeClass:
                'is-active',

            activeAttribute:
                'aria-current',

            loop:
                true,

            focusItem:
                true,

            skipDisabled:
                true,

            preventDefault:
                true,

            stopPropagation:
                false,

            ...options
        };


        this.activeIndex =
            -1;


        this.events =
            new Map();


        this.boundKeydown =
            this.handleKeydown.bind(
                this
            );


        this.bind();
    }



    bind() {

        this.element.addEventListener(
            'keydown',
            this.boundKeydown
        );


        return this;
    }



    next() {

        return this.move(
            this.activeIndex + 1
        );
    }



    previous() {

        return this.move(
            this.activeIndex - 1
        );
    }



    first() {

        return this.move(
            0
        );
    }



    last() {

        return this.move(
            this.items.length - 1
        );
    }



    move(
        index
    ) {

        const available =
            this.getNavigableItems();


        if (
            available.length === 0
        ) {

            return this;
        }


        let targetIndex =
            this.items.indexOf(
                available[0]
            );


        if (
            this.items[index]
            &&
            available.includes(
                this.items[index]
            )
        ) {

            targetIndex =
                index;

        } else {

            targetIndex =
                this.resolveIndex(
                    index,
                    available
                );
        }


        if (
            !this.emitCancelable(
                'beforeNavigate',
                {
                    index:
                        targetIndex
                }
            )
        ) {

            return this;
        }


        this.clearActive();


        this.activeIndex =
            targetIndex;


        const item =
            this.items[
                targetIndex
            ];


        item.classList.add(
            this.options.activeClass
        );


        item.setAttribute(
            this.options.activeAttribute,
            'true'
        );


        if (
            this.options.focusItem
        ) {

            item.focus?.();
        }


        this.element.setAttribute(
            'aria-activedescendant',
            item.id || ''
        );


        this.emit(
            'navigate',
            {
                index:
                    targetIndex,

                item,

                source:
                    this
            }
        );


        this.emit(
            'afterNavigate',
            {
                index:
                    targetIndex,

                item,

                source:
                    this
            }
        );


        return this;
    }



    resolveIndex(
        index,
        items
    ) {

        let current =
            index;


        if (
            this.options.loop
        ) {

            if (
                current < 0
            ) {

                current =
                    this.items.length - 1;
            }


            if (
                current >= this.items.length
            ) {

                current =
                    0;
            }


        } else {

            current =
                Math.max(
                    0,
                    Math.min(
                        current,
                        this.items.length - 1
                    )
                );
        }


        while (
            !items.includes(
                this.items[current]
            )
        ) {

            current +=
                index > this.activeIndex
                    ? 1
                    : -1;


            if (
                current < 0 ||
                current >= this.items.length
            ) {

                break;
            }
        }


        return current;
    }



    getNavigableItems() {

        if (
            !this.options.skipDisabled
        ) {

            return this.items;
        }


        return this.items.filter(
            item => {

                return !(
                    item.disabled ||
                    item.getAttribute(
                        'aria-disabled'
                    ) === 'true'
                );
            }
        );
    }



    clearActive() {

        this.items.forEach(
            item => {

                item.classList.remove(
                    this.options.activeClass
                );


                item.removeAttribute(
                    this.options.activeAttribute
                );
            }
        );


        return this;
    }



    setItems(
        items
    ) {

        this.items =
            Array.from(
                items
            );


        return this;
    }



    setActiveIndex(
        index
    ) {

        return this.move(
            index
        );
    }



    getActiveIndex() {

        return this.activeIndex;
    }



    getActiveItem() {

        return this.items[
            this.activeIndex
        ] || null;
    }



    handleKeydown(
        event
    ) {

        const orientation =
            this.options.orientation;


        switch (
            event.key
        ) {

            case 'ArrowDown':

                if (
                    orientation === 'vertical' ||
                    orientation === 'both'
                ) {

                    this.navigate(
                        event,
                        this.next.bind(this)
                    );
                }

                break;


            case 'ArrowUp':

                if (
                    orientation === 'vertical' ||
                    orientation === 'both'
                ) {

                    this.navigate(
                        event,
                        this.previous.bind(this)
                    );
                }

                break;


            case 'ArrowRight':

                if (
                    orientation === 'horizontal' ||
                    orientation === 'both'
                ) {

                    this.navigate(
                        event,
                        this.next.bind(this)
                    );
                }

                break;


            case 'ArrowLeft':

                if (
                    orientation === 'horizontal' ||
                    orientation === 'both'
                ) {

                    this.navigate(
                        event,
                        this.previous.bind(this)
                    );
                }

                break;


            case 'Home':

                this.navigate(
                    event,
                    this.first.bind(this)
                );

                break;


            case 'End':

                this.navigate(
                    event,
                    this.last.bind(this)
                );

                break;
        }
    }



    navigate(
        event,
        callback
    ) {

        if (
            this.options.preventDefault
        ) {

            event.preventDefault();
        }


        if (
            this.options.stopPropagation
        ) {

            event.stopPropagation();
        }


        callback();
    }



    on(
        event,
        callback
    ) {

        if (
            !this.events.has(event)
        ) {

            this.events.set(
                event,
                []
            );
        }


        this.events
            .get(event)
            .push(
                callback
            );


        return this;
    }



    off(
        event,
        callback
    ) {

        if (
            !this.events.has(event)
        ) {

            return this;
        }


        this.events.set(
            event,
            this.events
                .get(event)
                .filter(
                    listener =>
                        listener !== callback
                )
        );


        return this;
    }



    emitCancelable(
        name,
        detail = null
    ) {

        const event =
            new CustomEvent(
                name,
                {
                    detail,
                    cancelable:
                        true
                }
            );


        this.element.dispatchEvent(
            event
        );


        return !event.defaultPrevented;
    }



    emit(
        name,
        detail = null
    ) {

        this.element.dispatchEvent(
            new CustomEvent(
                name,
                {
                    detail
                }
            )
        );


        if (
            this.events.has(name)
        ) {

            this.events
                .get(name)
                .forEach(
                    callback => {

                        callback(
                            detail
                        );
                    }
                );
        }


        return this;
    }



    destroy() {

        this.element.removeEventListener(
            'keydown',
            this.boundKeydown
        );


        this.events.clear();


        this.items =
            [];


        this.element =
            null;


        return this;
    }

}