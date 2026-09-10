export default class DataGridAjax {

    constructor(config) {
        this.config = config;

        const ajax = config.get('ajax', null);

        this.enabled = ajax !== null;
        this.url = ajax?.url ?? null;
        this.method = (
            ajax?.method ?? 'GET'
        ).toUpperCase();
        this.params = ajax?.params ?? {};
    }

    isEnabled() {
        return this.enabled;
    }

    getUrl() {
        return this.url;
    }

    getMethod() {
        return this.method;
    }

    getParams() {
        return this.params;
    }

    setParams(params) {
        this.params = params;

        return this;
    }

    async request(params = {}) {
        if (!this.enabled || !this.url) {
            throw new Error(
                'RedSky DataGrid AJAX is not configured.'
            );
        }

        const requestParams = {
            ...this.params,
            ...params
        };

        const options = {
            method: this.method,
            headers: {
                'Accept': 'application/json'
            }
        };

        if (this.method === 'GET') {
            const url = new URL(
                this.url,
                window.location.origin
            );

            Object.entries(requestParams).forEach(
                ([key, value]) => {
                    url.searchParams.set(key, value);
                }
            );

            const response = await fetch(
                url.toString(),
                options
            );

            return this.handleResponse(response);
        }

        options.headers['Content-Type'] =
            'application/json';

        options.body = JSON.stringify(
            requestParams
        );

        const response = await fetch(
            this.url,
            options
        );

        return this.handleResponse(response);
    }

    async handleResponse(response) {
        if (!response.ok) {
            throw new Error(
                `DataGrid AJAX request failed: ${response.status}`
            );
        }

        return response.json();
    }
}