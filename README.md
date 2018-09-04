# README

# 使い方
まずプロジェクトをクローンしてください。

そのあと 

```$xslt
npm install
```

```$xslt
node server/server.js
```

http://localhost:3000/にアクセスできれば成功


# db
mongodbでmongooseを使ってます。初期設定はここ
[dbのqiita](https://qiita.com/tatsuyafukui/items/3d3902c2467cb6bd743b)

ツールで「Robo 3T」というのを使ってます。
[Robo 3T](https://robomongo.org/)

ここからダウンロードして起動してください。

起動したら

１、左上のcreate
２、名前はLocal Mongo Databaseにしてます
３、アドレスはlocalhostで27017でsaveしてconnect


# フォルダ構成

### server
#### server.js
server系の処理。メイン処理
 
#### config
DB系の環境を本番・開発・テストで使い分ける設定フォルダ

#### db
mongooseの接続設定

#### model
テーブル定義とモデルのメソッド
 
### public
 ・CSS
 ・JS
 ・IMAGE
 
### view
画面系

#### form
form系まとめようとしたけどpartialでいいかも

#### partial
共有画面


ざっと以上です。

