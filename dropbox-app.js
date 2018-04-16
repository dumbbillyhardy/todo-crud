import {html, render} from './node_modules/lit-html/lib/lit-extended.js';
import {TodoApp} from './todo-app.js';
import {DropboxAuthButton} from './dropbox-auth-button.js';
import {writeTodoList, readTodoList} from './dropbox-storage.js';

export class DropboxApp extends HTMLElement {
    constructor() {
        super();
        const childTypes = [TodoApp, DropboxAuthButton]; //prevent tree shaking
        this.attachShadow({mode: 'open'});
        this.listName = this.getListName();
        readTodoList(this.listName)
            .then((todos) => {
                this.todos = todos;
                this.render();
            });
        this._todosListener = (e) => {
            writeTodoList(this.listName, e.detail);
        };
        this.render();
    }
    static get is() {
        return "dropbox-app";
    }

    get todos() {
        return this._todos || [];
    }
    set todos(todos) {
        this._todos = todos;
        this.render();
    }
    getListName() {
        const urlParams = new URLSearchParams(window.location.hash.replace("#", "?"));
        let list = urlParams.get('list');
        if(!list) {
            list = "My First Todo";
            urlParams.set('list', list);
            window.location.hash = urlParams.toString();
        }
        return list;
    }
    render() {
        render(html`
            <dropbox-auth-button></dropbox-auth-button>
            <todo-app 
                todos=${this.todos}
                title=${this.listName}
                on-todos-changed=${this._todosListener}></todo-app>
        `, this.shadowRoot);
    }
}
customElements.define(DropboxApp.is, DropboxApp);
