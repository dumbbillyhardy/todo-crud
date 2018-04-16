const path = require('path');

module.exports = {
    entry: './todo-app.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    }
};
