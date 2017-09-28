# 前端规范
* [环境搭建](#环境搭建)
* [文件夹及文件位置](#文件夹及文件位置)
* [AMD规范](#AMD规范)
* [页面入口文件](#页面入口文件)
* [版本控制](#版本控制)
* [打包发布](#打包发布)
* [组件开发规范](#组件开发规范)

## <A NAME="环境搭建">环境搭建</A>
1. 先去[nodejs](http://nodejs.org "nodejs官网")官网下载nodejs安装包
2. 通过node -v 命令行验证环境是否安装成功 
3. 安装http服务(apache/或node http.js 或iis),这里提供一份node的[http服务下载](http.js "node http服务"),当前目录运行node http 启动服务，打开http://localhost:3000/index.html来验证服务是否正常运行,如有多个应用，可以更换不同的端口号。

## <A NAME="文件夹及文件位置">文件夹及文件位置</A>
1. 根目录新建两个目录(src,dist);
2. src放置开发css、js、和html三个文件夹,分别放样式、JS文件、和html文件。image文件在css中新建一个文件夹imgs，形成img和css可以在任何情况下都以相对目录访问的情况，包括发布到CDN。
3. 在css文件中新建common文件夹和page文件夹,common中放公用样式文件，page中放具体业务文件，命名以对应的页面或模块命名
4. 在js文件夹中新建page和lib两个文件，page中只存在文件夹，命名同样以页面或模块命名，再页面文件夹中建main.js文件。代码中以兼容AMD的方式编写。
5. html文件夹中放置html页面

## <A NAME="AMD规范">AMD规范</A>
	;
	(function(root, factory) {
		//amd
		if (typeof define === 'function' && define.amd) {
			define(['$','dialog'], factory);
		} else {
			root.Index = factory($,Dialog);
		}
	})(this, function($,dailog) {
	    return {
	        init : function(){
	            $.alert('ok');
	        }
	    }
	});
* 注：如果页面中不支持AMD，将以常规的script引入文件时的兼容 *

define的第一个参数是模块的依赖项，这里不建议使用相对路径或绝对路径，应在config中配置好别名调用。关于 config的配置会在[页面入口文件](#页面入口文件)中说到.
在这里需要注意的是，必须返回一个带init方法的对象。这会作为一个模块或页面的入口方法来调用。所以它是必须的，即使没有，也要返回一个空的方法。

## <A NAME="页面入口文件">页面入口文件</A>
在js文件夹中建boot.js，代码如下

	var require = requirejs.config({
		baseUrl: CONFIG.path,
		paths: {
			$: 'zepto',
			'dialog': 'lib/dialog/dialog'
		},
		urlArgs: "version="+CONFIG.version
	});
	var name = CONFIG.pageId;
	require(['page/'+name+'/main'], function(page) {
		page.init();
	});

在paths中配置模块的别名，urlArgs是用来控制文件的请求url，加上版本号，用来清除缓存，变量CONFIG在页面中定义如下：

    <script type="text/javascript" src="../dist/js/require.js"></script>
    <script type="text/javascript">
    var CONFIG = {
        path:'../dist/js',//dist
        // path:'../dist/js',//online
        //path:'../src/js',//dev
        pageId: 'index',
        version:"1.0.0"
    }
    </script>
    <script type="text/javascript" src="../dist/boot.js"></script>
这里修改path的路径来决定当前页面是调用src目录还是dist还是CDN上的文件。	

## <A NAME="版本控制">版本控制</A>
版本控制主要是引用文件的url的参数变化，配置CONFIG中的version值，从1.0.0开始，后面每次的打包都要更改。如果不能起到清除缓存的作用，请服务器中控制。

## <A NAME="打包发布">打包发布</A>
推荐打包使用[gulp.js](http://gulpjs.com/ "gulp.js")打包，或者用[grunt.js](http://gruntjs.com/ "grunt.js"),这里提供一个gulp的方式。

首先在命令行中安装全局的gulp

	npm install --global gulp

然后在前端根目录中新建gulpfile.js文件，配置项如下

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

这里有几个gulp的插件要安装

	npm install -g gulp-requirejs
	npm install -g gulp-uglify
	npm install -g gulp-minify-css

最后执行命令进行打包
	
	gulp

测试

## <A NAME="组件开发规范">组件开发规范</A>
重复上面的操作。具体参考组件[dialog](src\js\lib\dialog)
