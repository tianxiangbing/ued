/*
 * Created with Sublime Text 2.
 * license: http://www.lovewebgames.com/jsmodule/index.html
 * User: 田想兵
 * Date: 2015-04-09
 * Time: 11:54:14
 * Contact: 55342775@qq.com
 */
var require = requirejs.config({
	baseUrl: CONFIG.path,
	paths: {
		$: 'zepto',
		'scroll-load': 'lib/scroll-load/scroll-load',
		'dialog': 'lib/dialog/dialog',
		'mobile-upload': 'lib/mobile-upload/mobile-upload',
		'mobile-photo-preview': 'lib/mobile-photo-preview/mobile-photo-preview',
		'handlebars': 'lib/handlebars/handlebars-v3.0.0',
        	'carousel-image':'lib/carousel-image/carousel-image'
	},
	urlArgs: "version="+CONFIG.version
});
var name = CONFIG.pageId;
require(['page/'+name+'/main'], function(page) {
	page.init();
});
