const API_KEY = "fpcdyqdlll231rq";

import {Dropbox} from 'dropbox';
import {parse, serialize} from './todo-storage.js';

var dropbox = new Dropbox({clientId: API_KEY});
window.dropbox = dropbox;
const authenticated = new Promise((resolve) => {
    const accessToken = window.localStorage.getItem("access_token");
    if(accessToken) {
        dropbox.accessToken = accessToken;
        resolve(dropbox);
        return;
    }
    const hashParams = new URLSearchParams(window.location.hash.replace("#", "?"));
    if(hashParams.has("access_token")) {
        dropbox.accessToken = hashParams.get("access_token");
        window.localStorage.setItem("access_token", dropbox.accessToken);
        resolve(dropbox);
        return;
    }
    open(dropbox.getAuthenticationUrl(window.location.origin + window.location.pathname));
});


export function listTodoLists() {
    return authenticated.then((dropbox) => dropbox.filesListFolder({path: ''}));
}
export function writeTodoList(list, todos) {
    return authenticated
        .then((dropbox) => {
            const contents = new Blob([serialize(todos)], {type: "text/plain"});
            return dropbox.filesUpload({
                path: `/${list}.txt`,
                mode: {
                    ".tag": "overwrite",
                },
                contents
            })
        });
}
export function readTodoList(list) {
    return authenticated
        .then((dropbox) => {
            return dropbox.filesDownload({path: `/${list}.txt`})
        })
        .then((content) => {
            const reader = new FileReader();
            return new Promise((resolve) => {
                reader.onload = function(e) {
                    reader.onload = undefined;
                    resolve(parse(reader.result));
                };
                reader.readAsBinaryString(content.fileBlob);
            });
        });
}

