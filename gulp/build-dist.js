'use strict';

var gulp = require('gulp');
var del = require('del');

var $ = require('gulp-load-plugins')();

gulp.task('partials', function () {
    return gulp.src('app/partials/**/*.html')
        .pipe($.minifyHtml({
            empty: true,
            spare: true,
            quotes: true
        }))
        .pipe($.ngHtml2js({
            moduleName: 'workingRoom',
            prefix: 'partials/'
        }))
        .pipe($.concat('partials.min.js'))
        .pipe($.uglify('partials.min.js'))
        .pipe(gulp.dest('dist/scripts'))
        .pipe($.size());
});

gulp.task('inject:dist', ['wiredep', 'partials', 'styles', 'scripts'], function () {
    return gulp.src('app/index.html')
        .pipe($.inject(gulp.src('app/scripts/**/*.js').pipe($.angularFilesort()), {
            addRootSlash: false,
            ignorePath: 'app'
        }))
        .pipe($.inject(gulp.src('.tmp/styles/**/*.css', {
            read: false
        }), {
            addRootSlash: false,
            ignorePath: '.tmp'
        }))
        .pipe($.inject(gulp.src('dist/scripts/partials.min.js', {
            read: false
        }), {
            name: 'partials',
            addRootSlash: false,
            ignorePath: 'dist'
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('html', ['inject:dist'], function () {
    var assets = $.useref.assets();

    return gulp.src('dist/index.html')
        .pipe(assets)
        .pipe($.if('*.js', $.ngAnnotate()))
        .pipe($.if('*.js', $.uglify()))
        .pipe($.if('*.css', $.minifyCss()))
        .pipe(assets.restore())
        .pipe($.useref())
        .pipe(gulp.dest('dist'))
        .pipe($.size());
});

gulp.task('minifyHtml', ['html'], function () {
    return gulp.src('dist/index.html')
        .pipe($.minifyHtml({
            empty: true,
            spare: true,
            quotes: true
        }))
        .pipe(gulp.dest('dist'))
        .pipe($.size());
});

gulp.task('favicon', function () {
    return gulp.src([
        'app/favicon.ico'
    ]).pipe(gulp.dest('dist'));
});

gulp.task('images', function () {
    return gulp.src('app/images/**/*')
        .pipe($.imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        }))
        .pipe(gulp.dest('dist/images'))
        .pipe($.size());
});

gulp.task('build:dist', ['clean', 'minifyHtml', 'images', 'favicon']);

gulp.task('clean', function (cb) {
    del(['dist/**/*'], cb);
});
