const path = require('path');

module.exports = {
    entry: './dropbox-app.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    mode: "development"
};
    //mode: "production"
