var gulp = require('gulp'),
    rimraf = require('rimraf'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    cssmin = require('gulp-cssmin'),
    uglify = require('gulp-uglify'),
    less = require('gulp-less'),
    ghPages = require('gulp-gh-pages'),
    runSequence = require('run-sequence'),
    merge = require('merge-stream');

var paths = {};
paths.dist = './_site/';
paths.concatJsDest = './js/bit.min.js';
paths.libDir = './lib/';
paths.npmDir = './node_modules/';
paths.cssDir = './css/';
paths.jsDir = './js/';
paths.lessDir = './less/';

gulp.task('build', function (cb) {
    return runSequence(
        'clean',
        ['lib', 'less'],
        'min',
        cb);
});

gulp.task('clean:css', function (cb) {
    return rimraf(paths.cssDir, cb);
});

gulp.task('clean:js', function (cb) {
    return rimraf(paths.concatJsDest, cb);
});

gulp.task('clean:lib', function (cb) {
    return rimraf(paths.libDir, cb);
});

gulp.task('clean:dist', function (cb) {
    return rimraf(paths.dist, cb);
});

gulp.task('clean', ['clean:js', 'clean:lib', 'clean:dist', 'clean:css']);

gulp.task('min:js', ['clean:js'], function () {
    return gulp.src([
            paths.jsDir + '**/*.js',
            '!' + paths.jsDir + '**/*.min.js',
            paths.npmDir + 'animated-header/js/classie.js',
            paths.npmDir + 'animated-header/js/cbpAnimatedHeader.js'
         ], { base: '.' })
        .pipe(concat(paths.concatJsDest))
        .pipe(uglify())
        .pipe(gulp.dest('.'));
});

gulp.task('min:css', [], function () {
    return gulp.src([paths.cssDir + '**/*.css', '!' + paths.cssDir + '**/*.min.css'], { base: '.' })
        .pipe(cssmin())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('.'));
});

gulp.task('min', ['min:js', 'min:css']);

gulp.task('lib', ['clean:lib'], function () {
    var libs = [
        {
            src: [
                paths.npmDir + 'bootstrap/dist/**/fonts/*',
                paths.npmDir + 'bootstrap/dist/**/js/bootstrap.min.js',
                paths.npmDir + 'bootstrap/dist/**/css/bootstrap.min.css'
            ],
            dest: paths.libDir + 'bootstrap'
        },
        {
            src: [
                paths.npmDir + 'font-awesome/**/css/font-awesome.min.css',
                paths.npmDir + 'font-awesome/**/fonts/*'
            ],
            dest: paths.libDir + 'font-awesome'
        },
        {
            src: paths.npmDir + 'jquery/dist/jquery.min.js',
            dest: paths.libDir + 'jquery'
        }
    ];

    var tasks = libs.map(function (lib) {
        return gulp.src(lib.src).pipe(gulp.dest(lib.dest));
    });

    return merge(tasks);
});

gulp.task('deploy', [], function () {
    return gulp.src(paths.dist + '**/*')
        .pipe(ghPages({ cacheDir: './.publish' }));
});

gulp.task('lesscompile', function (cb) {
    return runSequence(
        'less',
        'min:css',
        cb);
});

gulp.task('less', function () {
    return gulp.src(paths.lessDir + 'styles.less')
        .pipe(less())
        .pipe(gulp.dest(paths.cssDir));
});

gulp.task('watch', function () {
    gulp.watch(paths.lessDir + '*.less', ['lesscompile']);
});
