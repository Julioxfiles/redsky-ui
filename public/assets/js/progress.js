console.log('Progress.js loaded');

class Progress
{
    static initialize()
    {
        const progressBars = document.querySelectorAll(
            '[data-redsky-component="progress"]'
        );

        progressBars.forEach(progress => {
            const value = this.parseValue(
                progress.dataset.progressValue,
                0
            );

            const max = this.parseValue(
                progress.dataset.progressMax,
                100
            );

            if (max <= 0) {
                return;
            }

            this.updateIndicator(progress, value, max);
        });
    }

    static setValue(progress, value)
    {
        if (!this.isProgress(progress)) {
            return;
        }

        const max = this.getMax(progress);

        value = this.parseValue(value, null);

        if (value === null || max <= 0) {
            return;
        }

        value = Math.max(0, Math.min(value, max));

        progress.dataset.progressValue = value;
        progress.setAttribute('aria-valuenow', value);

        this.updateIndicator(progress, value, max);

        this.dispatchChangeEvent(progress, value, max);
    }

    static getValue(progress)
    {
        if (!this.isProgress(progress)) {
            return null;
        }

        return this.parseValue(
            progress.dataset.progressValue,
            0
        );
    }

    static setMax(progress, max)
    {
        if (!this.isProgress(progress)) {
            return;
        }

        max = this.parseValue(max, null);

        if (max === null || max <= 0) {
            return;
        }

        let value = this.getValue(progress);

        if (value === null) {
            value = 0;
        }

        value = Math.min(value, max);

        progress.dataset.progressMax = max;
        progress.setAttribute('aria-valuemax', max);

        progress.dataset.progressValue = value;
        progress.setAttribute('aria-valuenow', value);

        this.updateIndicator(progress, value, max);

        this.dispatchChangeEvent(progress, value, max);
    }

    static getMax(progress)
    {
        if (!this.isProgress(progress)) {
            return null;
        }

        return this.parseValue(
            progress.dataset.progressMax,
            100
        );
    }

    static setType(progress, type)
    {
        if (!this.isProgress(progress)) {
            return;
        }

        const allowedTypes = [
            'primary',
            'success',
            'warning',
            'danger',
            'info',
            'light',
            'dark'
        ];

        if (!allowedTypes.includes(type)) {
            return;
        }

        progress.dataset.progressType = type;
    }

    static getType(progress)
    {
        if (!this.isProgress(progress)) {
            return null;
        }

        return progress.dataset.progressType || 'primary';
    }

    static setIndeterminate(progress, indeterminate = true)
    {
        if (!this.isProgress(progress)) {
            return;
        }

        progress.dataset.progressIndeterminate =
            indeterminate ? 'true' : 'false';

        progress.setAttribute(
            'aria-busy',
            indeterminate ? 'true' : 'false'
        );
    }

    static isIndeterminate(progress)
    {
        if (!this.isProgress(progress)) {
            return false;
        }

        return progress.dataset.progressIndeterminate === 'true';
    }

    static reset(progress)
    {
        if (!this.isProgress(progress)) {
            return;
        }

        this.setValue(progress, 0);
    }

    static updateIndicator(progress, value, max)
    {
        const indicator = progress.querySelector(
            '[data-progress-indicator]'
        );

        if (!indicator || max <= 0) {
            return;
        }

        const percentage = Math.min(
            100,
            Math.max(0, (value / max) * 100)
        );

        indicator.style.width = `${percentage}%`;
    }

    static getPercentage(progress)
    {
        if (!this.isProgress(progress)) {
            return null;
        }

        const value = this.getValue(progress);
        const max = this.getMax(progress);

        if (value === null || max === null || max <= 0) {
            return null;
        }

        return Math.min(
            100,
            Math.max(0, (value / max) * 100)
        );
    }

    static isProgress(progress)
    {
        return progress instanceof HTMLElement &&
            progress.matches(
                '[data-redsky-component="progress"]'
            );
    }

    static parseValue(value, fallback)
    {
        const parsed = parseFloat(value);

        return Number.isNaN(parsed)
            ? fallback
            : parsed;
    }

    static dispatchChangeEvent(progress, value, max)
    {
        const percentage = Math.min(
            100,
            Math.max(0, (value / max) * 100)
        );

        progress.dispatchEvent(
            new CustomEvent('progress:change', {
                detail: {
                    value,
                    max,
                    percentage
                }
            })
        );
    }
}

window.Progress = Progress;

document.addEventListener('DOMContentLoaded', () => {
    Progress.initialize();
});

