/*
 * Created with Sublime Text 3.
 * license: http://www.lovewebgames.com/jsmodule/index.html
 * User: 田想兵
 * Date: 2015-06-29
 * Time: 15:27:55
 * Contact: 55342775@qq.com
 */

(function(e,t){typeof define=="function"&&define.amd?define(["$"],t):typeof exports=="object"?module.exports=t():e.Query=t(window.Zepto||window.jQuery||$)})(this,function(e){var t={getQuery:function(e){var t=new RegExp("(^|&)"+e+"=([^&]*)(&|$)","i"),n=window.location.search.substr(1).match(t);return n!=null?unescape(n[2]):null},getForm:function(t){var n={};e(t).find("*[name]").each(function(t,r){var i,s=e(r).attr("name"),o=e.trim(e(r).val()),u=[],a={};if(s=="")return;o=o==e(r).attr("placeholder")?"":o;if(e(r).attr("type")=="radio"){var f=null;e("input[name='"+s+"']:radio").each(function(){e(this).is(":checked")&&(f=e.trim(e(this).val()))}),f?o=f:o=""}if(e(r).attr("type")=="checkbox"){var f=[];e("input[name='"+s+"']:checkbox").each(function(){e(this).is(":checked")&&f.push(e.trim(e(this).val()))}),f.length?o=f.join(","):o=""}s.match(/\./)?(u=s.split("."),i=u[0],a[u[1]]=o,n[i]?n[i]=e.extend({},n[i],a):n[i]=a):n[s]=o});var r={};for(var i in n){var s=n[i];typeof s=="object"?r[i]=JSON.stringify(s):r[i]=n[i]}return r}};return t});