import {html, render} from './node_modules/lit-html/lib/lit-extended.js';
import {TodoList} from './todo-list.js';
import {TodoInput} from './todo-input.js';
import {Todo} from './todo.js';
import {QueryMixin} from './query-mixin.js';
import {parse, serialize} from './todo-storage.js';

export class TodoApp extends QueryMixin(HTMLElement) {
    constructor() {
        super();
        const childTypes = [TodoList, TodoInput]; //prevent tree shaking
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
        this.getSlotted("[slot=input]").addEventListener(TodoInput.createdEventName, this._createTodoListener);
        this.getSlotted("[slot=list]").addEventListener(TodoList.changedEventName, this._changedTodosListener);
    }
    disconnectedCallback() {
        this.getSlotted("[slot=input]").removeEventListener(TodoInput.createdEventName, this._createTodoListener);
        this.getSlotted("[slot=list]").removeEventListener(TodoList.changedEventName, this._changedTodosListener);
    }
    attributeChangedCallback(name, oldValue, newValue) {
        switch(name) {
            case("todos"):
                if(oldValue !== newValue) {
                    this._todos = this.parse(newValue);
                    this.fire('todos-changed', this.todos);
                    this.render();
                    this.getSlotted("[slot=list]").todos = this.todos;
                }
                break;
            case("title"):
                this.title = newValue;
                break;
        }
    }

    static get is() {
        return "todo-app";
    }
    static get observedAttributes() {
        return ["todos", "title"];
    }

    get todos() {
        return this._todos || [];
    }
    set todos(todos) {
        this._todos = todos;
        this.setAttribute("todos", this.serialize(todos));
    }
    get title() {
        return this._title;
    }
    set title(title) {
        this._title = title;
        this.render();
    }
    get editingTodo() {
        return this._editingTodo;
    }
    set editingTodo(todo) {
        this._editingTodo = todo;
        this.getSlotted("[slot=list]").todo = this.editingTodo;
        this.render();
    }

    render() {
        render(html`
            <style>
                todo-input {
                    display: block;
                    padding: 0.5rem;
                }
            </style>
            <h2>${this.title}</h2>
            <slot name="list">
                <todo-list slot="list"></todo-list>
            </slot>
            <slot name="input">
                <todo-input slot="input"></todo-input>
            </slot>
        `, this.shadowRoot);
    }
}
customElements.define(TodoApp.is, TodoApp);
