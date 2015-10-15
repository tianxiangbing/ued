/*
 * Created with Sublime Text 2.
 * User: 田想兵
 * Date: 2015-06-15
 * Time: 9:27:54
 * Contact: 55342775@qq.com
 */
;
(function(root, factory) {
	//amd
	if (typeof define === 'function' && define.amd) {
		define(['$', 'dialog'], factory);
	} else {
		root.Index = factory($, Dialog);
	}
})(this, function($, dialog) {
	return {
		init: function() {
			var validateData = {
				email: false,
				phone: false,
				msg: false,
				pwd: false,
				pwdAgin: false
			};
			$('.txt-input').focus(function() {
				$(this).addClass('focus');
				$(this).nextAll(".tips").show();
			}).blur(function(e,b) {
				$(this).removeClass('focus');
				//validate;
				validate(this,b);
			});

			function showok(input, text) {
				$(input).nextAll('.tips').show().children().removeClass('error').addClass('ok').html(text);
				$(input).removeClass('error');
			}

			function showerror(input, text) {
				$(input).nextAll('.tips').show().children().removeClass('ok').addClass('error').html(text);
				$(input).addClass('error');
			}
			$('[required]').each(function() {
				$(this).blur(function() {
					if ($(this).val().length == 0) {
						showerror($(this), $(this).attr('required-msg'));
					}
				});
			});

			function validate(input,b) {
				var t = $(input).data('type');
				var v = $(input).val();
				if (v.length == 0) {
					return false;
				}
				switch (t) {
					case "email":
						{
							var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
							if (reg.test(v)) {
								/*
									showok(input, "");
									validateData.email = true;
									*/
								if(b)return;
								var url = $(input).data('validate')
								$.post(url, {
									user_email: v
								}, function(result) {
									if (result.status) {
										showok(input, "");
										validateData.email = true;
									} else {
										showerror(input, result.msg);
										validateData.email = true;
									}
								});
							} else {
								showerror(input, '邮箱格式错误');
								validateData.email = false;
							}
						}
						break;
					case "phone":
						{
							var reg = /^[1]\d{10}$/;
							if (reg.test(v)) {
								//showok(input, "");
								//validateData.phone = true;
								if(b)return;
								var url = $(input).data('validate')
								$.post(url, {
									user_mobile: v
								}, function(result) {
									if (result.status) {
										showok(input, "");
										validateData.phone = true;
									} else {
										showerror(input, result.msg);
										validateData.phone = true;
									}
								});
							} else {
								showerror(input, '手机号码格式错误');
								validateData.phone = false;
							}
						}
						break;
					case "msg":
						{
							if (v.length > 0) {
								if(b)return;
								$.post($(input).data('validate'), {
									value: $(input).val()
								}, function(result) {
									if (result.status) {
										showok(input, "");
										validateData.msg = true;
									} else {
										showerror(input, "短信验证码错误！")
										validateData.msg = false;
									}
								}, 'json');
							}
						}
						break;
					case "pwd":
						{
							if (v.length >= 6 && v.length < 32) {
								showok(input, "");
								validateData.pwd = true;
							} else {
								validateData.pwd = false;
								showerror(input, "登录密码必须在6-32个字符之间")
							}
						}
						break;
					case "pwdAgin":
						{
							if (v == $('[data-type="pwd"]').val()) {
								showok(input, "");
								validateData.pwdAgin = true;
							} else {
								validateData.pwdAgin = false;
								showerror(input, "两次输入不一致")
							}
						}
						break;
				}
			}
			$('#js-btn-getValidate').click(function() {
				if (!$(this).hasClass('sended')) {
					$(this).addClass('sended');
					var _this = this;
					$.post($(this).data('ajax'), function(result) {
						if (result.status) {
							var sec = 59;
							$(_this).nextAll('.tips').show().children().removeClass('ok').removeClass('error').html("已发送，1分钟后重新获取.");
							var t = setInterval(function() {
								$(_this).val('重新获取（' + sec + '）');
								sec--;
								if (t <= 0) {
									clearInterval(t);
									$(_this).val('获取短信验证码');
									$(_this).removeClass('sended');
								}
							}, 1000);
						} else {
							$.alert(result.msg);
							$(_this).removeClass('sended');
						}
					}, 'json');
				};
			});
			$('.js-regist').submit(function() {
				var form = this;
				$('input', this).each(function() {
					$(this).trigger('blur',true);
				});
				for (var i in validateData) {
					if (!validateData[i]) {
						return false;
					}
				}
				var url = $(this).attr("action");
				var data = $(this).serialize();
				$.post(url, data, function(result) {
					if (result.status) {
						location.href = $(form).data('next');
					} else {
						$.alert(result.msg);
					}
				});
				return false;
			});
			$('.js-agreement').each(function() {
				var target = $($(this).data('target'));
				$(this).Dialog({
					target: target,
					mask: true,
					closeTpl: '<span class="ui-dialog-close ui-dialog-close2 js-dialog-close"></span>'
				});
			});

		}
	}
});