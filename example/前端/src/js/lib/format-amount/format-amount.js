(function(root, factory) {
    //amd
    if (typeof define === 'function' && define.amd) {
        define(['$'], factory);
    } else if (typeof exports === 'object') { //umd
        module.exports = factory();
    } else {
        root.FormatAmount = factory(window.Zepto || window.jQuery || $);
    }
})(this, function($) {
    var FormatAmount = {
        init: function (parent) {
            var _this = this,
                minus = ''
            var excludeKey = {
                "left": 37,
                "right": 39,
                "top": 38,
                "down": 40,
                "home": 36,
                "end": 35,
                "shift": 16
            };
            //正则表达式列表
            var regexList = {
                "number": /([1-9]\d*(\.\d{1,2})?|0(\.\d{1,2})?)/,					//保留2位小数的数字
                "decimal4": /^\d{0,10}(\.\d{1,4})?$/
            };
            parent =parent||'body';
            $('*[data-type="money"]',parent).each(function (i, v) {
                var txt, formatTxt;
                if ($(v)[0].tagName == 'INPUT') {
                    txt = $(v).val();
                    if ($(v).attr('data-name')) {
                        var name = $(v).attr('data-name'),
                            id = name.split('.')[1] || name.split('.')[0];
                        $(v).parent().append('<input data-rule="money" id="' + id + '" type="hidden" name="' + name + '" />');
                        $('#' + id).val(_this.getMoneyfloat($(v).val()))
                    }
                    formatTxt = _this.doFormat(txt);
                    $(v).val(formatTxt);

                } else {
                    txt = $(v).text();
                    formatTxt = _this.doFormat(txt);
                    $(v).text(formatTxt);
                }
            });

            $('input[data-type="money"]',parent).on('keyup', function (e) {
                var name = $(this).attr('data-name'),
                    id = name.split('.')[1] || name.split('.')[0];

                GetNumberResult(e, $(this)[0], regexList.number);
                $('#' + id).val(_this.getMoneyfloat($(this).val()));

            });

            $('input[data-type="money"]',parent).on('blur', function (e) {
                if( $(this).val() == 0 ){
                	$(this).val('');
                }
            });
            /**
             * 在容器中动态插入需要格式化金额的input框
             */
            $('*[data-type="money-container"]',parent).on('keyup', function(e) {
                var target = e.target
                var name = $(target).attr('data-name'),
                    id = name.split('.')[1] || name.split('.')[0];

                if($(target).attr('data-type') === 'money') {
                    GetNumberResult(e, target, regexList.number);
                    if($('#' + id).length === 0 && target.tagName === 'INPUT') {
                        $(target).parent().append('<input data-rule="money" id="' + id + '" type="hidden" name="' + name + '" />');
                    }
                    $('#' + id).val(_this.getMoneyfloat($(target).val()));
                }
            })



            $('input[data-type="decimal4"]',parent).on('keyup', function (e) {

                GetNumberResult(e, $(this)[0], regexList.number);
                $(this).val(_this.getMoneyfloat($(this).val()));
                //$('#' + id).val( _this.getMoneyfloat( $(this).val() ) );

            });

            function GetNumberResult(e, obj, reg) {
                minus = ''
                if($(obj).hasClass('has-minus') && /^-/.test(obj.value)) {
                    minus = '-'
                }

                var valueLength = obj.value.length;
                var position = getTxtCursorPosition(obj);

                var key = window.event ? e.keyCode : e.which;
                var result = convertNumberN(key, obj.value, reg);
                result = minus + result.replace(/^-+/, '');
                obj.value = result
                position += (result.length - valueLength);
                setTxtCursorPosition(obj, position);

            }

            /**
             *   说明: 检查不做处理的键盘Key
             *   参数: 键盘KeyCode {string}
             * 返回值: 如果是不做处理的key返回true，反之false {bool}
             */
            function checkInactionKey(keyCode) {

                for (var key in excludeKey) {
                    if (keyCode == excludeKey[key]) {
                        return true;
                    }
                }
                return false;
            }

            /**
             *   说明: 获取文本框的光标位置
             *   参数: 文本框对象 {dom object}
             * 返回值: {int}
             */
            function getTxtCursorPosition(txtObj) {

                var tempObj = txtObj;
                var cursurPosition = -1;

                if (tempObj.selectionStart != undefined) {						//非IE浏览器
                    cursurPosition = tempObj.selectionStart;
                }
                else {											//IE
                    var range = document.selection.createRange();
                    range.moveStart("character", -tempObj.value.length);
                    cursurPosition = range.text.length;
                }

                return cursurPosition;
            }

            /**
             *   说明: 转换数字为千分位，常用于财务系统
             *   参数: 键盘key {string}，被处理的字符串 {string}
             * 返回值: 返回转换的结果 {string}
             */
            function convertNumberN(key, value, reg) {

                if (checkInactionKey(key)) {
                    return value;
                }

                var tempValue = value;
                var replaceReg = /[^\d\.]/g;

                if (tempValue.indexOf(".") <= 0) {
                    replaceReg = /[^\d]/g;
                    tempValue = tempValue.replace(replaceReg, "");
                }
                else {

                    tempValue = tempValue.replace(replaceReg, "");
                    var isNaNNum = parseFloat(tempValue + "00");
                    if (isNaN(isNaNNum)) {
                        tempValue = isNaNNum;
                    }
                }

                if (!reg.exec(tempValue)) {
                    return "";
                }

                if (tempValue.indexOf("0") == 0) {
                    tempValue = tempValue.replace(/0+((\.\d{0,2}).*)?/, "$2");
                }

                if (tempValue == "" || tempValue.indexOf(".") == 0) {
                    tempValue = "0" + tempValue;
                }

                var tempValueArray = tempValue.split(".");
                tempValue = tempValueArray.length > 1 ?
                    (tempValueArray[0].length > 14 ? tempValueArray[0].substr(0, 14) : tempValueArray[0]) + "." + tempValueArray[1] :
                    (tempValue.length > 14 ? tempValue.substr(0, 14) : tempValue);


                var result = _this.doFormat(tempValue);

                if (result == null) {
                    return;
                }

                var resultArray = result.split(".");

                if (tempValue.lastIndexOf(".") >= 0) {
                    if (tempValue.lastIndexOf(".") == tempValue.length - 1) {
                        tempValue = resultArray[0] + '.';
                    } else {
                        var subLength = tempValue.length - (tempValue.lastIndexOf(".") + 1);
                        tempValue = resultArray[0] + "." + (resultArray[1] ? resultArray[1].substring(0, subLength) : '0');
                    }
                } else {
                    tempValue = resultArray[0];
                }


                return tempValue;
            }

            /**
             *   说明: 设置文本框的光标位置
             *   参数: 文本框对象 {dom object}, 光标的位置 {int}
             * 返回值: {void}
             */
            function setTxtCursorPosition(txtObj, pos) {

                var tempObj = txtObj;
                var cursurPosition = -1;

                if (tempObj.selectionStart != undefined) {						//非IE浏览器
                    tempObj.setSelectionRange(pos, pos);
                }
                else {											//IE
                    var range = tempObj.createTextRange();
                    range.move("character", pos);
                    range.select();
                }
            }
        },
        getMoneyfloat: function (s) {
            if (s == '') {
                return null;
            }
            return parseFloat((s + "").replace(/[^\d\.-]/g, ""));
        },
        doFormat: function (s) {

            if (!s) return;

            if ($.isNumeric(s)) {
                s = s.toString();
            }
            if (typeof s === 'string') {
                s = s.replace(/,/g, '').toString().replace(/^(-)?(\d*)$/, "$1$2.");
                s = (s + "00").replace(/(-)?(\d*\.\d\d)\d*/, "$1$2");
                s = s.replace(".", ",");
                var re = /(\d)(\d{3},)/;
                while (re.test(s)) s = s.replace(re, "$1,$2");
                s = s.replace(/,(\d\d)$/, ".$1");
                //s = s.replace(".00", "");
            }

            return  s.replace(/^\./, "0.")
        }
    };
    return FormatAmount;
});