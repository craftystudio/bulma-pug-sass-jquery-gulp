//setup
var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var minifycss = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var plumber = require('gulp-plumber');
var notify = require('gulp-notify');
var cache = require('gulp-cache');
var pug = require('gulp-pug');
var livereload = require('gulp-livereload');
var del = require('del');

//html
gulp.task('html', function() {
    return gulp.src(['**/*.pug', '!node_modules/**'])
      .pipe(plumber())
      .pipe(pug({pretty:false, doctype:'HTML'}))
      .pipe(gulp.dest('_public'))
      .pipe(notify({ message: 'HTML done.' }));
});

//styles
gulp.task('css', function() {
  return gulp.src('sass/**/*.*')
    .pipe(plumber())
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
    .pipe(plumber())
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
    .pipe(plumber())
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest('_public/img'))
    .pipe(notify({ message: 'IMG done.' }));
});

//clean _public
gulp.task('clean', function(cb) {
  del(['_public/css/*', '_public/js/*', '_public/images/*'], cb)
});

//def
gulp.task('default', ['clean', 'html', 'css', 'js', 'img'], function() {
  gulp.start('css', 'js', 'img');
});


//live reload / watch
gulp.task('watch', function() {

  gulp.watch('*/*.pug', ['html']);

  gulp.watch('sass/*.*', ['css']);

  gulp.watch('js/*.js', ['js']);

  gulp.watch('img/**/*', ['img']);

  livereload.listen();

  gulp.watch(['_public/**']).on('change', livereload.changed);

});