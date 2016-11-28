const gulp = require('gulp');
const ghPages = require('gulp-gh-pages');
const webpack = require('webpack-stream');

gulp.task('deploy', ['dist'], function () {
    return gulp.src('./dist/**/*')
        .pipe(ghPages());
});

gulp.task('pack', function () {
    return gulp.src('src/index.ts')
        .pipe(webpack(require('./webpack/webpack.config.js')))
        .pipe(gulp.dest('build/'));
});

gulp.task('dist', function () {
    return gulp.src('src/index.ts')
        .pipe(webpack(require('./webpack/webpack.production.config.js')))
        .pipe(gulp.dest('dist/'));
});