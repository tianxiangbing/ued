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
		define(['$', 'dialog', 'handlebars', 'table', 'calendar', 'upload','query', 'category'], factory);
	} else {
		root.Cover = factory($, Dialog, Handlebars, Table, Calendar, Upload,Query, Category);
	}
})(this, function($, Dialog, Handlebars, Table, Calendar, Upload,Query, Category) {
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
			var id =Query.getQuery('id');
			console.log(id)
		}
	}
});