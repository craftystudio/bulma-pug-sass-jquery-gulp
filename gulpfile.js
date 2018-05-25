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
var connect = require('gulp-connect');
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
});

//styles
gulp.task('css', function() {
  return gulp.src(['sass/**/*.*', '!sass/node_modules/**/*.*', '!sass/package-lock.json'])
    .pipe(plumber())
    .pipe(sass({ style: 'expanded' }))
    .pipe(autoprefixer('last 2 version'))
    .pipe(gulp.dest('_public/css'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(minifycss())
    .pipe(gulp.dest('_public/css'))
});

//js
gulp.task('js', function() {
  return gulp.src(['js/node_modules/jquery/dist/jquery.js', 'js/*.js'])
    .pipe(plumber())
    .pipe(concat('script.js'))
    .pipe(gulp.dest('_public/js'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify({ mangle: false }))
    .pipe(gulp.dest('_public/js'))
});

//images
gulp.task('img', function() {
  return gulp.src('img/*')
    .pipe(plumber())
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest('_public/img'))
});

//clean _public
gulp.task('clean', function(cb) {
  del(['_public/*', '_public/css/*', '_public/js/*', '_public/img/*'], cb)
});

//live reload / watch
gulp.task('watch', function() {
  gulp.watch('sass/**/*.*', ['css']);
  gulp.watch(['**/*.pug', 'html/**/*.pug'], ['html']);
  gulp.watch('js/**/*.js', ['js']);
  gulp.watch('img/**/*.*', ['img']);
  gulp.watch('_public/**/*', ['livereload']);
  
});

//live reload
gulp.task('livereload', function() {
  gulp.src('_public/**/*')
    .pipe(connect.reload());
});

//server
gulp.task('server', function() {
  connect.server({
    root: '_public',
    livereload: true,
    port: 9000
  });
});

//def
gulp.task('default', ['server', 'watch', 'html', 'css', 'js', 'img'], function() {
  gulp.start('css', 'js', 'img', 'html');
});



