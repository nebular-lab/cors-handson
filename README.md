# cors-handson

同一オリジンポリシーと CORS の動きを、ブラウザで確かめるデモです。

| 画面 | URL | 内容 |
|---|---|---|
| 正規サイト | http://site.example:3000/mypage.html | ログイン中のユーザーの個人情報。API は `/api/user` |
| 連携サービス | http://partner.site.example:3000/partner.html | 正規サイトの API を使いたい、同じ会社の別サイト |
| 罠サイト | http://attacker.example:3000/trap.html | 4つのボタンで、正規サイトの個人情報を盗もうとする |

CORS の設定は `cors.js` にあり、ブランチで切り替えます。

| ブランチ | CORS の設定 |
|---|---|
| `main` | なし |
| `cors-on` | あり（連携サービスと正規サイトのオリジンだけを許可） |

## セットアップ

1. hosts に3行追加します（sudo が必要です）。

   ```bash
   echo "127.0.0.1 site.example" | sudo tee -a /etc/hosts
   echo "127.0.0.1 partner.site.example" | sudo tee -a /etc/hosts
   echo "127.0.0.1 attacker.example" | sudo tee -a /etc/hosts
   ```

2. クローンして起動します。

   ```bash
   git clone https://github.com/nebular-lab/cors-handson.git
   cd cors-handson
   npm install
   npm start
   ```

`npm start` は `node --watch` で動くので、ブランチを切り替えるとサーバーが自動で再起動します。API に届いたリクエストは、ターミナルに1行ずつ表示されます。

## 動作確認

### CORS の設定なし（main）

1. 罠サイトを開き、攻撃1〜4のボタンを押します。すべて「🛡 防がれた」になります。
2. 連携サービスを開き、「マイページの情報を取得する」を押します。取得に失敗します。
3. ターミナルのログで、罠サイトからのリクエストを確かめます。

   | ボタン | ログ |
   |---|---|
   | 攻撃1 | 何も出ない（iframe の中を読むだけで、リクエストは送らない） |
   | 攻撃2 | `GET` が届いている。`Allow-Origin: なし` |
   | 攻撃3 | `OPTIONS` だけが届いている。本番の `GET` は送られていない |
   | 攻撃4 | `GET` が届いているが、`X-Token: なし` |

### CORS の設定あり（cors-on）

```bash
git switch cors-on
```

ターミナルに `===== CORSの設定あり：… =====` と出たら、数秒待ってから試します。

1. 連携サービスで「マイページの情報を取得する」を押します。取得に成功します。
2. 罠サイトで攻撃1〜4のボタンを押します。すべて「🛡 防がれた」のままです。ログを見ると、罠サイトへの返事は `Allow-Origin: なし` です。

追加した設定は、次のコマンドで確かめられます。

```bash
git diff main cors-on -- cors.js
```

`main` に戻すときは `git switch main` を実行します。
