const DEPLOY_DIR = './dist';

const COPIED_ASSETS = [
    "./node_modules/@webcomponents/webcomponentsjs/webcomponents-lite.js"
];

var argv = require('yargs').argv;
var clean = require('gulp-clean');
var ghPages = require('gulp-gh-pages');
var gulp = require('gulp');
var parse = require('parse-git-config');
var replace = require('gulp-replace');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');

gulp.task('default', ['copy-assets', 'copy-index', 'webpack']);

gulp.task('clean', () => {
    return gulp.src(DEPLOY_DIR)
        .pipe(clean());
});

gulp.task('copy-index', ['clean'], () => {
    return gulp.src('./index.html')
        .pipe(replace('todo-app.js', 'bundle.js'))
        .pipe(gulp.dest(DEPLOY_DIR));
});

gulp.task('copy-assets', ['clean'], () => {
    return gulp.src(COPIED_ASSETS, {base: './'})
        .pipe(gulp.dest(DEPLOY_DIR));
});

gulp.task('webpack', ['clean'], () => {
    return gulp.src('./todo-app.js')
        .pipe(webpackStream(require('./webpack.config.js'), webpack))
        .pipe(gulp.dest(DEPLOY_DIR))
});
    

gulp.task('gh-deploy', ['default'], () => {
    let gitConfig = parse.sync();
    let remote = gitConfig['remote "origin"'];
    if(!remote) {
        return Promise.reject('remote name does not exist in repository');
    }
    let remoteUrl = remote.url;
    if(!remoteUrl) {
        return Promise.reject('origin is not set in git');
    }
    return gulp.src(DEPLOY_DIR+'/**')
        .pipe(ghPages({
            remoteUrl,
            branch: 'gh-pages'
        }));
});
