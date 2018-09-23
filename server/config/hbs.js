let hbs = require('hbs');
const path = require('path');
const partialsPath = path.join(__dirname, '../../views/partials');
let moment = require('moment');
const now = moment();

hbs.registerPartials(partialsPath);
hbs.registerHelper('getPostTime', function (timestamp) {
		// 第二引数を省略するとmsを返す
		const ms = now.diff(timestamp); // 31579200000
		let minute = Math.ceil(ms / 1000 / 60);//分に変換
		let postString;
		let day;
		let houre = "";
		if(minute >= 60) {
				houre = Math.floor(minute / 60);
				postString = houre.toString() + "時間前";
				if(houre >= 24 && houre < 168) {
						postString = Math.floor(houre / 24).toString() + "日前";
				}else if(houre >= 168) {
						postString = moment(timestamp).format("YYYY/M/DD");
				}
		}else {
				postString = (minute % 60).toString() + "分前";
		}
		return new hbs.SafeString(postString);
});

module.exports = hbs;