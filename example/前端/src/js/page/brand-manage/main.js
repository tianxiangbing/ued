/*
 * Created with Sublime Text 2.
 * User: 田想兵
 * Date: 2015-06-25
 * Time: 9:27:54
 * Contact: 55342775@qq.com
 */
;
(function(root, factory) {
	//amd
	if (typeof define === 'function' && define.amd) {
		define(['$', 'dialog', 'handlebars', 'table', 'calendar', 'upload','query'], factory);
	} else {
		root.Cover = factory($, Dialog, Handlebars, Table, Calendar, Upload,Query);
	}
})(this, function($, Dialog, Handlebars, Table, Calendar, Upload,Query) {
	return {
		init: function() {
			var table = new Table($('#tab-list'), $('#tpl-list'), $('#pager'), {}, $('#search'));
			table.init();
			$(".calendar").Calendar({
				zIndex: 34,
				afterSelected: function(obj) {
					$(obj).blur();
				}
			});
			$('body').on('click', '#checkAll', function() {
				$('.js-chk').each(function() {
					$(this).prop('checked', !$(this).prop('checked'));
				});
			});
			$('.filter a').click(function() {
				$(this).addClass('current').siblings().removeClass('current');
				$('#hd_type').val($(this).data('filter'));
				table.gosearch();
			});
			var id =Query.getQuery('id');
			console.log(id)

			/*品牌添加*/
			var uploadpro = new Upload();
			var target = $('#upload-pro');
			uploadpro.init({
				target: target,
				url: "../../json/upload.json",
				accept: "png,jpg",
				startUpload: function(input, target, i) {
					$(target).parent().find('img').hide();
					$(target).find('p').html('正在上传');
					$(target).addClass('loading').find('h4').html('<b></b>');
				},
				callback: function(result, file, name, target, i) {
					eval('result=' + result);
					setTimeout(function() {
						$(target).removeClass('loading')
						if (result.status) {
							$(target).find('img').show();
							$(target).children('img').attr("src", result.data);
							$(target).nextAll('input').val(result.data);
						} else {
							$(target).addClass('error');
							$(target).find('h4').html('<i></i>上传失败');
							$(target).find('p').html(result.msg);
						}
					}, 1000);
				}
			});

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
			$('select.required').change(function() {
				$(this).trigger('blur');
			});
			$('.required').each(function() {
				$(this).blur(function() {
					var input = $(this);
					var v = $(this).val();
					if ($(this).val().length == 0) {
						showerror($(this), $(this).attr('required-msg'));
					} else {
						showok($(this));
					}
				});
			});
			$('.js-goods-add').submit(function() {
				var form = this;
				$('input,select', this).each(function() {
					$(this).trigger('blur');
				});
				var isupload = true;
				$('.upload').each(function() {
					var input = $(this).nextAll(':hidden');
					if ($.trim(input.val()).length === 0) {
						isupload = false;
						var target = this;
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
						$.alert('添加成功！', ["确定"], function() {
							location.href = $(form).data('next');
						});
					}
				});
				return false;
			});
		}
	}
});