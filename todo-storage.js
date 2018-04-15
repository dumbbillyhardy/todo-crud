import {toString, fromString} from './todo.js';

export function serialize(todos) {
    return todos.reduce((acc, t) => acc+'\n'+toString(t), '');
}
export function parse(data) {
    //storage = window.localStorage.getItem(filename).trim() || '';
    return data.split('\n')
        .reduce((acc, x) => {
            if(x.trim()) {
                return acc.concat([x]);
            }
            return acc;
        }, [])
        .map((s) => fromString(s))
        .map((t, i) => {
            t.id = i;
            return t;
        });
}
