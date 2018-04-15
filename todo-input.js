import {html, render} from './node_modules/lit-html/lib/lit-extended.js';
import {QueryMixin} from './query-mixin.js';

export class TodoInput extends QueryMixin(HTMLElement) {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this._saveListener = (e) => {
            this.todo.content = this.$$("#text").value;
            this.todo.done = this.$$("#checkbox").checked;
            this.fire(TodoInput.createdEventName, this.todo);
        };
        this.todo = {};

    }
    attributeChangedCallback(name, oldValue, newValue) {
        this[name] = JSON.parse(newValue);
    }
    
    static get is() {
        return "todo-input";
    }
    static get createdEventName() {
        return "todo-input";
    }
    static get observedAttributes() {
        return ["todo"];
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
            <style>
                :host {
                    display: block;
                }
            </style>
            <input id="checkbox" type="checkbox" checked?="${this.todo.done}"/>
            <input id="text"     type="text"     value="${this.todo.content}"/>
            <button on-click="${this._saveListener}">Save</button>
        `, this.shadowRoot);
    }

}
customElements.define(TodoInput.is, TodoInput);
