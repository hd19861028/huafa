document.getElementsByTagName('body')[0].addEventListener('touchmove', function(e) {
	e.preventDefault();
});

function swipt(id, callbackLeft, callbackRight) {
	var ele = document.getElementById(id);
	var x, lastX;
	ele.ontouchstart = function(e) {
		x = e.touches[0].clientX;
	};
	ele.ontouchend = function() {
		if (x - lastX >= 30) {
			callbackLeft();
		}
		//alert(lastX - x)
		if (lastX - x >= 30) {
			if(callbackRight)
				callbackRight();
		}
	};
	ele.ontouchmove = function(e) {
		lastX = e.touches[0].clientX;
	};
}

/**
 * 检查浏览器版本<br>
 * MEIE: 是ie，则返回7|8|9|10，不是，则返回-1<br>
 * Chrome: 返回true|false<br>
 * Mozilla: 返回true|false<br>
 * Opera: 返回true|false<br>
 * Safari: 返回true|false<br>
 * Mobile: 返回2|3|4|5|6|9|10|11, 表示android|ipod|ipad|iphone|blackberry|ie9|ie10|ie11
 */
var Browser = {
	MSIE: function() {
		var browser = navigator.userAgent.toLowerCase();
		var result = -1;
		result = /msie/.test(browser) ? parseInt(browser.match(/msie ([^;]+)/)[1]) : result;
		result = result == -1 && /trident/.test(browser) ? 11 : result;
		return result;
	},
	Chrome: /chrome/.test(navigator.userAgent.toLowerCase()),
	Mozilla: /firefox/.test(navigator.userAgent.toLowerCase()),
	Opera: /opr/.test(navigator.userAgent.toLowerCase()),
	Safari: /safari/.test(navigator.userAgent.toLowerCase()),
	Mobile: function() {
		var result = -1;
		var ua = navigator.userAgent.toLowerCase();
		//ios mobile
		if (ua.match(/ mobile\//i)) {
			result = ua.match(/ipod;/i) ? 3 : result;
			result = ua.match(/ipad;/i) ? 4 : result;
			result = ua.match(/iphone;/i) ? 5 : result;
		}
		//android
		result = ua.match(/android|linux/i) ? 2 : result;
		//blackberry
		result = ua.match(/bb10|playbook|blackberry/i) ? 6 : result;
		//windows phone
		result = ua.match(/iemobile/i) ? parseInt(ua.match(/iemobile\/([^;]+)/)[1]) : result;
		return result;
	},
	GetWhichBrowser: function() {
		var brower = this.Mobile();
		var result;
		result = brower == 2 ? "android" : result;
		result = brower == 3 ? "ipod" : result;
		result = brower == 4 ? "ipad" : result;
		result = brower == 5 ? "iphone" : result;
		result = brower == 6 ? "blackberry" : result;
		result = brower >= 9 && brower <= 11 ? "ie mobile " + brower : result;
		if (!result) {
			//ie -> oprea -> firefox -> chrome -> safari
			brower = this.MSIE();
			result = brower > -1 ? "ie " + brower : result;
			result = (!result && this.Opera) ? "opera" : result;
			result = (!result && this.Mozilla) ? "firefox" : result;
			result = (!result && this.Chrome) ? "chrome" : result;
			result = (!result && this.Safari) ? "safari" : result;
		}
		return result;
	}
};

var Cookies = {
	/**
	 * 根据key获取cookie的值
	 */
	Get: function(key) {
		var arr, reg = new RegExp("(^| )" + key + "=([^;]*)(;|$)");
		if (arr = document.cookie.match(reg))
			return unescape(arr[2]);
		else
			return null;
	},
	/**
	 * 设置cookie的值，第3个参数days为可选参数，默认30天
	 */
	Set: function(key, value, days, hours, minutes, seconds) {
		var Days = (days > 0) ? days : 30;
		var Hours = (hours > 0) ? hours : 0;
		var Minutes = (minutes > 0) ? minutes : 0;
		var Seconds = (seconds > 0) ? seconds : 0;

		var exp = new Date();
		exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000 + Hours * 60 * 60 * 1000 + Minutes * 60 * 1000 + Seconds * 1000);
		document.cookie = key + "=" + escape(value) + ";expires=" + exp.toGMTString();
	},
	/**
	 * 根据指定的key删除cookie的值
	 */
	Del: function(key) {
		var exp = new Date();
		exp.setTime(exp.getTime() - 1);
		var cval = getCookie(key);
		if (cval != null)
			document.cookie = key + "=" + cval + ";expires=" + exp.toGMTString();
	}
}

