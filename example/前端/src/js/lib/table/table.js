/*
 * Created with Sublime Text 2.
 * User: 田想兵
 * Date: 2015-06-25
 * Time: 16:27:54
 * Contact: 55342775@qq.com
 */
;
(function(root, factory) {
	//amd
	if (typeof define === 'function' && define.amd) {
		define(['$', 'dialog', 'handlebars', 'paging'], factory);
	} else {
		root.Table = factory($, Dialog, Handlebars, Paging);
	}
})(this, function($, Dialog, Handlebars, Paging) {
	Handlebars.registerHelper('equalsten', function(v1, options) {
		if (v1 % 10 == 0 && v1 != 0) {
			return options.fn(this);
		} else {
			return options.inverse(this);
		}
	});
	Handlebars.registerHelper('equals', function(v1, v2, options) {
		if (v1 == v2) {
			return options.fn(this);
		} else {
			return options.inverse(this);
		}
	});
	Handlebars.registerHelper('indexOf', function(v1, arr, options) {
		var returnValue = false;
		for(var i= 0 ,l = arr.length;i <l ;i ++){
			if(arr[i]==v1){
				returnValue = true;
			}
		}
		if (returnValue) {
			return options.fn(this);
		} else {
			return options.inverse(this);
		}
	});
	Handlebars.registerHelper('formatMoney', function(str) {
		var arr = str.split('-');
		if (arr.length > 1) {
			return formatAmount.doFormat($.trim(arr[0])) + " - " + formatAmount.doFormat($.trim(arr[1]));
		} else {
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
		this.param = $.extend(param, {});
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
		},
		event: function() {
			var _this = this;
			$(this.table).bind('reload', function() {
				_this.gosearch();
			})
			this.table.delegate("tr", "click", function() {
				if ($(this).attr('href') && !$(this).hasClass('dialog')) {
					location.href = $(this).attr('href');
				}
			});
			this.table.delegate(".js-ajax", "click", function() {
				if ($(this).attr('href')) {
					var ajaxurl = $(this).attr('href');
					var param = $(this).attr('js-ajax-param') || {};
					$.post(ajaxurl, param).done(function(result) {
						//console.log(result)
						if (result.status) {
							_this.gosearch();
						} else {
							$.alert(result.msg);
						}
					});
				}
				return false;
			});
			$(this.table).on('click', '.js-delegate-delete', function(e) {
				var ajaxurl = $(this).attr('href');
				var param = $(this).attr('js-ajax-param') || {};
				$.confirm('是否确认删除？', [{
					yes: "确定"
				}, {
					no: '取消'
				}], function(t) {
					var d = this;
					if (t == "yes") {
						var objAux = {
							url: ajaxurl,
							type: 'POST',
							data: param,
							async: false,
							dataType: 'json'
						}
						$.when($.ajax(objAux)).done(function() {
							$(e.target).closest('tr').remove()
							d.hide();
							setTimeout(function() {
								_this.gosearch()
							}, 500)
						}).fail(function() {
							//todo fail logic
						});
					} else {
						d.hide();
					}
				});
				return false;
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
			if (_this.search) {
				_this.param = $.extend(_this.param, _this.getParam(_this.search.closest('.form')));
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
				val = val == $(v).attr('placeholder') ? "" : val;
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
							tempradioVal.push($.trim($(this).val()));
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
				'page': this.currentPage,
				'page_size': this.pageSize
			});
			_this.table.css('position', "relative");
			if (_this.table.find('.loadingdata').size() == 0) {
				var t = (_this.table.height() / 2 - 32);
				t = t < 0 ? 32 : t;
				t = 30;
				var l = _this.table.width() / 2 - 32;
				_this.table.find('tbody,.tbody').html('');
				_this.table.nextAll('.sg-pager').find('.nodata').html('');
				_this.page.hide();
				_this.table.append('<div class="loadingdata" style="position:absolute;left:' + l + 'px;top:' + t + 'px;"/>');
			};

			ajaxData(_this.ajaxurl, _this.param).done(function(result) {
				_this.page.show();
				//loading.remove();
				_this.loading && _this.loading.remove();
				$('.loadingdata').remove();
				if (!result.hasError) {
					var data = result.data;
					var html = _this.template(data);
					_this.table.html(html);
					if (result.data) {
						_this._total = result.data.count.total || 0;
					}
					_this.initPager();
					// _this.event();
					_this.callback ? _this.callback(_this, _this.table) : null;
				} else {}
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
			if (_this._total == 0) {
				_this.table.html('<p class="pdl10 nodata">' + '没有符合条件的数据!' + '</p>');
				tar.hide();
			} else {
				tar.show();
			}
			if (!this.pageData) {
				this.pageData = new Paging();
				this.pageData.init({
					target: this.page,
					pagesize: _this.pageSize,
					count: _this._total,
					callback: function(p) {
						_this.currentPage = p;
						_this.bind();
					}
				});
			}else{
				this.pageData.render({count:_this._total,pagesize:_this.pageSize,current:this.currentPage});
			}
		}
	};
	// 
	function ajaxData(url, param) {
		param = $.extend({}, param);
		return $.post(url, param, function(data) {}, 'json');
	}
	return C_Table;
});