export class Todo {
    constructor(content, done) {
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
export function toString(_this) {
    return `[${_this.done?'x':' '}] ${_this.content}`;
}
export function fromString(string) {
    const done = string[1] === 'x';
    const content = string.slice(4);
    return new Todo(content, done);
}
