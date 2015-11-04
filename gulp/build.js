'use strict';

var gulp = require('gulp');
var del = require('del');

var $ = require('gulp-load-plugins')();

gulp.task('styles', function() {
  return gulp.src('app/styles/**/*.scss')
    .pipe($.newer('.tmp/styles'))
    .pipe($.clipEmptyFiles())
    .pipe($.plumber())
    .pipe($.sass({
      errLogToConsole: true
    }))
    .pipe($.autoprefixer("last 1 versions"))
    .pipe($.plumber.stop())
    .pipe(gulp.dest('.tmp/styles'))
    .pipe($.size());
});

gulp.task('scripts', function() {
  return gulp.src('app/scripts/**/*.js')
    .pipe($.newer('app/scripts/'))
    .pipe($.plumber())
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.size());
});

gulp.task('inject', ['wiredep', 'styles', 'scripts'], function() {
  return gulp.src('app/index.html')
    .pipe($.plumber())
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
    .pipe(gulp.dest('app'));
});

gulp.task('build', ['inject']);
