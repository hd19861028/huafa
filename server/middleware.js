var querystring = require('querystring');
var secret = require('common').secret;

exports = module.exports;

exports.cookieParse = function(req, res, next) {

	req.cookies = function(key) {
		var cookie = querystring.parse(req.headers.cookie, '; ');
		var result = cookie[key];
		return result ? result : null;
	}

	req.cookiesSafe = function(key) {
		var value = req.cookies(key);
		return value ? secret.unsign(value) : "";
	}

	res.setCookies = function(key, value, timeout) {
		timeout = timeout && timeout > 0 ? timeout : 0;
		var options = {
			httpOnly: false,
			path: '/'
		};
		if (value) {
			if (timeout > 0) {
				timeout += 28800000;
				options.maxAge = timeout;
			}
			res.cookie(key, value, options);
		} else {
			res.clearCookie(key, options);
		}
	}

	res.setCookiesSafe = function(key, value, timeout) {
		value = value ? secret.sign(value) : "";
		res.setCookies(key, value, timeout);
	}

	next();
}

exports.removeHeader = function(req, res, next) {
	var remove = function() {
		res.removeHeader('X-Powered-By');
	}
	var _send = res.send;
	res.send = function() {
		remove();
		return _send.apply(res, arguments);
	};
	var _json = res.json;
	res.json = function() {
		remove();
		return _json.apply(res, arguments);
	};
	next();
}