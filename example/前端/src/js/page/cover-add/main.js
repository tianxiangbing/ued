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
		define(['$', 'dialog', 'handlebars', 'table', 'calendar', 'upload', 'query', 'coolautosuggest',	"format-amount"], factory);
	} else {
		root.Cover = factory($, Dialog, Handlebars, Table, Calendar, Upload, Query, Coolautosuggest,FormatAmount);
	}
})(this, function($, Dialog, Handlebars, Table, Calendar, Upload, Query, Coolautosuggest,FormatAmount) {
	return {
		init: function() {
			FormatAmount.init();
			var id = Query.getQuery('id');
			$('#id-list').val(id);
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
			$('body').on('click', '.js-delrow', function() {
				var tr = $(this).closest('tr');
				if (tr.siblings().size() == 0) {
					$.alert('至少保留一行数据');
					return false;
				}
				tr.remove();
				$('#tab-list').find('tbody>tr').each(function() {
					var i = $(this).index();
					var td = $(this).children().first();
					td.html(i);
				});
			});
			$('body').on('click', '.js-addrow', function() {
				var tr = $(this).closest('tr');
				var source = $('#tpl-row').html();
				var template = Handlebars.compile(source);
				var html = template({});
				var row = $(html);
				tr.parent().append(row);
				$('#tab-list').find('tbody>tr').each(function() {
					var i = $(this).index();
					var td = $(this).children().first();
					td.html(i);
				});

				row.find('.suggest').each(function() {
					bindSuggest.call(this);
				});
			});

			function bindSuggest() {
				var _this = this;
				$(this).autocomplete({
					serviceUrl: $(this).data('url'),
					autoSelectFirst: true,
					onSearchStart: function() {
						$(this).attr('ref', '');
					},
					onSelect: function(suggestion) {
					console.log(suggestion)
						//alert('You selected: ' + suggestion.value + ', ' + suggestion.data);
						$(this).val(suggestion.value);
						$(this).attr('ref', suggestion.value);
						var _self = this;
						//获取商品详情
						var url = $(this).data('goodsinfo');
						$.post(url, {
							value: $(this).val()
						}, function(result) {
							var source = $('#tpl-row').html();
							var template = Handlebars.compile(source);
							var html = $(template(result.data));
							console.log(html)
							var tr = $(_self).closest('tr');
							tr.replaceWith(html);
							html.find('.suggest').each(function() {
								bindSuggest.call(this);
							});
						}, 'json');
					},
					onHide: function(c) {
						if (!$(this).attr('ref')) {
							$(this).val('');
						}
					}
				});
			}

			//数量操作
			$('body').on('click', '.js-minus-count', function() {
				var input = $(this).siblings('input.js-count');
				var count = parseInt(input.val()) || 1;
				if (count > 1) {
					count--;
				}
				input.val(count);
				return false;
			}).on('mouseover', '.js-minus-count', function() {
				var input = $(this).siblings('input.js-count');
				var count = parseInt(input.val()) || 1;
				if (count == 1) {
					$(this).addClass('disabled');
				} else {
					$(this).addClass('enabled');
				}
			}).on('mouseout', '.js-minus-count', function() {
				$(this).removeClass('disabled').removeClass('enabled');;
			});
			$('body').on('click', '.js-add-count', function() {
				var input = $(this).siblings('input.js-count');
				var count = parseInt(input.val()) || 1;
				var max = parseInt($(this).closest('td').prev().html()) || 1;
				if (count < max) {
					count++;
				}
				input.val(count);
				return false;
			}).on('mouseover', '.js-add-count', function() {
				var input = $(this).siblings('input.js-count');
				var count = parseInt(input.val()) || 1;
				var max = parseInt($(this).closest('td').prev().html()) || 1;
				if (count >= max) {
					$(this).addClass('disabled');
				} else {
					$(this).addClass('enabled');
				}
			}).on('mouseout', '.js-add-count', function() {
				$(this).removeClass('disabled').removeClass('enabled');;
			});
			$('body').on('blur', '.js-count', function() {
				var count = parseInt($(this).val()) || 1;
				var max = parseInt($(this).closest('td').prev().html()) || 1;
				if (count > max) {
					count = max;
				}
				if (count <= 0) {
					count = 1;
				}
				$(this).val(count);
				return false;
			});
			$('#btn-submit-add').click(function() {
				var form = $('.tab-list');
				var data = {};
				data.id = {}
				data.count = {}
				$('tbody tr', form).each(function() {
					//data.id.push($(this).find('[name="id"]').val());
					var obj = {};
					data.id [$(this).find('[name="id"]').val()]=$(this).find('[name="id"]').val()
					//data.id.push(obj);
					//data.count.push($(this).find('[name="count"]').val());
					data.count [$(this).find('[name="id"]').val()]=$(this).find('[name="count"]').val()
				});
				var param = Query.getForm($('.form'));
				data=$.extend(data,param);
				console.log(data)
				var url = $(this).data('url');
				var href = $(this).attr('href');
				console.log(url)
				$.post(url,{data:data},function(result) {
					if (result.status) {
						$.alert('补仓成功！', ["确定"], function() {
							location.href = href;
						});
					}
				});
				return false;
			});
		}
	}
});