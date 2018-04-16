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
            const todo = e.detail;
            const todos = this.todos.map((t) => {
                if(t.id === todo.id) {
                    return todo;
                }
                return t;
            });
            this.fire(TodoList.changedEventName, todos);
        };
        this._deleteListener = (e) => {
            const todos = this.todos.reduce((acc, t) => {
                if(t.id === e.detail.id) {
                    return acc;
                }
                return acc.concat([t]);
            }, []);
            this.fire(TodoList.changedEventName, todos);
        };
    }

    static get is() {
        return "todo-list";
    }
    static get changedEventName() {
        return "todos-changed";
    }

    get todos() {
        return this._todos;
    }
    set todos(todos) {
        this._todos = todos;
        this.render();
    }

    render() {
        render(html`
            <style>
                todo-item {
                    display: block;
                    padding: 0.5rem;
                }
            </style>
            ${repeat(this.todos, (todo) => html`
                <todo-item 
                    todo=${todo}
                    on-todo-changed=${this._todoListener}
                    on-todo-deleted=${this._deleteListener}>
                </todo-item>
            `)}
        `, this.shadowRoot);
    }

}
customElements.define(TodoList.is, TodoList);
