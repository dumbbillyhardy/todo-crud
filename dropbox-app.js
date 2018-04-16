import {html, render} from './node_modules/lit-html/lib/lit-extended.js';
import {TodoApp} from './todo-app.js';
import {FileList} from './file-list.js';
import {DropboxAuthButton} from './dropbox-auth-button.js';
import {writeTodoList, readTodoList, listTodoLists} from './dropbox-storage.js';

export class DropboxApp extends HTMLElement {
    constructor() {
        super();
        const childTypes = [TodoApp, DropboxAuthButton, FileList]; //prevent tree shaking
        this.attachShadow({mode: 'open'});
        this.listName = this.listName || "My First Todo";
        listTodoLists()
            .then((files) => {
                this.files = files.entries;
            });
        this._todosListener = (e) => {
            writeTodoList(this.listName, e.detail);
        };
        this._todoListChosen = (e) => {
            this.listName = e.detail.name;
        };
        this._authenticated = false
        this._authListener = (e) => {
            this._authenticated = true;
            this.render();
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
    get files() {
        return this._files || [];
    }
    set files(files) {
        this._files = files;
        this.render();
    }
    get listName() {
        const urlParams = new URLSearchParams(window.location.hash.replace("#", "?"));
        return urlParams.get('list');
    }
    set listName(listName) {
        const urlParams = new URLSearchParams(window.location.hash.replace("#", "?"));
        urlParams.set('list', listName);
        window.location.hash = urlParams.toString();
        readTodoList(listName)
            .then((todos) => {
                this.todos = todos;
            });
    }

    render() {
        render(html`
            <dropbox-auth-button
                on-auth-success=${this._authListener}
                hidden?=${this._authenticated}></dropbox-auth-button>
            <div hidden?=${!this._authenticated}>
                <todo-app 
                    todos=${this.todos}
                    title=${this.listName}
                    on-todos-changed=${this._todosListener}></todo-app>
                <file-list files=${this.files}
                    on-todo-chosen=${this._todoListChosen}></file-list>
            </div>
        `, this.shadowRoot);
    }
}
customElements.define(DropboxApp.is, DropboxApp);
