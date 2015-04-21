var gulp = require('gulp');
var lazypipe = require('lazypipe');
var source = require('vinyl-source-stream');

var sixtofiveify = require('6to5ify');
var reactify = require('reactify');
var watchify = require('watchify');
var browserify = require('browserify');

var $ = require('gulp-load-plugins')();

var build = lazypipe()
  .pipe($.size)
  .pipe(gulp.dest, './build');

function bundler(watch) {

  var a = watch ? watchify.args : undefined;
  var w = watch ? watchify : function(x) {return x};

  var bundler = w(browserify('./src/js/app.jsx', a))
    .transform(reactify)
    .transform(sixtofiveify);

  var bundle = function() {
    console.log('Browserify - rebuilding!');

    return bundler.bundle()
      .on('error', function (err) {
          console.error(err.message);
          this.emit("end");
      })
      .pipe(source('./src/js/app.jsx'))
      .pipe($.buffer())
      .pipe($.sourcemaps.init({loadMaps: true}))
        .pipe($.streamify($.uglify()))
        .pipe($.rename('bundle.js'))

      .pipe($.sourcemaps.write('./'))
      .pipe(build());
  }

  if(watch) {
    // On updates recompile
    bundler.on('update', bundle);
  }

  return bundle();
}

gulp.task('watchify', function() {
  return bundler(true);
});

gulp.task('scripts', function() {
  return bundler(false);
});

gulp.task('style', function(){
  return gulp.src('./src/css/main.scss')
    .pipe($.sass())
    .pipe(build());
});

gulp.task('webserver', ['watchify', 'style'], function() {
  gulp.src('./')
    .pipe($.webserver({
      livereload: {
        enable: true,
        filter: function(filename) {
          return /(build|index\.html)/.test(filename);
        }
      },
      directoryListing: true,
      open: false,
    }));
});

gulp.task('production', function() {
  process.env.NODE_ENV = 'production';
});

gulp.task('default', ['production', 'scripts', 'style'], function() {});

gulp.task('watch', ['webserver'], function() {
  gulp.watch('./src/css/*.scss', ['style']);
});