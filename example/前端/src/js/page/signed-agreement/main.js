/*
 * Created with Sublime Text 2.
 * User: 田想兵
 * Date: 2015-06-24
 * Time: 15:27:54
 * Contact: 55342775@qq.com
 */
;
(function(root, factory) {
	//amd
	if (typeof define === 'function' && define.amd) {
		define(['$', 'dialog', 'area'], factory);
	} else {
		root.Index = factory($, Dialog, Area);
	}
})(this, function($, dialog, Area) {
	return {
		init: function() {
			Area.init(CONFIG.area);
			function showok(input) {
				var tips = $(input).nextAll('.tips');
				tips.hide();
			}

			function showerror(input, txt) {
				var tips = $(input).nextAll('.tips');
				tips.show().children("b").html(txt);
				var top = input.position().top + 50;
				tips.css({
					left: input.position().left - 10,
					top: top
				});
			}
			$('.required').each(function() {
				$(this).blur(function() {
					var input = $(this);
					var v = $(this).val();
					if ($(this).val().length == 0) {
						showerror($(this), $(this).attr('required-msg'));
					} else {
						var type = $(this).data('type');
						switch (type) {
							case "email":
								{
									var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
									if (reg.test(v)) {
										showok(input, "");
									} else {
										showerror(input, '邮箱格式错误');
									}
								}
								break;
							case "phone":
								{
									var reg = /^[1]\d{10}$/;
									if (reg.test(v)) {
										showok(input, "");
									} else {
										showerror(input, '手机号码格式错误');
									}
								}
								break;
							case "number":
								{
									if (!isNaN(v)) {
										showok(input, "");
									} else {
										showerror(input, '数字格式错误');
									}
								}
								break;
							default:
								{
									showok($(this));
								}
								break;
						}
					}
				});
			});
			$('.js-agreement').submit(function(){
				var form = this;
				$('input', this).each(function() {
					$(this).trigger('blur');
				});
				var isupload = true;
				$('.upload').each(function(){
					var input = $(this).nextAll(':hidden');
					if ($.trim(input.val()).length === 0) {
						isupload= false;
						var target= this;
						$(target).addClass('error');
						$(target).find('h4').html('<s></s>请上传证照');
						$(target).find('p').html("");
					}
				});
				if (!isupload) {
					return false;
				}
				var requiredList = $('.required');
				for (var i = 0, l = requiredList.length; i < l; i++) {
					if ($(requiredList[i]).val().length == 0) {
						return false;
					}
				};
				if ($('.tips:visible').size()) {
					return false;
				};
				var url = $(this).attr("action");
				var data = $(this).serialize();
				$.post(url, data, function(result) {
					if (result.status) {
						location.href = $(form).data('next');
					}
				});
				return false;
			});
			$('#btn-submit').click(function(){
				$('.js-agreement').submit();
				return false;
			});
		}
	}
});