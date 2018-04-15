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
        this.parse = parse;
        this.serialize = serialize;
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
        this.getSlotted(TodoInput.is).addEventListener(TodoInput.createdEventName, this._createTodoListener);
        this.getSlotted(TodoList.is).addEventListener(TodoList.changedEventName, this._changedTodosListener);
    }
    disconnectedCallback() {
        this.getSlotted(TodoInput.is).removeEventListener(TodoInput.createdEventName, this._createTodoListener);
        this.getSlotted(TodoList.is).removeEventListener(TodoList.changedEventName, this._changedTodosListener);
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if(name === "todos") {
            if(oldValue !== newValue) {
                this._todos = this.parse(newValue);
                this.fire('todos-changed', this.todos);
                this.render();
                this.getSlotted(TodoList.is).todos = this.todos;
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
        this.setAttribute("todos", this.serialize(todos));
    }
    get editingTodo() {
        return this._editingTodo;
    }
    set editingTodo(todo) {
        this._editingTodo = todo;
        this.getSlotted(TodoInput.is).todo = this.editingTodo;
        this.render();
    }

    render() {
        render(html`
            <slot name="list">
                <todo-list></todo-list>
            </slot>
            <slot name="input">
                <todo-input></todo-input>
            </slot>
        `, this.shadowRoot);
    }
}
customElements.define(TodoApp.is, TodoApp);
