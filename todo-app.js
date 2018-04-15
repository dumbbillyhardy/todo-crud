import {html, render} from './node_modules/lit-html/lib/lit-extended.js';
import {TodoList} from './todo-list.js';
import {TodoInput} from './todo-input.js';
import {Todo} from './todo.js';
import {QueryMixin} from './query-mixin.js';

export class TodoApp extends QueryMixin(HTMLElement) {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.render();
        this.todos = [];
        this._createTodoListener = (e) => {
            this.editingTodo = new Todo();
            this.todos.push(Todo.fromJSON(e.detail));
            this.todos = this.todos.slice();
        };
    }
    connectedCallback() {
        this.$$(TodoInput.is).addEventListener(TodoInput.createdEventName, this._createTodoListener);
    }
    disconnectedCallback() {
        this.$$(TodoInput.is).removeEventListener(TodoInput.createdEventName, this._createTodoListener);
    }

    static get is() {
        return "todo-app";
    }

    get todos() {
        return this._todos;
    }
    set todos(todos) {
        this._todos = todos;
        this.render();
    }
    get editingTodo() {
        return this._editingTodo;
    }
    set editingTodo(todo) {
        this._editingTodo = todo;
        this.render();
    }

    render() {
        render(html`
            <todo-list todos=${this.todos}></todo-list>
            <todo-input todo=${this.editingTodo}></todo-input>
        `, this.shadowRoot);
    }
}
customElements.define(TodoApp.is, TodoApp);
