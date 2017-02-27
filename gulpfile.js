'use strict'
const gulp        = require('gulp')
const browserSync = require('browser-sync')
const $           = require('gulp-load-plugins')()
const settings    = {
  files : {
    sass  : [
      './css/custom.scss'
    ],
    css   : [
      './css/bootstrap.css',
      './css/custom.css'
    ],
    js    : [
      './js/jquery.js',
      './js/bootstrap.js',
      './js/custom.js'
    ],
    fonts : [
      './fonts/config.neon'
    ]
  }
}

function watchErrors () {
  return $.plumber(function (err) {
    $.util.beep()
    $.util.log($.util.colors.red(err))
    this.emit('end')
  })
}

gulp.task('sass', () => {
  return gulp.src(settings.files.sass)
             .pipe(watchErrors())
             .pipe($.sass())
             .pipe(gulp.dest('./css'))
})

gulp.task('css', [ 'sass' ], () => {
  return gulp.src(settings.files.css)
             .pipe(watchErrors())
             .pipe($.sourcemaps.init({
               loadMaps : true
             }))
             .pipe($.cssretarget({
               root   : './dist',
               silent : true
             }))
             .pipe($.concat('styles.css'))
             .pipe($.cssnano({
               discardComments : { removeAll : true },
               autoprefixer    : {
                 browsers : [
                   'last 2 versions'
                 ],
                 add      : true
               }
             }))
             .pipe($.sourcemaps.write('./maps'))
             .pipe(gulp.dest('./dist/css'))
})

gulp.task('js', () => {
  return gulp.src(settings.files.js)
             .pipe(watchErrors())
             .pipe($.sourcemaps.init({
               loadMaps : true
             }))
             .pipe($.concat('scripts.min.js'))
             // .pipe($.stripDebug())
             .pipe($.babel({
               presets  : [ 'es2015' ],
               compact  : true,
               minified : false,
               comments : false
             }))
             .pipe($.sourcemaps.write('./maps'))
             .pipe(gulp.dest('./dist/js'))
})

gulp.task('fonts', () => {
  return gulp.src(settings.files.fonts)
             .pipe(watchErrors())
             .pipe($.googleFonts())
             .pipe($.cssnano({
               discardComments : { removeAll : true },
               discardUnused   : false
             }))
             .pipe(gulp.dest('./dist/fonts'))
})

gulp.task('browserSync', [ 'default' ], () => {
  browserSync.init({
    proxy : 'http://words.mab.loc/'
  })
  gulp.watch(settings.files.sass, [ 'css' ])
})

gulp.task('default', [
  'css',
  'js',
  'fonts'
], () => {
  console.log('Acceptable outcome')
})
