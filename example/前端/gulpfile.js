var gulp = require('gulp'),
    rjs = require('gulp-requirejs'),
    uglify = require('gulp-uglify'),
    cssmin = require('gulp-minify-css'),
    watch = require('gulp-watch'),
    livereload = require('gulp-livereload');
var Q = require('q')
var paths = {
    scripts: ['src/js/*.js'],
    css: 'src/css/page/*.css',
    imgs: "src/css/imgs/*.*"
};
gulp.task('js', function() {
    return gulp.src(paths.scripts).pipe(uglify()).pipe(gulp.dest('dist/js'));;
});
gulp.task('css', function() {
    return gulp.src(paths.css)
        .pipe(cssmin())
        .pipe(gulp.dest('dist/css/page'));
});
gulp.task('img', function() {
    return gulp.src(paths.imgs)
        .pipe(gulp.dest('dist/css/imgs'));
});

var rjsconfig = {
    "baseUrl": "src/js",
    shim: {
        // standard require.js shim options
    },
    "paths": {
        $: 'jquery',
        'scroll-load': 'lib/scroll-load/scroll-load',
        'dialog': 'lib/dialog/dialog',
        'mobile-upload': 'lib/upload/mobile-upload',
        'upload': 'lib/upload/upload',
        'handlebars': 'lib/handlebars/handlebars-v3.0.0',
        'carousel-image': 'lib/carousel-image/carousel-image',
        'serializejson': 'lib/serializejson/jquery.serializejson',
        'area': "lib/area/area",
        'calendar': 'lib/calendar/calendar',
        'table': 'lib/table/table',
        'paging': 'lib/paging/paging',
        "query": 'lib/query/query',
        'coolautosuggest': 'lib/coolautosuggest/coolautosuggest',
        'category': 'lib/category/category'
    }//,
    //modules:[{name:'page/basic-infor/main'},{name:'page/brand-manage/main'}]
    // ... more require.js options
};

var modules = ['page/basic-infor/main', 'page/brand-manage/main'];
gulp.task('requirejs', function() {
    var result = Q();
    modules.forEach(function(i){
        (function(i){
            result=result.then(function(){
                rjsconfig.name = i;
                rjsconfig.out = i+'.js';
                console.log(rjsconfig)
                rjs(rjsconfig).pipe(uglify()).pipe(gulp.dest('dist'));
            });
        })(i);
    });
    return result
});
gulp.task('watch', function() {
    livereload.listen();
    gulp.watch(['src/**/*.*'], function(file) {
        livereload.reload();
    });
});
gulp.task('default', ['requirejs', 'js', 'css', 'img']);