import {html, render} from './node_modules/lit-html/lib/lit-extended.js';
import {repeat} from './node_modules/lit-html/lib/repeat.js';
import {FileItem} from './file-item.js';
import {QueryMixin} from './query-mixin.js';

export class FileList extends QueryMixin(HTMLElement) {
    constructor() {
        super();
        const children = [FileItem];
        this.attachShadow({mode: 'open'});
        this._fileListener = (e) => {
            this.fire("todo-chosen", e.detail);
        };
        this.render();
    }
    static get is() {
        return "file-list";
    }

    get files() {
        return this._files || [];
    }
    set files(files) {
        this._files = files;
        this.render();
    }
    render() {
        render(html`
            ${repeat(this.files, (f) => html`<file-item file=${f} on-file-click=${this._fileListener}></file-item>`)}
        `, this.shadowRoot);
    }
}
customElements.define(FileList.is, FileList);
