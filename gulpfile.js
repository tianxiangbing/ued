var gulp = require('gulp'),
    rjs = require('gulp-requirejs'),
    uglify = require('gulp-uglify'),
    cssmin = require('gulp-minify-css');
var paths = {
    scripts: ['src/js/*.js'], css: 'src/css/page/*.css'
};
gulp.task('js', function() {
    return gulp.src(paths.scripts).pipe(uglify()).pipe(gulp.dest('dist'));;
});
gulp.task('css', function() {
    return gulp.src(paths.css)
        .pipe(cssmin())
        .pipe(gulp.dest('dist/css/page'));
});

var rjsconfig = {
    "baseUrl": "src/js",
    shim: {
        // standard require.js shim options
    },
    "paths": {
        $: 'zepto',
        'dialog': 'lib/dialog/dialog'
    }
    // ... more require.js options
};

var modules=['page/index/main'];
gulp.task('requirejs', function() {
    modules.forEach(function(i){
        rjsconfig.name = i;
        rjsconfig.out = i+'.js';
        console.log(rjsconfig)
        rjs(rjsconfig).pipe(uglify()).pipe(gulp.dest('dist'));
    });
});

gulp.task('default', ['requirejs','js', 'css' ]);