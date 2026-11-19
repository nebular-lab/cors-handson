const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("./cors");

const app = express();
const port = 3000;

// CORS の設定を切り替えたとき、前の設定の CORS ヘッダ付きレスポンスが
// ブラウザのキャッシュ（ETag による 304 応答）から再利用されないようにする
app.set("etag", false);

app.use(express.static(path.join(__dirname, "public")));

// ------------------------------------------------------------
// 正規サイトの API（http://site.example:3000/api/...）
// ------------------------------------------------------------

// 届いたリクエストと、サーバーが返した CORS ヘッダをターミナルに表示する
app.use("/api", (req, res, next) => {
  const time = new Date().toLocaleTimeString("ja-JP");
  const requestHeaders = req.headers["access-control-request-headers"];
  res.set("Cache-Control", "no-store");
  res.on("finish", () => {
    const allowOrigin = res.getHeader("Access-Control-Allow-Origin") ?? "なし";
    let line =
      `[${time}] ${req.method.padEnd(7)} ${req.originalUrl}  Origin: ${req.headers.origin ?? "-"}` +
      `  → Allow-Origin: ${allowOrigin}`;
    if (req.method === "OPTIONS") {
      line += `  （要求ヘッダ: ${requestHeaders ?? "-"} → Allow-Headers: ${res.getHeader("Access-Control-Allow-Headers") ?? "なし"}）`;
    } else {
      line += `  （X-Token: ${req.headers["x-token"] ? "あり" : "なし"}）`;
    }
    console.log(line);
  });
  next();
});

// CORS の設定（cors.js。設定なし／ありを切り替えると、このファイルだけが変わる）
app.use("/api", cors);

// ログイン中ユーザーの個人情報を返す API（デモのため認証は省略）
app.get("/api/user", (req, res) => {
  res.json({
    loginId: "frontend_security",
    email: "frontend-security@mail.example",
    address: "東京都○○1-2-3",
  });
});

app.listen(port, () => {
  // cors.js の1行目（「// CORSの設定なし」など）を、今動いている設定として表示する
  const step = fs.readFileSync(path.join(__dirname, "cors.js"), "utf8").split("\n")[0].replace(/^\/\/\s*/, "");
  console.log(`\n===== ${step} =====`);
  console.log(`正規サイト:     http://site.example:${port}/mypage.html`);
  console.log(`罠サイト:       http://attacker.example:${port}/trap.html`);
  console.log(`連携サービス:   http://partner.site.example:${port}/partner.html\n`);
});
