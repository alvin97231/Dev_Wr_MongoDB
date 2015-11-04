'use strict';

var gulp = require('gulp');

var wiredep = require('wiredep').stream;

// inject bower components
gulp.task('wiredep', function () {
  return gulp.src('app/*.html')
  
    .pipe(wiredep({
      directory: 'app/bower_components'
    }))
    .pipe(gulp.dest('app'));
});
