import {html, render} from './node_modules/lit-html/lib/lit-extended.js';
import {QueryMixin} from './query-mixin.js';

export class FileItem extends QueryMixin(HTMLElement) {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this._clickListener = (e) => {
            this.fire("file-click", this.file);
        };
        this.render();
    }
    static get is() {
        return "file-item";
    }

    get file() {
        return this._file || {};
    }
    set file(file) {
        this._file = file;
        //remove .txt
        this._file.name = this._file.name.replace(".txt", "");
        this.render();
    }
    render() {
        render(html`
            <div on-click=${this._clickListener}>${this.file.name}</div>
        `, this.shadowRoot);
    }
}
customElements.define(FileItem.is, FileItem);
