//setup
var gulp = require('gulp'),
  sass = require('gulp-ruby-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  minifycss = require('gulp-minify-css'),
  uglify = require('gulp-uglify'),
  imagemin = require('gulp-imagemin'),
  rename = require('gulp-rename'),
  concat = require('gulp-concat'),
  notify = require('gulp-notify'),
  cache = require('gulp-cache'),
  livereload = require('gulp-livereload'),
  del = require('del');

//styles
gulp.task('css', function() {
  return gulp.src('sass/**/*.*')
    .pipe(sass({ style: 'expanded' }))
    .pipe(autoprefixer('last 2 version'))
    .pipe(gulp.dest('_public/css'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(minifycss())
    .pipe(gulp.dest('_public/css'))
    .pipe(notify({ message: 'SASS done.' }));
});

//js
gulp.task('js', function() {
  return gulp.src('js/*.js')
    .pipe(concat('script.js'))
    .pipe(gulp.dest('_public/js'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest('_public/js'))
    .pipe(notify({ message: 'SCRIPTS done.' }));
});

//images
gulp.task('img', function() {
  return gulp.src('img/*')
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest('_public/img'))
    .pipe(notify({ message: 'IMG done.' }));
});

//clean _public
gulp.task('clean', function(cb) {
  del(['_public/css/*', '_public/js/*', '_public/images/*'], cb)
});

//def
gulp.task('default', ['clean'], function() {
  gulp.start('css', 'js', 'img');
});


//live reload / watch
gulp.task('watch', function() {

  gulp.watch('sass/*.*', ['css']);

  gulp.watch('js/*.js', ['js']);

  gulp.watch('img/**/*', ['img']);

  livereload.listen();

  gulp.watch(['_public/**']).on('change', livereload.changed);

});