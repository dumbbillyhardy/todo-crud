import {TodoList} from './todo-list.js';
import {html, render} from './node_modules/lit-html/lib/lit-extended.js';
import {repeat} from './node_modules/lit-html/lib/repeat.js';

class SubClass extends TodoList {
    static get is() {
        return "todo-list-subclass";
    }
    render() {
        render(html`
            ${repeat(this.todos, (todo) => html`
                <todo-item 
                    test
                    todo=${todo}
                    on-todo-changed=${this._todoListener}
                    on-todo-deleted=${this._deleteListener}>
                </todo-item>
            `)}
        `, this.shadowRoot);
    }
}
customElements.define(SubClass.is, SubClass);
