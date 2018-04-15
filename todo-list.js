import {html, render} from './node_modules/lit-html/lib/lit-extended.js';
import {repeat} from './node_modules/lit-html/lib/repeat.js';
import {QueryMixin} from './query-mixin.js';
import {TodoItem} from './todo-item.js'
import {Todo} from './todo.js';

export class TodoList extends QueryMixin(HTMLElement) {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this._todoListener = (e) => {
            this.todos = this.todos
                .map((item) => {
                    if(item.id === e.detail.id) {
                        return e.detail;
                    }
                    return item;
                });
        };
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if(newValue) {
            this[name] = JSON.parse(newValue);
        }
    }
    
    static get is() {
        return "todo-list";
    }
    static get observedAttributes() {
        return [];
    }

    get todos() {
        return this._todos;
    }
    set todos(todos) {
        this._todos = todos;
        this.render();
    }

    render() {
        render(html`${repeat(this.todos, (todo) => html`<todo-item todo=${todo} on-todo-changed=${this._todoListener}></todo-item>`)}`, this.shadowRoot);
    }

}
customElements.define(TodoList.is, TodoList);
