/*
 * Created with Sublime Text 2.
 * User: 田想兵
 * Date: 2015-06-16
 * Time: 9:27:54
 * Contact: 55342775@qq.com
 */
;
(function(root, factory) {
	//amd
	if (typeof define === 'function' && define.amd) {
		define(['$', 'dialog', 'area', 'upload', 'handlebars', 'serializejson', 'calendar'], factory);
	} else {
		root.Index = factory($, Dialog, Area, Upload, Handlebars, Calendar);
	}
})(this, function($, dialog, Area, Upload, Handlebars, Calendar) {
	return {
		init: function() {
			//类目数据
			var Category = [];
			var xhr = $.post('../json/category.json', function(result) {
				if (result.status) {
					Category = result.data;
					bindCategory();
				} else {
					$.alert(result.msg);
				}
			}, 'json');
			//绑定主营类目
			function bindCategory() {
				var str = '<option value="">请选择</option>';
				for (var i = 0, l = Category.length; i < l; i++) {
					str += '<option value="' + Category[i].id + '">' + Category[i].name + '</option>';
				}
				$('#sel_mainCategory').html(str);
			};
			$('#sel_mainCategory').change(function() {
				var id = $(this).val();
				bindDetailedCategory(id);
			});
			//绑定详细类目
			function bindDetailedCategory(id) {
				var str = '<option value="">请选择</option>';
				for (var i = 0, l = Category.length; i < l; i++) {
					if (Category[i].id == id) {
						for (var k = 0, len = Category[i].child.length; k < len; k++) {
							var item = Category[i].child[k];
							str += '<option value="' + item.id + '">' + item.name + '</option>';
						}
					}
				}
				$('#sel_detailedCategory').html(str);
			}
			$(".calendar").Calendar({
				zIndex: 34,
				time: true,
				afterSelected: function(obj) {
					$(obj).blur();
				}
			});
			/*
			var JsonList = (localStorage.result && JSON.parse(localStorage.result)) || {
				data: []
			};
			var List = JsonList.data || [];
			*/
			var JsonList ={};
			$.post('../json/brand.json',function(result){
				if(result.status){
					JsonList= result;
					bindList();
				}else{
					$.alert(result.msg)
				}
			},'json');
			var D = $('.add-brand').Dialog({
				target: $('#add-brand'),
				mask: true,
				closeTpl: '<span class="ui-dialog-close ui-dialog-close2 js-dialog-close"></span>'
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

			$('.js-basic-infor').submit(function() {
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
						$(target).find('h4').html('<s></s>请上传LOGO');
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
				var data = $(this).serializeJSON();
				/*
				$.post(url, data, function(result) {
					if (result.status) {
						location.href = $(form).data('next');
					}
				});
				 */
				var item = data;
				data.mainCategoryText = $('#sel_mainCategory option:selected').html();
				data.detailedCategoryText = $('#sel_detailedCategory option:selected').html();
				data.brandTypeText = $('#sel_brandType option:selected').html();
				data.managementModelText = $('#sel_managementModel option:selected').html();
				if ($(".btn-submit", this).val() == "修改") {
					var index = $(".btn-submit", this).data('index');
					List[index] = data;
				} else {
					List.push(data);
				}
				JsonList.data = List;
				localStorage['result'] = JSON.stringify(JsonList);
				bindList();
				D[0].hide();
				return false;
			});
			//bindList();
			Area.init(CONFIG.area);
			$('.upload').each(function() {
				var _this = this;
				(function(_this) {
					var upload = new Upload();
					if($(_this).find('img').size()==0){
						$(_this).append('<img>');
						$(_this).find('img').hide();
					}
					upload.init({
						target: $(_this),
						url: "../json/upload.json",
						accept: "png,jpg",
						startUpload: function(input, target, i) {
							$(_this).find('img').hide();
							$(target).find('p').html('正在上传');
							$(target).addClass('loading').find('h4').html('<b></b>');
						},
						callback: function(result, file, name, target, i) {
							eval('result=' + result);
							setTimeout(function() {
								$(target).removeClass('loading')
								if (result.status) {
									$(_this).find('img').show();
									$(_this).children('img').attr("src", result.data);
									$(_this).nextAll('input').val(result.data);
								} else {
									$(target).addClass('error');
									$(target).find('h4').html('<i></i>上传失败');
									$(target).find('p').html(result.msg);
								}
							}, 1000);
						}
					});
				})(_this);
			});

			function bindList() {
				var source = $('#tpl-list').html();
				var template = Handlebars.compile(source);
				var html = template(JsonList);
				$('#list-brand').html(html);
				if (JsonList && JsonList.data && JsonList.data.length) {
					$('.add-brand p').addClass('active');
				}
			};
			$('body').on('click', '#js-next', function() {
				var url = $(this).data('ajax');
				var href= $(this).data('href');
				$.post(url, JsonList, function(result) {
					if (result.status) {
						location.href=href;
					} else {
						$.alert(result.msg)
					}
				});
				return false;
			});
			//删除
			$('body').on('click', '.js-del', function() {
				var index = $(this).data('index');
				//delete JsonList.data[index];
				var newList = [];
				var data = JsonList.data || [];
				for (var i = 0, l = data.length; i < l; i++) {
					if (i !== index) {
						var item = data[i];
						newList.push(item)
					}
				}
				JsonList.data = newList;
				localStorage['result'] = JSON.stringify(JsonList);
				bindList();
				return false;
			});
			//编辑
			$('body').on('click', '.js-edit', function() {
				var index = $(this).data('index');
				D[0].show();
				bindInfo(index);
				var dcontent = D[0].dialogContainer;
				$('.btn-submit', dcontent).val('修改');
				$('.btn-submit', dcontent).data('index', index);
				D[0].settings.beforeHide = function(d) {
					$('.btn-submit', d).val('提交');
				}
				return false;
			});

			function bindInfo(index) {
				var obj = JsonList.data[index];
				if (obj) {
					$('#sel_mainCategory').val(obj.mainCategory);
					bindDetailedCategory(obj.mainCategory);
					$('#sel_detailedCategory').val(obj.detailedCategory);
					$('[name="brandName"]').val(obj.brandName);
					$('[name="brandType"]').val(obj.brandType);
					$('[name="managementModel"]').val(obj.managementModel);
					$('[name="serviceLifeStartTime"]').val(obj.serviceLifeStartTime);
					$('[name="serviceLifeEndTime"]').val(obj.serviceLifeEndTime);
					$('[name="brandDescription"]').val(obj.brandDescription);
					$('[name="brandLogo"]').val(obj.brandLogo);
					$('.upload img').show().attr('src', obj.brandLogo);
				}
			}
		}
	}
});