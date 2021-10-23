// var gulp = require('gulp');
// var sass = require('gulp-sass');
// var browserSync = require('browser-sync').create();

// gulp.task('styles', function(){
// 	gulp.src('./scss/style.scss')
// 		.pipe(sass())
// 		.pipe(gulp.dest('./css'))
// 		.pipe(browserSync.reload({stream: true}));
// });

// gulp.task('serve', function (){
// 	browserSync.init({
// 		server: {
// 			baseDir: './'
// 		}
// 	})
// });

// gulp.watch('./scss/*.scss', ['styles']);
// gulp.watch('./**/*.html').on('change', browserSync.reload);
// gulp.watch('./**/*.js').on('change', browserSync.reload);

// gulp.task('default', ['styles', 'serve']);

const { src, dest, watch, series } = require("gulp");
var sass = require("gulp-sass")(require("sass"));
const browsersync = require("browser-sync").create();

// Sass Task
function scssTask() {
  return src("./scss/style.scss").pipe(sass()).pipe(dest("./css"));
}

function browsersyncServe(cb) {
  browsersync.init({
    server: {
      baseDir: ".",
    },
  });
  cb();
}

function browsersyncReload(cb) {
  browsersync.reload();
  cb();
}

// Watch Task
function watchTask() {
  watch(["*.html", "*.js"], browsersyncReload);
  watch("**/*.scss", series(scssTask, browsersyncReload));
}

exports.default = series(scssTask, browsersyncServe, watchTask);
