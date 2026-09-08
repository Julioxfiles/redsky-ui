export default class DataGridPagination {

    constructor(config) {
        this.config = config;

        this.enabled = config.get('pagination', false);
        this.page = config.get('page', 1);
        this.perPage = config.get('perPage', 20);
        this.total = config.get('total', 0);
        this.pageList = config.get(
            'pageList',
            [10, 20, 50, 100]
        );
    }

    isEnabled() {
        return this.enabled;
    }

    getPage() {
        return this.page;
    }

    getPerPage() {
        return this.perPage;
    }

    getTotal() {
        return this.total;
    }

    getPageList() {
        return this.pageList;
    }

    getPages() {
        if (this.total <= 0) {
            return 0;
        }

        return Math.ceil(this.total / this.perPage);
    }

    hasPrevious() {
        return this.page > 1;
    }

    hasNext() {
        return this.page < this.getPages();
    }

    getOffset() {
        return (this.page - 1) * this.perPage;
    }

    setPage(page) {
        page = Number(page);

        if (!Number.isInteger(page) || page < 1) {
            throw new Error(
                'Page must be a positive integer.'
            );
        }

        this.page = Math.min(
            page,
            Math.max(this.getPages(), 1)
        );

        return this;
    }

    setPerPage(perPage) {
        perPage = Number(perPage);

        if (!Number.isInteger(perPage) || perPage < 1) {
            throw new Error(
                'Per-page value must be a positive integer.'
            );
        }

        this.perPage = perPage;
        this.setPage(this.page);

        return this;
    }

    setTotal(total) {
        total = Number(total);

        if (!Number.isInteger(total) || total < 0) {
            throw new Error(
                'Total must be a non-negative integer.'
            );
        }

        this.total = total;
        this.setPage(this.page);

        return this;
    }

    next() {
        if (this.hasNext()) {
            this.page++;
        }

        return this;
    }

    previous() {
        if (this.hasPrevious()) {
            this.page--;
        }

        return this;
    }

    first() {
        this.page = 1;

        return this;
    }

    last() {
        this.page = Math.max(this.getPages(), 1);

        return this;
    }
}