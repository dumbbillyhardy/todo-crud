import {render, html} from './node_modules/lit-html/lit-html.js';
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
        return this.$$(TodoList.is).todos;
    }
    set todos(todos) {
        this.$$(TodoList.is).todos = todos;
    }
    get editingTodo() {
        return this._editingTodo;
    }
    set editingTodo(todo) {
        this._editingTodo = todo;
        this.render();
    }

    render() {
            //<todo-list todos="${JSON.stringify(this.todos)}"></todo-list>
        render(html`
            <todo-list></todo-list>
            <todo-input todo="${JSON.stringify(this.editingTodo)}"></todo-input>
        `, this.shadowRoot);
    }
}
customElements.define(TodoApp.is, TodoApp);
