"use strict";

var fi = require('common').fileinfo;
var json = require("./config");

json.istest = false;
json.root = __dirname;

fi.Dir.ExistsAndCreateSync(path.join(json.root, 'log'));

global.config = json;
//cookie的key
global.ckey = {
	id: "id",
	memberid: "memberid",
	openid: "openid"
};

require('common').prototype;