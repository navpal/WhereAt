const gulp = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const babel = require('gulp-babel');

gulp.task('styles', () => {
	return gulp.src('./dev/styles/**/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(concat('style.css'))
		.pipe(gulp.dest('./public/styles'))
});

gulp.task('browser-sync', () => {
	browserSync.init({
		server: '.'
	});
});

gulp.task('default', ['styles', 'browserSync'], () => {
	gulp.watch('./dev/styles/**/*.scss', ['styles']);
	gulp.watch('*.html', reload)

})