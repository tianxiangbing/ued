/*
 * Created with Sublime Text 2.
 * license: http://www.lovewebgames.com/jsmodule/index.html
 * User: 田想兵
 * Date: 2015-04-09
 * Time: 11:54:14
 * Contact: 55342775@qq.com
 */

var require=requirejs.config({baseUrl:CONFIG.path,paths:{$:"jquery","scroll-load":"lib/scroll-load/scroll-load",dialog:"lib/dialog/dialog","mobile-upload":"lib/upload/mobile-upload",upload:"lib/upload/upload",handlebars:"lib/handlebars/handlebars-v3.0.0","carousel-image":"lib/carousel-image/carousel-image",serializejson:"lib/serializejson/jquery.serializejson",area:"lib/area/area",calendar:"lib/calendar/calendar",table:"lib/table/table",paging:"lib/paging/paging",query:"lib/query/query",coolautosuggest:"lib/coolautosuggest/coolautosuggest",category:"lib/category/category"},urlArgs:"version="+CONFIG.version}),name=CONFIG.pageId;require(["page/"+name+"/main"],function(e){e.init()});