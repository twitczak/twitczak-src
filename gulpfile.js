var gulp = require('gulp'),
    sass = require('gulp-sass'),
    order = require('gulp-order'),
    concat = require('gulp-concat'),
    cleanCSS = require('gulp-clean-css'),
    merge = require('merge-stream'),
    i18n = require('gulp-html-i18n'),
    gm = require('gulp-gm'),
    newer = require('gulp-newer'),
    imagemin = require('gulp-imagemin'),
    del = require('del'),
    livereload = require('gulp-livereload');

var
  source = 'src/',
  dest = 'dist/';

var bootstrap = {
  in: './node_modules/bootstrap/'
};

var jquery = {
  in: './node_modules/jquery/'
};

var swiper = {
  in: './node_modules/swiper/'
};

var plyr = {
  in: './node_modules/plyr/'
};

var css = {
  in: [
    source + 'assets/css/**/*.css',
    swiper.in + 'dist/css/swiper.min.css',
    plyr.in + 'dist/plyr.css'
  ],
  out: dest + 'assets/css',
  watch: source + 'assets/css/**/*.css'
};

var scss = {
  in: source + 'assets/scss/*.scss',
  watch: source + 'assets/scss/**/*.scss',
  sassOpts: {
    outputStyle: 'nested',
    precison: 3,
    errLogToConsole: true,
    includePaths: [bootstrap.in + 'scss']
  }
};

var scripts = {
  in: [
    jquery.in + 'dist/jquery.min.js',
    bootstrap.in + 'dist/js/bootstrap.min.js',
    swiper.in + 'dist/js/swiper.min.js',
    plyr.in + 'dist/plyr.min.js',
    source + 'assets/js/*.js'
  ],
  out: dest + 'assets/js',
  watch: source + 'assets/js/**/*.js'
};

var images = {
  in: source + 'assets/images/**/*.{png,jpg,gif}',
  out: dest + 'assets/images',
  watch: source + 'assets/images/**/*'
};

var movies = {
  in: source + 'assets/movies/**/*',
  out: dest + 'assets/movies',
  watch: source + 'assets/movies/**/*'
};

var sounds = {
  in: source + 'assets/sounds/**/*',
  out: dest + 'assets/sounds',
  watch: source + 'assets/sounds/**/*'
};

var htmlOrder = ['header.html', 'menu.html', 'home.html', 'film-music.html', 'theatre-music.html',
                 'other.html', 'about-me.html', 'contact.html', 'footer.html'];

gulp.task('html', ['images', 'movies'], function() {
  return gulp.src(source + '*.html')
    .pipe(order(htmlOrder))
    .pipe(concat('index.html'))
    .pipe(i18n({
      langDir: source + 'lang',
      defaultLang: 'pl',
      createLangDirs: true
     }))
    .pipe(gulp.dest(dest))
    .pipe(livereload());
});

gulp.task('styles', function() {
  var scssStream = gulp.src(scss.in)
    .pipe(sass(scss.sassOpts).on('error', sass.logError))
    .pipe(concat('scss-files.scss'));

  var cssStream = gulp.src(css.in)
    .pipe(concat('css-files.css'));

  return merge(cssStream, scssStream)
    .pipe(concat('main.css'))
    //.pipe(cleanCSS())
    .pipe(gulp.dest(css.out))
    .pipe(livereload());
});

gulp.task('scripts', function() {
  return gulp.src(scripts.in)
    .pipe(concat('main.js'))
    .pipe(gulp.dest(scripts.out))
    .pipe(livereload());
});

gulp.task('images', function() {
  return gulp.src(images.in)
    .pipe(newer(images.out))
    .pipe(gm(function(gmfile) {
      return gmfile.resize('1920>');
    }))
    .pipe(imagemin())
    .pipe(gulp.dest(images.out))
    .pipe(livereload());
});

gulp.task('movies', function() {
  return gulp.src(movies.in)
    .pipe(gulp.dest(movies.out))
});

gulp.task('sounds', function() {
  return gulp.src(sounds.in)
    .pipe(gulp.dest(sounds.out))
});

gulp.task('watch', function() {
  livereload.listen();
  gulp.watch([scss.watch, css.watch], ['styles']);
  gulp.watch(scripts.watch, ['scripts']);
  gulp.watch(images.watch, ['images']);
  gulp.watch(source + '*.html', ['html']);
  gulp.watch(source + 'lang/**/*.json', ['html']);
});

gulp.task('clean', function(cb) {
  del(['dist'], cb);
});

gulp.task('build', ['styles', 'scripts', 'images', 'movies', 'sounds', 'html']);
