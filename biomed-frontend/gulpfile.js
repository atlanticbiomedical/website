var gulp        = require('gulp');
var clean       = require('gulp-clean');
var concat      = require('gulp-concat');
var uglify      = require('gulp-uglify');
var ngAnnotate  = require('gulp-ng-annotate');
var sourcemaps  = require('gulp-sourcemaps');
var templates   = require('gulp-angular-templatecache');
var streams     = require('event-stream');
var sass        = require('gulp-sass');
var plumber     = require('gulp-plumber');

gulp.task('default', ['build']);

gulp.task('build', ['js', 'vendor', 'html', 'styles', 'assets']);

gulp.task('clean', function() {
    gulp.src('build')
        .pipe(clean());
});

gulp.task('vendor', function() {
    gulp.src([
            'vendor/jquery/dist/jquery.min.js',
            'vendor/angular/angular.min.js',
            'vendor/foundation/js/vendor/modernizr.js',
            'vendor/foundation/js/foundation.js',
            'vendor/foundation/js/foundation/foundation.abide.js',
            'vendor/foundation/js/foundation/foundation.clearing.js',
            'vendor/angular-loading-bar/build/loading-bar.js',
            'vendor/angular-resource/angular-resource.js',
            'vendor/angular-sanitize/angular-sanitize.js',
            'vendor/angular-ui-router/release/angular-ui-router.js',
            'vendor/angular-foundation/mm-foundation.min.js',
            'vendor/angular-foundation/mm-foundation-tpls.min.js',
            'vendor/lodash/dist/lodash.js',
            'vendor/masonry/dist/masonry.pkgd.js',
            'vendor/angular-masonry/angular-masonry.js',
            'vendor/imagesloaded/imagesloaded.pkgd.js',
            'vendor/jquery-colorbox/jquery.colorbox.js'
        ])
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(concat('vendor.js'))
        .pipe(sourcemaps.write({sourceRoot: '/vendor'}))
        .pipe(gulp.dest('build'));
});

gulp.task('js', function() {
    var html = gulp.src(['src/**/*.html', '!src/index.html'])
        .pipe(sourcemaps.init())
        .pipe(templates({ standalone: true }));

    var js = gulp.src(['src/**/index.js', 'src/**/*.js'])
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(concat('src.js'))
        .pipe(ngAnnotate())
        .pipe(uglify());

    streams.merge(html, js)
        .pipe(concat('app.js'))
        .pipe(sourcemaps.write({sourceRoot: '/src'}))
        .pipe(gulp.dest('build'));
});

gulp.task('styles', function() {
    var processWinPath = function(file) {
        var path = require('path');
        if (process.platform === 'win32') {
            file.path = path.relative('.', file.path);
            file.path = file.path.replace(/\\/g, '/');
        }
    };

    gulp.src([
            'src/styles/styles.scss',
        ])
        .on('data', processWinPath)
        .pipe(plumber())
        .pipe(sass({
            includePaths: [
                'vendor/foundation/scss',
                'vendor/font-awesome/scss'
            ],
//            sourceComments: 'map'
        }))
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(concat('styles.css'))
        .pipe(sourcemaps.write({sourceRoot: '/src/../'}))
        .pipe(gulp.dest('build'));
});

gulp.task('html', function() {
    gulp.src('src/index.html')
        .pipe(gulp.dest('build'));
});

gulp.task('assets', function() {
    gulp.src('src/assets/**/*')
        .pipe(gulp.dest('build/assets'));
});

gulp.task('watch', ['js'], function() {
    gulp.watch('src/**/*.js', ['js']);
});

function startExpress() {
    var express = require('express');
    var request = require('request');
    var fs = require('fs');
    var app = express();

    app.use(require('connect-livereload')());

/*
    app.use('/api', express.static(__dirname + '/demo', {
        index: ['index.json']
    }));
    app.use('/demo', express.static(__dirname + '/demo'));
*/

    app.all('/api/*', function(req, res) {
        var url = 'http://atlanticbiomedical.com/' + req.url;
        req.pipe(request(url)).pipe(res);
    });

    app.all('/images/*', function(req, res) {
        var url = 'http://atlanticbiomedical.com/' + req.url;
        req.pipe(request(url)).pipe(res);
    });

    app.use(express.static('build'));

    app.all('/*', function(req, res) {
        res.sendFile('index.html', { root: 'build' });
    });

    app.listen(5000);
}

var lr;

function startLiveReload() {
    lr = require('tiny-lr')();
    lr.listen(35729);
}

function notifyLiveReload(event) {
    var filename = require('path').relative('build', event.path);

    lr.changed({
        body: {
            files: [filename]
        }
    });
}

gulp.task('server', ['build'], function() {
    startExpress();
    startLiveReload();

    gulp.watch(['src/**/*.js', 'src/**/*.html'], ['js', 'html']);
    gulp.watch('src/**/*.scss', ['styles']);
    gulp.watch('vendor/**/*', ['vendor', 'styles']);
    gulp.watch('src/assets/**/*', ['assets']);
    gulp.watch('build/**/*', notifyLiveReload);
});


