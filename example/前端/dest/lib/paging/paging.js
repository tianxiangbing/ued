/*
 * Created with Sublime Text 3.
 * license: http://www.lovewebgames.com/jsmodule/index.html
 * User: 田想兵
 * Date: 2015-06-11
 * Time: 16:27:55
 * Contact: 55342775@qq.com
 */

(function(e,t){typeof define=="function"&&define.amd?define(["$"],t):typeof exports=="object"?module.exports=t():e.Paging=t(window.Zepto||window.jQuery||$)})(this,function(e){function t(){var e=Math.random().toString().replace(".","");this.id="Paging_"+e}return e.fn.Paging=function(n){var r=[];return e(this).each(function(){var i=e.extend({target:e(this)},n),s=new t;s.init(i),r.push(s)}),r},t.prototype={init:function(t){this.settings=e.extend({callback:null,pagesize:10,current:1,prevTpl:"上一页",nextTpl:"下一页",firstTpl:"首页",lastTpl:"末页",ellipseTpl:"...",toolbar:!1,pageSizeList:[5,10,15,20]},t),this.target=e(this.settings.target),this.container=e('<div id="'+this.id+'" class="ui-paging-container"/>'),this.target.append(this.container),this.render(this.settings),this.format(),this.bindEvent()},render:function(e){this.count=e.count||this.settings.count,this.pagesize=e.pagesize||this.settings.pagesize,this.current=e.current||this.settings.current,this.pagecount=Math.ceil(this.count/this.pagesize),this.format()},bindEvent:function(){var t=this;this.container.on("click","li.js-page-action,li.ui-pager",function(n){e(this).hasClass("js-page-action")?(e(this).hasClass("js-page-first")&&(t.current=1),e(this).hasClass("js-page-prev")&&(t.current=Math.max(1,t.current-1)),e(this).hasClass("js-page-next")&&(t.current=Math.min(t.pagecount,t.current+1)),e(this).hasClass("js-page-last")&&(t.current=t.pagecount)):e(this).data("page")&&(t.current=parseInt(e(this).data("page"))),t.go()})},go:function(e){var t=this;this.current=e||this.current,this.current=Math.max(1,t.current),this.current=Math.min(this.current,t.pagecount),this.format(),this.settings.callback&&this.settings.callback(this.current,this.pagesize,this.pagecount)},changePagesize:function(e){this.render({pagesize:e})},format:function(){var e="<ul>";e+='<li class="js-page-first js-page-action ui-pager" >'+this.settings.firstTpl+"</li>",e+='<li class="js-page-prev js-page-action ui-pager">'+this.settings.prevTpl+"</li>";if(this.pagecount>6){e+='<li data-page="1" class="ui-pager">1</li>';if(this.current<=2)e+='<li data-page="2" class="ui-pager">2</li>',e+='<li data-page="3" class="ui-pager">3</li>',e+='<li class="ui-paging-ellipse">'+this.settings.ellipseTpl+"</li>";else if(this.current>2&&this.current<=this.pagecount-2)e+="<li>"+this.settings.ellipseTpl+"</li>",e+='<li data-page="'+(this.current-1)+'" class="ui-pager">'+(this.current-1)+"</li>",e+='<li data-page="'+this.current+'" class="ui-pager">'+this.current+"</li>",e+='<li data-page="'+(this.current+1)+'" class="ui-pager">'+(this.current+1)+"</li>",e+='<li class="ui-paging-ellipse" class="ui-pager">'+this.settings.ellipseTpl+"</li>";else{e+='<li class="ui-paging-ellipse" >'+this.settings.ellipseTpl+"</li>";for(var t=this.pagecount-2;t<this.pagecount;t++)e+='<li data-page="'+t+'" class="ui-pager">'+t+"</li>"}e+='<li data-page="'+this.pagecount+'" class="ui-pager">'+this.pagecount+"</li>"}else for(var t=1;t<=this.pagecount;t++)e+='<li data-page="'+t+'" class="ui-pager">'+t+"</li>";e+='<li class="js-page-next js-page-action ui-pager">'+this.settings.nextTpl+"</li>",e+='<li class="js-page-last js-page-action ui-pager">'+this.settings.lastTpl+"</li>",e+="</ul>",this.container.html(e),this.container.find('li[data-page="'+this.current+'"]').addClass("focus").siblings().removeClass("focus"),this.settings.toolbar&&this.bindToolbar()},bindToolbar:function(){var t=this,n=e('<li class="ui-paging-toolbar"><select class="ui-select-pagesize"></select><input type="text" class="ui-paging-count"/><a href="javascript:void(0)">跳转</a></li>'),r=e(".ui-select-pagesize",n),i="";for(var s=0,o=this.settings.pageSizeList.length;s<o;s++)i+='<option value="'+this.settings.pageSizeList[s]+'">'+this.settings.pageSizeList[s]+"条/页</option>";r.html(i),r.val(this.pagesize),e("input",n).val(this.current),e("input",n).click(function(){e(this).select()}).keydown(function(n){if(n.keyCode==13){var r=parseInt(e(this).val())||1;t.go(r)}}),e("a",n).click(function(){var n=parseInt(e(this).prev().val())||1;t.go(n)}),r.change(function(){t.changePagesize(e(this).val())}),this.container.children("ul").append(n)}},t});