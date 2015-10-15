(function(root, factory) {
	//amd
	if (typeof define === 'function' && define.amd) {
		define(['$'], factory);
	} else if (typeof exports === 'object') { //umd
		module.exports = factory();
	} else {
		root.Area = factory(window.Zepto || window.jQuery || $);
	}
})(this, function($) {
	return {
		init: function(areaurl) {
			$.get(areaurl, function(result) {
				//if (result.status) {
				$('.area-input').each(function() {
					var province = $(".province .area-content", this);
					var city = $(".city .area-content ul", this);
					var downtown = $(".downtown .area-content ul", this);
					var provinceData = [result.data];
					var html = $("<div/>");
					for (var i = 0, l = provinceData.length; i < l; i++) {
						var row = $("<ul/>");
						var item = provinceData[i];
						for (var j = 0, len = item.length; j < len; j++) {
							var p = $('<li data-value="' + provinceData[i][j].id + '">' + provinceData[i][j].name + '</li>');
							row.append(p);
							var citylist = provinceData[i][j].child || [];
							p.click(function(e,args) {
								city.children().hide();
								var area = city.closest('.area');
								$(area.children('input')).val('');
								$(area.children('span')).html('-- 城市 --');

								downtown.children().hide();
								var area2 = downtown.closest('.area');
								$(area2.children('input')).val('');
								$(area2.children('span')).html('-- 市区 --');

								($(this).data('child') || $([])).each(function() {
									$(this).show();
								});
								return args;
							});
							var input = $('#hd_province');
							if (input.val() == provinceData[i][j].id) {
								input.next().html(provinceData[i][j].name);
								(function(p) {
									setTimeout(function() {
										p.trigger('click',false);
									});
								})(p);
							}
							for (var k = 0, cl = citylist.length; k < cl; k++) {
								if (!citylist[k]) continue;
								var c = $('<li data-value="' + citylist[k].id + '" >' + citylist[k].name + '</li>');
								var arr = p.data("child", p.data("child") || []);
								arr.push(c);
								p.data("child", arr);
								p.data("child");
								c.hide();
								city.append(c);
								c.click(function(e,args) {
									downtown.children().hide();
									($(this).data('child') || $([])).each(function() {
										$(this).show();
									});
									return args;
								});
								var input = $('#hd_city');
								if (input.val() == citylist[k].id) {
									var namec= citylist[k].name;
									(function(input,c){
										setTimeout(function(){
											input.next().html(namec);
											c.trigger('click',false);
										},20);
									})(input,c);
								}
								var downtownlist = citylist[k].child || [];
								for (var t = 0, ct = downtownlist.length; t < ct; t++) {
									if (!downtownlist[t]) continue;
									var d = $('<li data-value="' + downtownlist[t].id + '">' + downtownlist[t].name + '</li>');
									var arr = c.data("child", c.data("child") || []);
									arr.push(d);
									c.data("child", arr);
									c.data("child");
									d.hide();
									downtown.append(d);
									var inputdt = $('#hd_downtown');
									if (inputdt.val() == downtownlist[t].id) {
										var name= downtownlist[t].name;
										(function(inputdt){
											setTimeout(function(){
												inputdt.next().html(name);
											},40);
										})(inputdt);
									}
								}
							}
						}
						html.append(row);
					}
					province.html(html);
				});
				//}
			}, 'json').fail(function(){
				$.alert('加载地区信息出错，请稍后重试！')
			});
			$('.area-input .area').click(function() {
				$('.area-input .area').removeClass('active');
				$('.area-content').not($(this).find('.area-content')).hide();
				$(this).find('.area-content').toggle();
				var arearow = $(this).closest('.area-row');
				if ($(this).find('.area-content:visible').size()) {
					$(this).addClass('active');
					arearow.css('zIndex', 44);
				} else {
					$(this).removeClass('active');
					arearow.css('zIndex', 22);
				}
				return false;
			});
			$('.area-input .area-content').on('click', 'ul', function() {
				return false;
			});
			$('.area-input .area-content').on('click', 'li', function() {
				var area = $(this).closest('.area');
				area.find('input').val($(this).data('value'));
				area.children('span').html($(this).html());
				area.trigger('click');
				return false;
			});
			$('body').click(function() {
				$('.area-content').hide();
				$('.area-input .area').removeClass('active');
				$('.area-row').css('zIndex', 22);
			});
		}
	};
});