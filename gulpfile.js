const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
// style.scssの監視タスクを作成する
gulp.task('default', function () {

		gulp.task('scss', function() {
				gulp.src('./public/css/style.scss')
				.pipe(sass({
						outputStyle: 'expanded'
				})
				.on('error', sass.logError))
				.pipe(gulp.dest('./public/css'));
		});

		gulp.task('browser-sync', function() {
				browserSync({
						server: {
								baseDir: "./views/"       //対象ディレクトリ
						}
				});
		});

		gulp.task('bs-reload', function () {
				browserSync.reload();
		});

		gulp.watch("./views/**/*.hbs", ['bs-reload']);
		gulp.watch("./views/*.hbs", ['bs-reload']);
		gulp.watch('./public/css/*.scss', ['scss']);
});