/**
 * Html5的Web存储功能<br>
 * <b>功能概要</b><br>
 * Session对象：使用Session Storage<br>
 * Local对象：使用Local Storage<br>
 * Listen对象：用于监听Session或者Local中某个参数的变化以及Web存储使用量的统计<br>
 */
var WebStorage = {
	/** Session对象的Get，Set，Del，Clear，CanSupport */
	Session: {
		Set: function(key, value) {
			window.sessionStorage.setItem(key, value);
		},
		Get: function(key) {
			return window.sessionStorage.getItem(key);
		},
		Del: function(key) {
			window.sessionStorage.removeItem(key);
		},
		Clear: function() {
			window.sessionStorage.clear();
		},
		CanSupport: function() {
			if (window.sessionStorage) {
				return true;
			}
			return false;
		}
	},
	/** Local对象的Get，Set，Del，Clear，CanSupport */
	Local: {
		Set: function(key, value) {
			window.localStorage.setItem(key, value);
		},
		Get: function(key) {
			return window.localStorage.getItem(key);
		},
		Del: function(key) {
			window.localStorage.removeItem(key);
		},
		Clear: function() {
			window.localStorage.clear();
		},
		CanSupport: function() {
			if (window.localStorage) {
				return true;
			}
			return false;
		}
	}
}

/**
 * Json处理功能<br>
 * <b>功能概要</b><br>
 * ToString：将Json转换为String<br>
 * ToJson：将String转换为Json<br>
 * MergeJson：用第一个json覆盖第二个json, 并且输出合并后的json<br>
 */
var Json = {
	ToString: function(json) {
		return escape(JSON.stringify(json));
	},
	ToJson: function(data) {
		if (data) {
			data = unescape(data);
			if (window.JSON && window.JSON.parse) {
				return JSON.parse(data);
			} else {
				if (typeof data === "string") {
					data = data.Trim();
					data = data.replace(/\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g, "@")
						.replace(/"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/, "]")
						.replace(/(?:^|:|,)(?:\s*\[)+/g, "");
					if (/^[\],:{}\s]*$/.test(data)) {
						return data;
					}
				}
			}
		} else
			return null;
	},
	Merge: function(jsonA, jsonB) {
		if (!jsonA && !jsonB) {
			return null;
		}
		if (jsonA && !jsonB) {
			return jsonA;
		}
		if (!jsonA && jsonB) {
			return jsonB;
		}
		for (var key in jsonA) {
			jsonB[key] = jsonA[key];
		}
		return jsonB;
	}
}

/** 传入参数名称，从当前url中获取参数的值 */
function GetUrlParam(name) {
	try {
		var reg = new RegExp("(^|&)" + name.toLowerCase() + "=([^&]*)(&|$)");
		var r = window.location.search.toLowerCase().substr(1).match(reg);
		if (r != null) return unescape(r[2]).replace(/</, "&lt;").replace(/>/, "&gt;");
		return "";
	} catch (e) {

	}
}

/** 延迟second秒执行函数action */
function Delay(second, action) {
	var timer = window.setInterval(function() {
		action();
		window.clearInterval(timer);
	}, second * 100);

}

/**
 * 扩展方法：日期类型格式化成指定格式的字符串形式，参数形式yyyy-MM-dd HH:mm:ss
 */
