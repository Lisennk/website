var gulp = require('gulp'),
    rimraf = require('rimraf'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
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

gulp.task('build', function (cb) {
    return runSequence(
        'clean',
        'lib',
        'min',
        cb);
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

gulp.task('clean', ['clean:js', 'clean:lib', 'clean:dist']);

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

gulp.task('min', ['min:js']);

gulp.task('lib', ['clean:lib'], function () {
    var libs = [
        {
            src: [
                paths.npmDir + 'bootstrap/dist/**/fonts/*',
                paths.npmDir + 'bootstrap/dist/**/js/bootstrap.min.js'
            ],
            dest: paths.libDir + 'bootstrap'
        },
        {
            src: paths.npmDir + 'bootswatch/flatly/bootstrap.min.css',
            dest: paths.libDir + 'bootstrap/css'
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
