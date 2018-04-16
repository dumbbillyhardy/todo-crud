import {getAuthUrl, authenticated} from './dropbox-storage.js';
import {QueryMixin} from './query-mixin.js';
import {html, render} from './node_modules/lit-html/lib/lit-extended.js';

export class DropboxAuthButton extends QueryMixin(HTMLElement) {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.authUrl = getAuthUrl();
        authenticated.then(() => {
            this.fire('auth-success');
        });
        this.render();
    }

    static get is() {
        return "dropbox-auth-button";
    }

    render() {
        render(html`
            <a href=${this.authUrl}>Authenticate with Dropbox</a>
        `, this.shadowRoot);
    }
}
customElements.define(DropboxAuthButton.is, DropboxAuthButton);
