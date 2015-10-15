/*
 * Created with Sublime Text 2.
 * User: 田想兵
 * Date: 2014-07-24
 * Time: 10:35:35
 * Contact: 55342775@qq.com
 */
define(function(require, exports, moudle) {
  var Handlebars = require("handlebars");
  var $ = require('$');
  var Pagination = require('pagination');
  var Dialog = require('dialog');
  var NsUtil = require('./ns-util.js');
  var common = require("./common.js");
  var Loading = require('loading');
  var network = require('network');
  var i18n = require('i18n');
  var formatAmount = require("./fn_format_amount");
  Handlebars.registerHelper('equalsten', function(v1, options){
	  if(v1 %10 == 0 && v1!=0){
		  return options.fn(this);
	  } else {
		  return options.inverse(this);
	  }
  });
   Handlebars.registerHelper('formatMoney', function(str){
      var arr = str.split('-');
      if(arr.length >1){
         return formatAmount.doFormat($.trim(arr[0])) + " - " +formatAmount.doFormat($.trim(arr[1]));
      }else{
        return formatAmount.doFormat($.trim(arr[0]));
      }
   });
  function C_Table(table, temp, page, param, search, callback, filterCon) {
    this.search = search;
    this.table = table;
    this.page = page;
    this.filterCon = filterCon;
    this.temp = temp;
    this.template = null;
    this.pageData = null;
    this.ajaxurl = table.attr('ajaxurl');
    this.ajaxDeleteItemUrl = table.attr('data-ajax-deleteitem-url')
    this.currentPage = 1;
    this._total = 0;
    this.pageSize = page.attr('pagesize') || 10;
    this.callback = callback;
    this.param = $.extend(param, {
      nPageNo: this.currentPage,
      nPageSize: this.pageSize
    });
  }
  C_Table.prototype = {
    init: function() {
      var source = this.temp.html();
      this.template = Handlebars.compile(source);
      if (this.search) {
        this.param = this.getParam(this.search.closest('.form'));
        this.bindSearch();
      }
      this.bind();
      this.event();
      var hovercard = require('./fn_hovercard.js');
      hovercard.init();
    },
    event: function() {
      var _this = this;
      $(this.table).bind('reload',function(){
    	  _this.gosearch();
      })
      this.table.delegate("tr", "click", function() {
        if ($(this).attr('href') && !$(this).hasClass('dialog')) {
          location.href = $(this).attr('href');
        }
      });
      this.table.delegate(".js-ajax", "click", function() {
        // if ($(this).attr('href')) {
        //   var ajaxurl = $(this).attr('href');
        //   var param = $(this).attr('js-ajax-param')||{};
        //   $.get(ajaxurl, param).done(function(result) {
        //     console.log(result)
        //     if (!result.hasError) {
        //       _this.gosearch();
        //     }
        //     if (result.hasError) {
	       //      NsUtil.message(result.errors[0].msg, 'error');
	       //    }
        //   });
        // }
        var linkajax = new common.linkAjax($(this),function(){
          //if($(this).attr("jumpurl")){
            //location.href = $(this).attr("jumpurl");
            //window.open($(this).attr("jumpurl"));
          //}
          _this.gosearch();
        });        
        return false;
      });
        $(this.table).on('click', '.js-delegate-delete', function (e) {
            e.preventDefault()
            e.stopImmediatePropagation()
            var jsonStr = {
                "itemId": e.target.dataset.itemid
            }
            // $.ajax({
            //     url: _this.ajaxDeleteItemUrl,
            //     type: 'POST',
            //     data: jsonStr,
            //     async: false,
            //     dataType: 'json'
            // }).done(function (data) {
            //     $(e.target).closest('tr').remove()
            //     setTimeout(function() {
            //         _this.gosearch()
            //     }, 500)

            // })
          var objAux={
                  url: _this.ajaxDeleteItemUrl,
                  type: 'POST',
                  data: jsonStr,
                  async: false,
                  dataType: 'json'
              }
            $.when(network.ajax(objAux)).done(function(){
                $(e.target).closest('tr').remove()
                setTimeout(function() {
                    _this.gosearch()
                }, 500)
            }).fail(function(){
                //todo fail logic
            });
        })
    },
    bindSearch: function() {
      var _this = this;
      this.search.click(function() {
        _this.gosearch();
      });
    },
    gosearch: function() {
      var _this = this;
      _this.currentPage = 1;
      if(_this.search){
        _this.param = $.extend(_this.param, _this.getParam(_this.search.closest('.form')) );
      }
      _this.param = $.extend(_this.param, _this.getParam($(_this.filterCon)));
      _this.bind();
    },
    getParam: function(form) {
      var result = {};
      $(form).find('*[name]').each(function(i, v) {
        var nameSpace,
          name = $(v).attr('name'),
          val = $.trim($(v).val()),
          tempArr = [],
          tempObj = {};
        if (name == '') {
          return;
        }
        val= val==$(v).attr('placeholder')?"":val;
        //处理radio add by yhx  2014-06-18
        if ($(v).attr("type") == "radio") {
          var tempradioVal = null;
          $("input[name='" + name + "']:radio").each(function() {
            if ($(this).is(":checked"))
              tempradioVal = $.trim($(this).val());
          });
          if (tempradioVal) {
            val = tempradioVal;
          } else {
            val = "";
          }
        }

        if ($(v).attr("type") == "checkbox") {
          var tempradioVal = [];
          $("input[name='" + name + "']:checkbox").each(function() {
            if ($(this).is(":checked"))
              tempradioVal.push( $.trim($(this).val()) );
          });
          if (tempradioVal.length) {
            val = tempradioVal.join(',');
          } else {
            val = "";
          }
        }
        //构建参数
        if (name.match(/\./)) {
          tempArr = name.split('.');
          nameSpace = tempArr[0];
          tempObj[tempArr[1]] = val;
          if (!result[nameSpace]) {
            result[nameSpace] = tempObj;
          } else {
            result[nameSpace] = $.extend({}, result[nameSpace], tempObj);
          }

        } else {
          result[name] = val;
        }

      });
      var obj = {};
      for (var o in result) {
        var v = result[o];
        if (typeof v == "object") {
          obj[o] = JSON.stringify(v);
        } else {
          obj[o] = result[o]
        }
      }
      return obj;
    },
    bind: function() {
      var _this = this;
      //this.param = $.extend(this.param, {
      //  nPageNo: this.currentPage,
      //  nPageSize: this.pageSize
      //});
      this.param = $.extend(this.param, {
        //'begin': (this.currentPage - 1) * this.pageSize + 1,
        //'end': this.currentPage * this.pageSize + 1,
        'skip':(this.currentPage - 1) * this.pageSize + 1,
        'take':this.pageSize
      });
      _this.table.css('position',"relative");
      if( _this.table.find('.loadingdata').size()==0){
        var t = (_this.table.height()/2 -32);
        t=t<0?32:t;
        t =30;
        var l = _this.table.width()/2 -32;
         _this.table.find('tbody,.tbody').html('');
         _this.table.nextAll('.sg-pager').find('.nodata').html('');
         _this.page.hide();
         _this.table.append('<div class="loadingdata" style="position:absolute;left:'+l+'px;top:'+t+'px;"/>');
        _this.loading = new Loading({
            element: '.loadingdata',
            size: 30,
            duration: 800
        });
      };

      ajaxData(_this.ajaxurl, _this.param).done(function(result) {
         _this.page.show();
        //loading.remove();
        _this.loading&&_this.loading.remove();
        $('.loadingdata').remove();
        if (!result.hasError) {
          var data = result.content;
          var html = _this.template(data);
          _this.table.html(html);
          if(result.content){
            _this._total = result.content.count||0;
          }
          _this.initPager();
          // _this.event();
          _this.callback ? _this.callback(_this, _this.table) : null;
        }else{
          NsUtil.message(i18n('catalog_loadFailure'),"error");
        }
      });
    },
    initPager: function() {
      var _this = this;
      var tar = _this.page;
      //tar.html('');
      if (tar.data("pagesize")) {
        _this.pageSize = tar.data("pagesize");
      } else {
        tar.data("pagesize", _this.pageSize);
      }
      tar.attr("pagesize", _this.pageSize);
	  
	  tar.parent().prevAll().remove();
	  if(_this._total==0){
		tar.parent().before('<p class="pdl10 nodata">'+i18n('catalog_common_no_data', '没有符合条件的数据!')+'</p>');
          tar.hide();
	  }else{
          tar.show();
       }
      if (!this.pageData) {
        this.pageData = new Pagination(tar, {
          page: this.currentPage,
          redirectUrl: '',
          sizeList: [10, 20], //For pagesize option select setting use!
          type: 'table', //使用场景'common'通用的大分页； 'table'在表格中使用的分页；
          size: _this.pageSize,
          sizeListPerPageLabel: i18n('catalog_common_itemsperpage'),
          totalNumLabel :  i18n('catalog_common_sumitems'),
          onPageChanged: function(page) {
            _this.currentPage = page;
            _this.pageSize = parseInt(tar.data("pagesize"));
            _this.pageData.setPaging({
              total: _this._total,
              page: _this.currentPage,
              size: parseInt(tar.data("pagesize"))
            });
            _this.bind();
          }
        });
      }
      this.pageData.setPaging({
        total: _this._total,
        page: _this.currentPage,
        size: parseInt(tar.data("pagesize"))
      });
    }
  };
  // 
  function ajaxData(url, param) {
    param = $.extend({}, param);
    // return $.post(url, param, function(data) {
    // }, 'json');
          var objAux={
                  url:url,
                  type: 'POST',
                  data: param,
                  dataType: 'json'
              }
         var xhr = $.when(network.ajax(objAux)).done(function(result){
            }).fail(function(){
                //todo fail logic
            });
          return xhr;
  }
  moudle.exports = C_Table;
});
