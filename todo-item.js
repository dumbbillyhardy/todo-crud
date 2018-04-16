import {html, render} from './node_modules/lit-html/lib/lit-extended.js';
import {QueryMixin} from './query-mixin.js';

export class TodoItem extends QueryMixin(HTMLElement) {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.todo = {};
        this._inputListener = (e) => {
            this.todo.content = this.$$("#text").value;
            this.todo.done = this.$$("#checkbox").checked;
            this.fire(TodoItem.changedEventName, this.todo);
        };
        this._deleteListener = (e) => {
            this.fire(TodoItem.deletedEventName, this.todo);
        };
    }
    
    static get is() {
        return "todo-item";
    }
    static get changedEventName() {
        return "todo-changed";
    }
    static get deletedEventName() {
        return "todo-deleted";
    }
    static get observedAttributes() {
        return ["todo"];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        this[name] = JSON.parse(newValue);
    }

    get todo() {
        return this._todo;
    }
    set todo(todo) {
        this._todo = todo;
        this.render();
    }

    render() {
        render(html`
            <input id="checkbox"
                type="checkbox"
                checked="${this.todo.done}"
                on-change="${this._inputListener}"/>
            <input id="text"
                type="text"
                value="${this.todo.content}"
                on-input="${this._inputListener}"/>
            <button on-click="${this._deleteListener}">Delete</button>
        `, this.shadowRoot);
    }

}
customElements.define(TodoItem.is, TodoItem);
