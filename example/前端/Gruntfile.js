/*
 * Created with Sublime Text 2.
 * User: 田想兵
 * Date: 2015-03-26
 * Time: 14:11:42
 * Contact: 55342775@qq.com
 */

var fs = require("fs");
var path = require("path");
module.exports = function(grunt) {
	var config={};
	config.requirejs={
		compile:{
			options:{
				"appDir": "src/js",
				"baseUrl": ".",
				"dir": "dest",
				"modules": [{
					"name": "page/basic-infor/main",
					"exclude":["$"]
				},{
					"name": "page/brand-manage/main",
					"exclude":["$"]
				},{
					"name": "page/corp-license/main",
					"exclude":["$"]
				},{
					"name": "page/cover-add/main",
					"exclude":["$"]
				},{
					"name": "page/cover-manage/main",
					"exclude":["$"]
				},{
					"name": "page/enterprise-qualification/main",
					"exclude":["$"]
				},{
					"name": "page/goods-manage/main",
					"exclude":["$"]
				},{
					"name": "page/info/main",
					"exclude":["$"]
				},{
					"name": "page/main-brand/main",
					"exclude":["$"]
				},{
					"name": "page/regist/main",
					"exclude":["$"]
				},{
					"name": "page/signed-agreement/main",
					"exclude":["$"]
				}],
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
				}
			}
		}
	}
	grunt.initConfig(config);
	grunt.loadNpmTasks('grunt-contrib-requirejs');
	//requirejs
	grunt.registerTask('default',['requirejs'])
};