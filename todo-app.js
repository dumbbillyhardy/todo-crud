import {html, render} from './node_modules/lit-html/lib/lit-extended.js';
import {TodoList} from './todo-list.js';
import {TodoInput} from './todo-input.js';
import {Todo} from './todo.js';
import {QueryMixin} from './query-mixin.js';
import {parse, serialize} from './todo-storage.js';

export class TodoApp extends QueryMixin(HTMLElement) {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.render();
        this._createTodoListener = (e) => {
            this.editingTodo = new Todo();
            const newTodo = Todo.fromJSON(e.detail);
            newTodo.id = this.todos.length;
            this.todos.push(newTodo);
            this.todos = this.todos.slice();
        };
        this._changedTodosListener = (e) => {
            this.todos = e.detail;
        };
    }
    connectedCallback() {
        this.$$(TodoInput.is).addEventListener(TodoInput.createdEventName, this._createTodoListener);
        this.$$(TodoList.is).addEventListener(TodoList.changedEventName, this._changedTodosListener);
    }
    disconnectedCallback() {
        this.$$(TodoInput.is).removeEventListener(TodoInput.createdEventName, this._createTodoListener);
        this.$$(TodoList.is).removeEventListener(TodoList.changedEventName, this._changedTodosListener);
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if(name === "todos") {
            if(oldValue !== newValue) {
                this._todos = parse(newValue);
                this.fire('todos-changed', {
                    detail: this.todos
                });
                this.render();
            }
        }
    }

    static get is() {
        return "todo-app";
    }
    static get observedAttributes() {
        return ["todos"];
    }

    get todos() {
        return this._todos || [];
    }
    set todos(todos) {
        this._todos = todos;
        this.setAttribute("todos", serialize(todos));
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
