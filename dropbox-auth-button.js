import {getAuthUrl, authenticated} from './dropbox-storage.js';
import {html, render} from './node_modules/lit-html/lib/lit-extended.js';

export class DropboxAuthButton extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.authUrl = getAuthUrl();
        authenticated.then(() => {
            this.setAttribute("hidden", "");
        });
        this.render();
    }

    static get is() {
        return "dropbox-auth-button";
    }

    render() {
        render(html`
            <button><a href=${this.authUrl}>Authenticate with Dropbox</a></button>
        `, this.shadowRoot);
    }
}
customElements.define(DropboxAuthButton.is, DropboxAuthButton);
