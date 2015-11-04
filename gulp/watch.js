'use strict';

var gulp = require('gulp');

gulp.task('watch', ['build'], function () {
  gulp.watch('app/styles/**/*.scss', ['inject']);
  gulp.watch('app/scripts/**/*.js', ['inject', 'scripts']);
  gulp.watch('bower.json', ['wiredep']);
});

gulp.task('watch:dist', ['build:dist'], function () {
  gulp.watch('app/styles/**/*.scss', ['build:dist']);
  gulp.watch('app/scripts/**/*.js', ['build:dist']);
  gulp.watch('app/partials/**/*.html', ['build:dist']);
  gulp.watch('app/images/**/*', ['images']);
  gulp.watch('bower.json', ['build:dist']);
});
