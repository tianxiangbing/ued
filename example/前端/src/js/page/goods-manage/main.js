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
		define(['$', 'dialog', 'handlebars', 'table', 'calendar', 'upload', 'category'], factory);
	} else {
		root.Index = factory($, Dialog, Handlebars, Table, Calendar, Upload, Category);
	}
})(this, function($, Dialog, Handlebars, Table, Calendar, Upload, Category) {
	return {
		init: function() {
			var table = new Table($('#tab-list'), $('#tpl-list'), $('#pager'), {}, $('#search'));
			table.init();
			//类目
			var category = new Category();
			category.init({target:$('.category')});
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

			/*导入*/
			var upload = new Upload();
			var importData = [];
			upload.init({
				target: $('#btn-preview'),
				url: "../../json/uploadxsl.json",
				accept: "xls,xlsx",
				autoPost: false,
				postTarget: $('#btn-import'),
				selected: function(input, target, i) {
					$('#txt-preview').val($(this).val());
				},
				callback: function(result, file, name, target, i) {
					eval('result=' + result);
					$('#txt-preview').val('');
					this.args.length = 0;
					console.log(result);
					if (result.status) {
						var source = $('#tpl-list').html();
						var template = Handlebars.compile(source);
						importData = result.data.data;
						var html = template(result.data);
						$('#tab-list-import').html(html);
						$('#importAction').show();
					}
				}
			});
			$('body').on('click', '.js-del', function() {
				var tr = $(this).closest('tr');
				var index = tr.index();
				//delete importData[index];
				tr.remove();
				var newArr = [];
				for (var i = 0, l = importData.length; i < l; i++) {
					if (index !== i) {
						newArr.push(importData[i]);
					}
				}
				importData = newArr;
				//console.log(importData);
			});
			$('#btn-submit-import').click(function() {
				var url = $(this).data('url');
				$.ajax({
					url: url,
					method: 'post',
					data: {
						data: importData
					},
					success: function(result) {
						if (result.status) {
							$.alert('导入成功！', ["确定"], function() {
								location.reload();
							});
						}
					}
				});
			});
			/*商品添加*/
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
			//申请仓补
			$('#js-cover-add').click(function() {
				var chk = $('.js-chk:checked');
				if (chk.length == 0) {
					$.alert('请先选择需要补仓的商品!');
					return false;
				}
				var arr = [];
				for (var i in checkedList) {
					arr.push(i);
				}
				location.href = $(this).attr('href') + "?id=" + arr.join(',');
				return false;
			});
			//跨页选中保存
			var checkedList = {};
			$('#tab-list ').on('click', '[type="checkbox"]', function() {
				var parent = $(this).closest('.tab-list');
				setTimeout(function() {
					var chk = parent.find(':checkbox');
					chk.each(function() {
						var key = $(this).val();
						if ($(this).prop('checked')) {
							checkedList[key] = true;
						} else {
							delete checkedList[key];
						}
					});
				})
			});
			Handlebars.registerHelper('ischecked', function(id) {
				if (checkedList[id]) {
					return " checked ='true' ";
				} else {
					return "";
				}
			});
		}
	}
});