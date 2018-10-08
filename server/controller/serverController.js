const crypto = require('crypto');
const config = require('../config/config.json');
const key = config.key;

// ログインされているか判別
const checkAuthentication = function(req,res,next){
    if(req.isAuthenticated()){
        //req.isAuthenticated() will return true if user is logged in
        next();
    } else{
        res.redirect("/");
    }
};

//ハッシュ化
const gethash = function(password){
    let sha256 = crypto.createHmac("sha256",password);
    sha256.update(password);
    let hash = sha256.digest('hex');
    //console.log(hash.length)
    return hash.toString()
};

//暗号化
const encrypt = function(text){
    let cipher = crypto.createCipher('aes-256-ctr',key);
    let crypted = cipher.update(text,'utf8','hex');
    crypted += cipher.final('hex');
    return crypted;
};

//復元
const decrypt = function(text){
    let decipher = crypto.createDecipher('aes-256-ctr',key);
    let dec = decipher.update(text,'hex','utf8');
    dec += decipher.final('utf8');
    return dec;
};

module.exports = {checkAuthentication, gethash, encrypt, decrypt};