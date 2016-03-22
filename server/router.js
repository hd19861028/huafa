"use strict";

var express = require('express');
var middleware = require('./middleware');
var weixin = express();

weixin.use(middleware.cookieParse);

exports = module.exports;

weixin.all('*', function(req, res) {
	res.locals.openid = req.cookies(global.ckey.openid);

	req.next();
});

var ws = require('./weixin');

weixin.use('/weixin', ws.api);

exports.start_paraller = function(workid, processid) {
	global.config.cluster = {
		wid: workid,
		pid: processid
	}
	if (global.config.weixin_port && global.config.weixin_port > 0) {
		weixin.listen(global.config.weixin_port);
	}
}