/*
 * Created with Sublime Text 2.
 * User: 田想兵
 * Date: 2015-07-01
 * Time: 10:02:02
 * Contact: 55342775@qq.com
 * 类目
 */
;
(function(root, factory) {
	//amd
	if (typeof define === 'function' && define.amd) {
		define(['$', 'dialog'], factory);
	} else if (typeof exports === 'object') { //umd
		module.exports = factory();
	} else {
		root.Category = factory(window.Zepto || window.jQuery || $, Dialog);
	}
})(this, function($, Dialog) {
	var Category = function() {}
	Category.prototype = {
		init: function(settings) {
			this.settings = settings || {};
			this.target = this.settings.target;
			var _this = this;
			this.url = '/src/json/category.json';
			this.List = [];
			$.ajax({
				url: this.url,
				data: {},
				type: 'post',
				dataType: 'json',
				success: function(result) {
					if (result.status) {
						var data = result.data;
						_this.List = data;
						var content = $('.big', _this.target);
						for (var i = 0, l = data.length; i < l; i++) {
							content.append('<a data-value="' + data[i].id + '">' + data[i].name + '</a>');
						}
					} else {
						$.alert(result.msg);
					}
				}
			});
			this.bindEvent();
		},
		bindEvent: function() {
			var _this = this;
			$('.label', this.target).click(function() {
				$('.drop-content', _this.target).width($(this).width()).toggle();
				$(_this.target).toggleClass('active');
			});
			$(this.target).on('mouseover', '.big a', function() {
				var id = $(this).data('value');
				if (id) {
					$('.small', _this.target).show();
					var str = '';
					for (var i = 0, l = _this.List.length; i < l; i++) {
						if (_this.List[i].id == id) {
							for (var k = 0, len = _this.List[i].child.length; k < len; k++) {
								var item = _this.List[i].child[k];
								str += '<a data-value="' + item.id + '">' + item.name + '</a>';
							}
						}
					}
					$('.small>div', _this.target).html(str);
				} else {
					$('.small', _this.target).hide();
				}
			});
			$(this.target).on('click', '.small a', function() {
				var id = $(this).data('value');
				var text = $(this).html();
				$('.label span',_this.target).html(text);
				$('#hd_categoryId',_this.target).val(id);
				$('.drop-content', _this.target).hide();
				$(_this.target).removeClass('active');
			});
		}
	}
	return Category;
});