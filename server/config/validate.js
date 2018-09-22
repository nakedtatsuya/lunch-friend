let validate = require("validate.js");
let constraints = {
		station: {
				presence: true,
				length: {
						minimum: 1,
						tooShort: "^お店の場所を入力してください",
						maximum: 15,
						tooLong: "^場所は１５文字以内で入力でしてください"
				}
		},
		store: {
				presence: true,
				length: {
						minimum: 1,
						tooShort: "^お店の名前を入力してください",
						maximum: 15,
						tooLong: "^お店の名前は１５文字以内で入力でしてください"
				}
		},
		link: {
				presence: true,
				length: {
						minimum: 1,
						tooShort: "^参考リンクを入力してください",
						maximum: 10,
						tooLong: "^参考リンクは255文字以内で入力でしてください"
				}
		},
		time: {
				presence: true
		},
		minute: {
				presence: true
		},
		num: {
				presence: true
		},
		comment: {
				presence: true,
				length: {
						minimum: 1,
						tooShort: "^コメントを１文字以上入力してください",
						maximum: 140,
						tooLong: "^コメントは１４０文字までしか入力できません"
				}
		}
};

module.exports = {validate, constraints};