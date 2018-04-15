import {generateUUID} from './uuid-utils.js'

export class Todo {
    constructor(content, done) {
        this.id = generateUUID();
        this.content = content;
        this.done = done;
    }
    get content() {
        return this._content;
    }
    set content(content) {
        this._content = content;
    }
    toJSON() {
        return {
            id: this.id,
            content: this.content,
            done: this.done
        }
    }
    static fromJSON(json) {
        return new Todo(json.content, json.done);
    }
}
