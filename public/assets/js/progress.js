class Progress
{
    static initialize()
    {
        const progressBars = document.querySelectorAll(
            '[data-redsky-component="progress"]'
        );

        progressBars.forEach(progress => {
            const value = parseFloat(
                progress.dataset.progressValue || '0'
            );

            const max = parseFloat(
                progress.dataset.progressMax || '100'
            );

            this.updateIndicator(progress, value, max);
        });
    }

    static setValue(progress, value)
    {
        if (!progress) {
            return;
        }

        const max = parseFloat(
            progress.dataset.progressMax || '100'
        );

        value = parseFloat(value);

        if (Number.isNaN(value)) {
            return;
        }

        value = Math.max(0, Math.min(value, max));

        progress.dataset.progressValue = value;
        progress.setAttribute('aria-valuenow', value);

        this.updateIndicator(progress, value, max);
    }

    static getValue(progress)
    {
        if (!progress) {
            return null;
        }

        return parseFloat(
            progress.dataset.progressValue || '0'
        );
    }

    static setMax(progress, max)
    {
        if (!progress) {
            return;
        }

        max = parseFloat(max);

        if (Number.isNaN(max) || max <= 0) {
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
    }

    static updateIndicator(progress, value, max)
    {
        const indicator = progress.querySelector(
            '[data-progress-indicator]'
        );

        if (!indicator) {
            return;
        }

        const percentage = Math.min(
            100,
            Math.max(0, (value / max) * 100)
        );

        indicator.style.width = `${percentage}%`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    Progress.initialize();
});