Date.prototype.ToFormatString = function(format) {
	var formatstr = format;
	if (format != null && format != "") {
		if (formatstr.indexOf("yyyy") >= 0) {
			formatstr = formatstr.replace("yyyy", this.getFullYear());
		}
		if (formatstr.indexOf("MM") >= 0) {
			var month = this.getMonth() + 1;
			if (month < 10) {
				month = "0" + month;
			}
			formatstr = formatstr.replace("MM", month);
		}
		if (formatstr.indexOf("dd") >= 0) {
			var day = this.getDay();
			if (day < 10) {
				day = "0" + day;
			}
			formatstr = formatstr.replace("dd", day);
		}
		var hours = this.getHours();
		if (formatstr.indexOf("HH") >= 0) {
			if (month < 10) {
				month = "0" + month;
			}
			formatstr = formatstr.replace("HH", hours);
		}
		if (formatstr.indexOf("hh") >= 0) {
			if (hours > 12) {
				hours = hours - 12;
			}
			if (hours < 10) {
				hours = "0" + hours;
			}
			formatstr = formatstr.replace("hh", hours);
		}
		if (formatstr.indexOf("mm") >= 0) {
			var minute = this.getMinutes();
			if (minute < 10) {
				minute = "0" + minute;
			}
			formatstr = formatstr.replace("mm", minute);
		}
		if (formatstr.indexOf("ss") >= 0) {
			var second = this.getSeconds();
			if (second < 10) {
				second = "0" + second;
			}
			formatstr = formatstr.replace("ss", second);
		}
	}
	return formatstr;
}

/**
 * 根据url加载样式表，(相对路径,如css/bootstrap3/bootstrap.css)
 */
function LoadStyle(url) {
	if (!url) return;
	url = GetBaseUrl() + url;
	try {
		document.createStyleSheet(url);
	} catch (e) {
		var cssLink = document.createElement('link');
		cssLink.rel = 'stylesheet';
		cssLink.type = 'text/css';
		cssLink.href = url;
		var head = document.getElementsByTagName('head')[0];
		head.appendChild(cssLink);
	}
}

var Screen = {
	/**
	 * 获取页面可视宽度
	 */
	ViewWidth: function() {
		var d = document;
		var a = d.compatMode == "BackCompat" ? d.body : d.documentElement;
		return a.clientWidth;
	},
	/**
	 * 获取页面浏览器的真实宽度
	 */
	Width: function() {
		var g = document;
		var a = g.body;
		var f = g.documentElement;
		var d = g.compatMode == "BackCompat" ? a : g.documentElement;
		return Math.max(f.scrollWidth, a.scrollWidth, d.clientWidth);
	},
	/**
	 * 获取页面可视高度
	 */
	ViewHeight: function() {
		var d = document;
		var a = d.compatMode == "BackCompat" ? d.body : d.documentElement;
		return a.clientHeight;
	},
	/**
	 * 获取页面浏览器的真实高度
	 */
	Height: function() {
		var g = document;
		var a = g.body;
		var f = g.documentElement;
		var d = g.compatMode == "BackCompat" ? a : g.documentElement;
		return Math.max(f.scrollHeight, a.scrollHeight, d.clientHeight);
	},
	/**
	 * 获取元素的绝对Y坐标
	 */
	Top: function(e) {
		var offset = e.offsetTop;
		if (e.offsetParent != null) offset += Screen.Top(e.offsetParent);
		return offset;
	},
	/**
	 * 获取元素的绝对X坐标
	 */
	Left: function(e) {
		var offset = e.offsetLeft;
		if (e.offsetParent != null) offset += Screen.Left(e.offsetParent);
		return offset;
	},
	/**
	 * 获取滚动条顶部距离页面顶部的高度
	 */
	ScrollBar: function() {
		var scrollPos;
		if (window.pageYOffset) {
			scrollPos = window.pageYOffset;
		} else if (document.compatMode && document.compatMode != 'BackCompat') {
			scrollPos = document.documentElement.scrollTop;
		} else if (document.body) {
			scrollPos = document.body.scrollTop;
		}
		return scrollPos;
	}
}

/** 检查元素是否存在于数组之中 */
Array.prototype.IsInArray = function(n) {
	var index = -1;
	for (var i = 0; i < this.length; i++) {
		if (this[i] == n) {
			index = i;
		}
	}
	return index;
}

Array.prototype.RemoveAt = function(n) {
	if (n < 0) {
		return this;
	} else {
		var back = this.slice(n + 1, this.length);
		var front = this.slice(0, n);
		return front.concat(back);
	}
}