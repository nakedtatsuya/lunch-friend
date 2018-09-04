//test実行時はtestが環境変数に代入される。package設定
let env = process.env.NODE_ENV || 'development';

if(env === 'development' || env === 'test'){
		let config = require('./config.json');
		let envConfig = config[env];

		Object.keys(envConfig).forEach(key => {
				process.env[key] = envConfig[key];
		});
}