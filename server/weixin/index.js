"use strict";
var express = require('express');
var app = express();
var http = require("http");
var crypto = require("crypto");
var common = require("common").common;
var weixin = require('common').weixin;
var sec = require('common').secret;
var request = require('common').request;
var config = global.config.website;
var q = require('common').async.q;

exports = module.exports;

app.get('*', function(req, res) {
	var webbase = "wx";
	var web = 'http://' + config.domain + '/index.html';

	var check_code = function() {
		var d = q.defer();
		if (req.query && req.query.code) {
			d.resolve(true);
		} else {
			d.resolve(false);
		}
		return d.promise;
	}
	var valid_token = function() {
		var date = new Date();
		date.setMonth(date.getMonth() + 1);
		res.set({
			'Expires': date,
			'Content-Type': 'application/json'
		});
		var result = weixin.validateToken(req.query);
		res.end(result);
	}
	var weixin_check = function() {
		var d = q.defer();
		var openid = res.locals.openid

		if (openid) {
			d.resolve(openid);
		} else {
			var code = req.query.code;
			var appid = config.appid;
			var secret = config.secret;
			var url = "https://api.weixin.qq.com/sns/oauth2/access_token?appid=" + appid + "&secret=" + secret + "&code=" + code + "&grant_type=authorization_code";
			request.send(url, {})
				.then(function(msg) {
					if (msg && msg.openid) {
						d.resolve(msg.openid);
					} else {
						d.resolve(null);
					}
				}, function(err) {
					console.error("/weixin/index.js --> line: 119")
					console.error(err)
				})
		}
		return d.promise;
	}
	var process_openid = function(openid) {
		res.setCookies(global.ckey.openid, openid, config.openid_expire);
		res.redirect(web);
	}

	check_code()
		.then(function(data) {
			if (data) {
				return weixin_check();
			} else {
				valid_token();
			}
		})
		.then(function(msg) {
			if (msg)
				return process_openid(msg);
		})
		.catch(function(error) {
			res.status(500).send(error);
		});
});

exports.api = app;