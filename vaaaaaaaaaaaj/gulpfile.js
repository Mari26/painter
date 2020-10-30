var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync').create();

var config = {
    path: {
        scss: './public/scss/**/*.scss',
        js: './public/js/**/*.js',
        html: './public/index.html'
    },
    output: {
        cssName: 'css/style.min.css',
        jsName: 'js/script.min.js',
        path: './public'
    }
}

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
    return gulp.src(['node_modules/bootstrap/scss/bootstrap.scss', config.path.scss , 'public/scss/!*.scss'])
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(concat(config.output.cssName))
        .pipe(autoprefixer())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(config.output.path))
        .pipe(browserSync.stream())
});



// Move the javascript files into our /src/js folder
gulp.task('js', function() {
    return gulp.src([config.path.js, 'node_modules/bootstrap/dist/js/bootstrap.min.js', 'node_modules/jquery/dist/jquery.min.js', 'node_modules/popper.js/dist/umd/popper.min.js'])
        .pipe(gulp.dest("public/js"))
        .pipe(concat(config.output.jsName))
        .pipe(browserSync.stream());
});


// Static Server + watching scss/html files
gulp.task('serve', gulp.series('sass', function() {

    browserSync.init({
        server: "./public"
    });

    gulp.watch(['node_modules/bootstrap/scss/bootstrap.scss', 'public/scss/*.scss'], gulp.series('sass'));
    gulp.watch(config.path.scss, gulp.series('sass'));
    gulp.watch(config.path.html).on('change', browserSync.reload);
}));

gulp.task('default', gulp.parallel('sass','js','serve'));