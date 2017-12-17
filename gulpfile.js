var gulp = require ('gulp'),
    hb = require('gulp-hb'),
    del = require('del'),
    livereload = require('gulp-livereload'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    gutil = require('gulp-util'),
    ftp = require('gulp-ftp'),
    rename = require('gulp-rename');

// express server
// view on host computer -> localhost:5000
// view on mobile device -> in command line of computer run ifconfig, look for en0, en1 etc and "inet" number. Use this number plus port
// e.g. 00.0.00.00:4000
gulp.task('express', function () {
    var express = require('express');
    var app = express();
    app.use(express.static(__dirname + '/dist', {
        'extensions': ['html']
    })); // _dirname is the root - expects index.html at root - defined in dist folder
    app.listen(5000);
});

// HANDLEBARS
// make data and partials available in project
// compile handlebars templates - place in dist as .html files
gulp.task('pages', function () {
    del('dist/**/*.html', function () {
        gulp.src('app/pages/**/*.hbs')
            .pipe(hb({
                data: 'app/data/*.json',
                partials: 'app/partials/*.hbs'
            }))
            .pipe(rename(function (path) {
                path.extname = '.html';
            }))
            .pipe(gulp.dest('dist/'))
            .pipe(livereload());
    });
});

//assets
gulp.task('assets', function () {
    del('dist/assets/**/*', function () {
        return gulp.src('app/assets/**/*')
            .pipe(gulp.dest('dist/assets/'))
            .pipe(livereload());
    });
});

//images
gulp.task('images', function () {
    del('dist/img/**/*', function () {
        return gulp.src('app/images/**/*')
            .pipe(gulp.dest('dist/img/'))
    });
    return gulp.src('app/images/**/*')
        .pipe(gulp.dest('dist/img/'))
});

//scripts
gulp.task('scripts', function () {
    del(['dist/scripts/**/*'], function () {
        return gulp.src(['app/scripts/**/*'])
            .pipe(gulp.dest('dist/js/'))
    });
});

//styles
gulp.task('styles', function () {
    return gulp.src('app/styles/**/*.scss')
        .pipe(sass())
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {
            cascade: true
        }))
        .pipe(gulp.dest('dist/css'))
        .pipe(livereload());
});

// GULP TASKS
// watch directories / files and update when changes are made
gulp.task('watch', function () {
    livereload.listen({
        start: true,
        host: 'localhost'
    });
    gulp.watch(['app/styles/**'], ['styles']);
    gulp.watch(['app/images/**'], ['images']);
    gulp.watch(['app/**/*.hbs'], ['pages']);
    gulp.watch(['app/data/*.json'], ['pages']);
    gulp.watch('app/js/**/*.js', ['scripts']);
});

gulp.task('default', ['build', 'express', 'watch'], function () {
    console.log('gulp is watching and will rebuild when changes are made...');
});

gulp.task('build', ['assets', 'images', 'scripts', 'styles', 'pages'], function () {
    console.log('Your development environment has been set up. Run gulp to watch and build your project!');
});

gulp.task('deploy', function () {
    return gulp.src('dist/**/*')
        .pipe(ftp({
            host: 'special.test.umh.ua',
            user: 'r.semak',
            pass: 'GotoroleS',
            remotePath: '/2017/HBS'
        }))
        .pipe(gutil.noop());
});
gulp.task('deployTest', function () {
    return gulp.src('dist/**/*')
        .pipe(ftp({
            host: 'special.test.umh.ua',
            user: 'r.semak',
            pass: 'GotoroleS',
            remotePath: '/2017/HBS/test'
        }))
        .pipe(gutil.noop());
});